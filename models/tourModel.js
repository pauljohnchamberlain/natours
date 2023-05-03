const mongoose = require('mongoose'); // this is a library that connects to MongoDB
const slugify = require('slugify'); // this is a library that creates slugs from strings
const validator = require('validator'); // this is a library that validates strings

const tourSchema = new mongoose.Schema( // this is a schema
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, // removes all white space in the beginning and end of the string
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'], // this will validate the input using the validator library
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        // enum is only for strings
        values: ['easy', 'medium', 'difficult'], // this is a validator that will only accept these values
        message: 'Difficulty is either: easy, medium, difficult', // this is a custom error message
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.66666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // this custom validator will only work on create and save
      // this will not work on update
      // to make it work on update, we need to use the runValidators option
      // in the findByIdAndUpdate method
      validate: {
        // this is a custom validator
        // this only points to current doc on NEW document creation
        validator: function (val) {
          // this is a callback function
          // this will only work on create and save
          return val < this.price; // 100 < 200 => true
        },
        message: 'Discount price ({VALUE}) should be below regular price', // this is a custom error message
      },
    },
    summary: {
      type: String,
      trim: true, // removes all white space in the beginning and end of the string
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true, // removes all white space in the beginning and end of the string
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // this will hide this field from the output
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true }, // this will allow virtual properties to be displayed in the output
    toObject: { virtuals: true }, // this will allow virtual properties to be displayed in the output
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  // this is a virtual property
  // this will be called each time we get data from the database
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // this refers to the current document
  // console.log(this); // this refers to the current document
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// // POST MIDDLEWARE: runs after .save() and .create()
// tourSchema.pre('save', function (next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // this will run for all the find queries
  // this refers to the current query
  this.find({ secretTour: { $ne: true } }); // this will run for all the find queries. Not true because we have a secretTour in the query and the other tours do not have it set at all
  this.start = Date.now();
  next();
}); // this will run for all the find queries

tourSchema.post(/^find/, function (docs, next) {
  // this will run for all the find queries
  // this refers to the current query
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // this will add a match stage to the beginning of the pipeline array

  // console.log(this.pipeline());// this will show the pipeline array
  next();
});

const Tour = mongoose.model('Tour', tourSchema); // create a model from the schema

module.exports = Tour; // export the model
