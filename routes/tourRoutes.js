const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours); // aliasTopTours is a middleware

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.param('id', (req, res, next, val) => {
  // middleware to check if the ID is valid
  console.log(`Tour id is: ${val}`);
  next();
});

router
  .route('/')
  .get(authController.protect, tourController.getAllTours) // first one will protect all the routes that come after it
  .post(tourController.createTour); // removed .tourController.checkBody, because it is now a middleware and not needed with the database

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
