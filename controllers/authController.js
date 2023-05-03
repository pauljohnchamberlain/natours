const crypto = require('crypto');
const { promisify } = require('util'); // built-in node module
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const { exec } = require('child_process');
const { stack } = require('../app');

// create a token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  }); // create a new document in the database

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body; // destructuring

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400)); // 400 is bad request
  }
  // 2) Check if user exists && password is correct
  // +password is to select the password field which is set to select: false in the schema
  const user = await User.findOne({ email }).select('+password');

  // correctPassword is an instance method defined in userModel.js
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401)); // 401 is unauthorized
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  }); // 200 is ok
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it exists
  // convention is to use the header to send the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // convention is to use the header to send the token
    token = req.headers.authorization.split(' ')[1]; // the token is the second element in the array
  }

  // when there is no token
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access!', 401)
    ); // 401 is unauthorized
  }

  // 2) Verification token
  // jwt.verify() is an async function
  // jwt.verify() will throw an error if the token is invalid
  // jwt.verify() will return a payload if the token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // promisify() is a function that returns a promise
  // console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id); // decoded.id is the id of the user
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists!', 401)
    ); // 401 is unauthorized
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    // decoded.iat is the time when the token was issued
    return next(
      new AppError('User recently changed password! Please log in again!', 401)
    ); // 401 is unauthorized
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser; // pass the user data to the next middleware
  next();
});

exports.restrictTo =
  (...roles) =>
  // roles is an array
  (req, res, next) => {
    // req.user is from the protect middleware
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      // check if the user role is in the roles array
      // req.user.role is from the protect middleware
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      ); // 403 is forbidden
    }

    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  console.log(req.body.email);
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // disables all the validators in the schema

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {});
