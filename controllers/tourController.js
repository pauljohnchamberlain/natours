// const fs = require('fs');
const { query } = require('express'); // eslint-disable-line no-unused-vars
const Tour = require('./../models/tourModel'); // import the Tour model
const APIFeatures = require('./../utils/apiFeatures'); // import the APIFeatures class
const catchAsync = require('./../utils/catchAsync'); // import the catchAsync function
const AppError = require('./../utils/appError'); // import the AppError class

exports.aliasTopTours = (req, res, next) => {
  // middleware to add query strings to the request object
  // eslint-disable-next-line no-param-reassign
  req.query.limit = '5';
  // eslint-disable-next-line no-param-reassign
  req.query.sort = '-ratingsAverage,price';
  // eslint-disable-next-line no-param-reassign
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// This is how to import data from a JSON file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// middleware to check if the ID is valid
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// middleware to check if the body has the required fields
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

exports.getAllTours = catchAsync(async (req, res, next) => {
  //   console.log(req.requestTime);

  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  // query.sort().select().skip().limit()

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });

  // No need for error handling when the user is requesting all tours

  // Code used before implementing the catchAsync function
  //   try {
  //     // console.log(req.query);
  //     // BUILD QUERY
  //     // 1A) Filtering
  //     // const queryObj = { ...req.query };
  //     // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  //     // excludedFields.forEach((el) => delete queryObj[el]);

  //     // console.log(req.query, queryObj);

  //     // 1B) Advanced filtering
  //     // let queryStr = JSON.stringify(queryObj);
  //     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  //     // console.log(JSON.parse(queryStr));
  //     // One way to do it
  //     // let query = Tour.find(JSON.parse(queryStr)); // parameter was req.query, but we changed it to queryObj

  //     // Another way to do it
  //     // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

  //     // { difficulty: 'easy', duration: { $gte: 5 } }

  //     // 2) Sorting
  //     // if (req.query.sort) {
  //     //   const sortBy = req.query.sort.split(',').join(' ');
  //     //   // console.log(sortBy);
  //     //   query = query.sort(sortBy);
  //     //   // sort('price ratingsAverage')
  //     // } else {
  //     //   query = query.sort('-createdAt'); // default sorting
  //     // }

  //     // 3) Field limiting
  //     // if (req.query.fields) {
  //     //   const fields = req.query.fields.split(',').join(' ');
  //     //   query = query.select(fields); // select('name duration price')
  //     // } else {
  //     //   query = query.select('-__v'); // default field
  //     // }

  //     // // 4) Pagination
  //     // const page = req.query.page * 1 || 1; // multiply by 1 to convert to a number || default page (number 1 in this case)
  //     // const limit = req.query.limit * 1 || 100; // default limit (100 in this case)
  //     // const skip = (page - 1) * limit; // page 1: 1-10, page 2: 11-20, page 3: 21-30, etc.

  //     // query = query.skip(skip).limit(limit); // 10 on a page and skip the first 10 results

  //     // if (req.query.page) {
  //     //   const numTours = await Tour.countDocuments(); // count the number of documents in the collection
  //     //   if (skip >= numTours) throw new Error('This page does not exist'); // if the page does not exist, throw an error
  //     // }

  //     // EXECUTE QUERY
  //     const features = new APIFeatures(Tour.find(), req.query)
  //       .filter()
  //       .sort()
  //       .limitFields()
  //       .paginate();
  //     const tours = await features.query;
  //     // query.sort().select().skip().limit()

  //     // SEND RESPONSE
  //     res.status(200).json({
  //       status: 'success',
  //       results: tours.length,
  //       data: {
  //         tours,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(404).json({
  //       status: 'fail',
  //       message: err,
  //     });
  //   }
  // requestedAt: req.requestTime,
  // results: tours.length,
  // data: {
  //   tours,
  // },
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id); // findByID is the same as findOne behind the scenes
  // Tour.findOne({ _id: req.params.id })

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // return to stop the function from executing
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });

  // Code used before we implemented the catchAsync function
  // 	try {
  //     const tour = await Tour.findById(req.params.id); // findByID is the same as findOne behind the scenes
  //     // Tour.findOne({ _id: req.params.id })
  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         tour,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(404).json({
  //       status: 'fail',
  //       message: err,
  //     });

  //   console.log(req.params);
  //   const id = req.params.id * 1;
  //   const tour = tours.find((el) => el.id === id);
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       tour,
  //     },
  //   });
  //   }
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({})
  // newTour.save()

  const newTour = await Tour.create(req.body); // same as above
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  //   try {
  //     const newTour = await Tour.create(req.body);

  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: err,
  //     });
  //   }

  // console.log(req.body);
  //   const newId = tours[tours.length - 1].id + 1;
  //   const newTour = Object.assign({ id: newId }, req.body);
  //   tours.push(newTour);
  //   fs.writeFile(
  //     `${__dirname}/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours),
  //     (err) => {
  //       res.status(201).json({
  //         status: 'success',
  //         data: {
  //           tour: newTour,
  //         },
  //       });
  //     }
  //   );
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // return to stop the function from executing
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });

  // Code used before we implemented the catchAsync function
  // 	try {
  //     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
  //       new: true,
  //     });

  //     res.status(204).json({
  //       status: 'success',
  //       data: {
  //         tour: tour,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: err,
  //     });
  //   }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // return to stop the function from executing
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });

  // code used before we implemented the catchAsync function
  // 	try {
  //     await Tour.findByIdAndDelete(req.params.id);

  //     res.status(204).json({
  //       status: 'success',
  //       data: null,
  //     });
  //   } catch (err) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: err,
  //     });
  //   }
});

// Aggregation Pipeline - MongoDB
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // match the documents
    },
    {
      $group: {
        // group the documents
        _id: { $toUpper: '$difficulty' }, // group by difficulty. Set to uppercase for fun
        numTours: { $sum: 1 }, // add 1 for each document
        numRatings: { $sum: '$ratingsQuantity' }, // add the ratingsQuantity for each document
        avgRating: { $avg: '$ratingsAverage' }, // calculate the average of the ratingsAverage for each document
        avgPrice: { $avg: '$price' }, // calculate the average of the price for each document
        minPrice: { $min: '$price' }, // calculate the minimum of the price for each document
        maxPrice: { $max: '$price' }, // calculate the maximum of the price for each document
      },
    },
    {
      $sort: { avgPrice: 1 }, // sort the documents
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }, // match the documents
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // code used before we implemented the catchAsync function
  // 	try {
  //     const stats = await Tour.aggregate([
  //       {
  //         $match: { ratingsAverage: { $gte: 4.5 } }, // match the documents
  //       },
  //       {
  //         $group: {
  //           // group the documents
  //           _id: { $toUpper: '$difficulty' }, // group by difficulty. Set to uppercase for fun
  //           numTours: { $sum: 1 }, // add 1 for each document
  //           numRatings: { $sum: '$ratingsQuantity' }, // add the ratingsQuantity for each document
  //           avgRating: { $avg: '$ratingsAverage' }, // calculate the average of the ratingsAverage for each document
  //           avgPrice: { $avg: '$price' }, // calculate the average of the price for each document
  //           minPrice: { $min: '$price' }, // calculate the minimum of the price for each document
  //           maxPrice: { $max: '$price' }, // calculate the maximum of the price for each document
  //         },
  //       },
  //       {
  //         $sort: { avgPrice: 1 }, // sort the documents
  //       },
  //       // {
  //       //   $match: { _id: { $ne: 'EASY' } }, // match the documents
  //       // },
  //     ]);

  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         stats,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(404).json({
  //       status: 'fail',
  //       message: err,
  //     });
  //   }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // deconstruct the startDates array
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`), // match the documents
          $lte: new Date(`${year}-12-31`), // match the documents
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // group by month
        numTourStarts: { $sum: 1 }, // add 1 for each document
        tours: { $push: '$name' }, // push the name of the tour into the tours array
      },
    },
    {
      $addFields: { month: '$_id' }, // add a new field called month
    },
    {
      $project: { _id: 0 }, // hide the _id field
    },
    {
      $sort: { numTourStarts: -1 }, // sort the documents
    },
    {
      $limit: 12, // limit the documents to 12
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });

  // code used before we implemented the catchAsync function
  // 	try {
  //     const year = req.params.year * 1; // 2021

  //     const plan = await Tour.aggregate([
  //       {
  //         $unwind: '$startDates', // deconstruct the startDates array
  //       },
  //       {
  //         $match: {
  //           startDates: {
  //             $gte: new Date(`${year}-01-01`), // match the documents
  //             $lte: new Date(`${year}-12-31`), // match the documents
  //           },
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: { $month: '$startDates' }, // group by month
  //           numTourStarts: { $sum: 1 }, // add 1 for each document
  //           tours: { $push: '$name' }, // push the name of the tour into the tours array
  //         },
  //       },
  //       {
  //         $addFields: { month: '$_id' }, // add a new field called month
  //       },
  //       {
  //         $project: { _id: 0 }, // hide the _id field
  //       },
  //       {
  //         $sort: { numTourStarts: -1 }, // sort the documents
  //       },
  //       {
  //         $limit: 12, // limit the documents to 12
  //       },
  //     ]);

  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         plan,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(404).json({
  //       status: 'fail',
  //       message: err,
  //     });
  //   }
});
