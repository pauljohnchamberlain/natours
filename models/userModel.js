const crypto = require('crypto'); // built-in module in node.js, no need to install
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'], // this is an enum validator
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    select: false, // will not show up in any output
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// .pre middleware functions are executed after getting the data and before saving the data to the database
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  // 12 is the cost parameter, the higher the cost the more CPU intensive the process will be, the longer it will take, but the more secure the password will be
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// instance method, available on all documents of a certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this.password is not available because select: false is set in the schema
  // candidatePassword is the password that the user enters
  // userPassword is the password in the database
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // this.passwordChangedAt is not available because select: false is set in the schema
  if (this.passwordChangedAt) {
    // console.log(this.passwordChangedAt, JWTTimestamp);
    // convert the passwordChangedAt to seconds
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // if the password was changed after the token was issued
    return JWTTimestamp < changedTimestamp; // 100 < 200 => true
  }

  // false means NOT changed
  return false;
};

// instance method, available on all documents of a certain collection
userSchema.methods.createPasswordResetToken = function () {
  // create a random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // encrypt the token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // set the passwordResetExpires field to 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // return the unencrypted token
  return resetToken;
};

const User = mongoose.model('User', userSchema); // creating the model

module.exports = User; // exporting the model
