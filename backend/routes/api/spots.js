const express = require('express');
const router = express.Router();
const {
  Spot,
  Review,
  Booking,
  User,
  Sequelize,
  sequelize,
} = require('../../db/models');
const { SpotImage, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {
  createdAndUpdatedFormatter,
  startAndEndDateFormatter,
} = require('../../utils/formatters');
const { Op } = require('sequelize');
const review = require('../../db/models/review');

//* GET ALL SPOTS
router.get('/', async (req, res) => {
  //get the page and size from the query
  let page = req.query.page !== undefined ? parseInt(req.query.page, 10) : 1;
  let size = req.query.size !== undefined ? parseInt(req.query.size, 10) : 20;
  //create a filter obj & error obj to handle case to either add filter query or throw a new error
  let errors = {};
  let filters = {};
  //check page and size values
  if (isNaN(page) || page < 1) {
    errors.page = 'Page must be equal to or greater than 1';
  }

  if (isNaN(size) || size < 1 || size > 20) {
    errors.size = 'Size must be between 1 and 20';
  }

  //get the rest of the query
  let { minLat, maxLat, minLng, maxLng, maxPrice, minPrice } = req.query;

  //validate the queries and add them as keys to the obj if they pass
  if (minLat !== undefined) {
    minLat = parseInt(minLat);
    if (!isNaN(minLat) && minLat >= -90 && minLat <= 90) {
      filters.lat = { ...filters.lat, [Op.gte]: minLat };
    } else {
      errors.minLat = 'Minimum latitude is invalid';
    }
  }

  if (maxLat !== undefined) {
    maxLat = parseInt(maxLat);
    if (!isNaN(maxLat) && maxLat >= -90 && maxLat <= 90) {
      filters.lat = { ...filters.lat, [Op.lte]: maxLat };
    } else {
      errors.maxLat = 'Maximum latitude is invalid';
    }
  }

  if (minLng !== undefined) {
    minLng = parseInt(minLng);
    if (!isNaN(minLng) && minLng >= -180 && minLng <= 180) {
      filters.lng = { ...filters.lng, [Op.gte]: minLng };
    } else {
      errors.minLng = 'Minimum longitude must be between -180 and 180';
    }
  }

  if (maxLng !== undefined) {
    maxLng = parseInt(maxLng);
    if (!isNaN(maxLng) && maxLng >= -180 && maxLng <= 180) {
      filters.lng = { ...filters.lng, [Op.lte]: maxLng };
    } else {
      errors.maxLng = 'Maximum longitude is invalid';
    }
  }

  if (minPrice !== undefined) {
    minPrice = parseInt(minPrice);
    if (!isNaN(minPrice) && minPrice >= 0) {
      filters.price = { ...filters.price, [Op.gte]: minPrice };
    } else {
      errors.minPrice = 'Minimum price must be greater than or equal to 0';
    }
  }

  if (maxPrice !== undefined) {
    maxPrice = parseInt(maxPrice);
    if (!isNaN(maxPrice) && maxPrice >= 0) {
      filters.price = { ...filters.price, [Op.lte]: maxPrice };
    } else {
      errors.maxPrice = 'Maximum price must be greater than or equal to 0';
    }
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Bad Request', errors });
  }

  const spots = await Spot.findAll({
    where: filters,
    include: [
      {
        model: Review,
        attributes: ['stars'],
        required: false,
      },
    ],
    attributes: {
      include: [
        'id',
        'owner_id',
        'address',
        'city',
        'state',
        'country',
        'lat',
        'lng',
        'name',
        'description',
        'price',
        'preview_image',
        'createdAt',
        'updatedAt',
      ],
    },
    group: ['Spot.id'],
    limit: size,
    offset: (page - 1) * size,
    order: [['id', 'ASC']],
  });

  const formattedSpots = spots.map((spot) => {
    //using sequelize get to pojo from res data
    const spotData = spot.get({ plain: true });

    //toJSON does the same thing
    // const spotData = spot.toJSON();
    // console.log(spotData);

    let avgRating = null;

    if (spotData.Reviews && spotData.Reviews.length > 0) {
      const totalStars = spotData.Reviews.reduce(
        (sum, review) => sum + review.stars,
        0
      );
      avgRating = totalStars / spotData.Reviews.length;
    }

    return {
      id: spotData.id,
      ownerId: spotData.owner_id,
      address: spotData.address,
      city: spotData.city,
      state: spotData.state,
      country: spotData.country,
      lat: spotData.lat,
      lng: spotData.lng,
      name: spotData.name,
      description: spotData.description,
      price: spotData.price,
      createdAt: createdAndUpdatedFormatter(spotData.createdAt),
      updatedAt: createdAndUpdatedFormatter(spotData.updatedAt),
      avgRating: avgRating,
      previewImage: spotData.preview_image || 'defaultURL',
    };
  });

  return res.status(200).json({ Spots: formattedSpots, page, size });
});

//*GET ALL USER SPOTS
//TODO:ON IMAGE CREATION if preview is true, then update spots previewImg string
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const userSpots = await Spot.findAll({
    where: {
      owner_id: userId,
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
      ],
      exclude: ['owner_id'],
    },
    group: ['Spot.id'],
  });

  const formattedSpots = userSpots.map((spot) => {
    const spotData = spot.get({ plain: true });

    let avgRating = null;

    if (spotData.Reviews && spotData.Reviews.length > 0) {
      const totalStars = spotData.Reviews.reduce(
        (sum, review) => sum + review.stars,
        0
      );
      avgRating = totalStars / spotData.Reviews.length;
    }
    return {
      id: spotData.id,
      ownerId: spotData.owner_id,
      address: spotData.address,
      city: spotData.city,
      state: spotData.state,
      country: spotData.country,
      lat: spotData.lat,
      lng: spotData.lng,
      name: spotData.name,
      description: spotData.description,
      price: spotData.price,
      createdAt: createdAndUpdatedFormatter(spotData.createdAt),
      updatedAt: createdAndUpdatedFormatter(spotData.updatedAt),
      avgRating: avgRating,
      previewImage: spotData.preview_image || 'defaultURL',
    };
  });

  return res.status(200).json(formattedSpots);
});

//* GET SPECIFIC SPOT DETAILS
router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;

  // console.log(spotId);
  const spot = await Spot.findByPk(spotId, {
    include: [
      { model: SpotImage, attributes: ['id', 'url', 'preview'] },
      { model: Review, attributes: ['stars'], required: false },
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
    ],
    attributes: [
      'id',
      'owner_id',
      'address',
      'city',
      'state',
      'country',
      'lat',
      'lng',
      'name',
      'description',
      'price',
      'createdAt',
      'updatedAt',
      'preview_image',
      [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
      [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating'],
    ],
    group: ['Spot.id', 'SpotImages.id', 'User.id', 'Reviews.id'],
  });

  if (spot) {
    const spotData = spot.get({ plain: true });
    let avgRating = null;

    let numReviews = spotData.Reviews.length;
    if (spotData.Reviews && spotData.Reviews.length > 0) {
      const totalStars = spotData.Reviews.reduce(
        (sum, review) => sum + review.stars,
        0
      );
      avgRating = totalStars / spotData.Reviews.length;
    }
    const formattedSpot = {
      id: spotData.id,
      ownerId: spotData.owner_id,
      address: spotData.address,
      city: spotData.city,
      state: spotData.state,
      country: spotData.country,
      lat: spotData.lat,
      lng: spotData.lng,
      name: spotData.name,
      description: spotData.description,
      price: spotData.price,
      createdAt: createdAndUpdatedFormatter(spotData.createdAt),
      updatedAt: createdAndUpdatedFormatter(spotData.updatedAt),
      numReviews: numReviews,
      avgRating: avgRating,
      previewImage: spotData.preview_image || 'defaultURL',
      SpotImages: spotData.SpotImages.map((img) => ({
        id: img.id,
        url: img.url,
        preview: img.preview,
      })),
      Owner: {
        id: spotData.User.id,
        firstName: spotData.User.firstName,
        lastName: spotData.User.lastName,
      },
    };
    return res.status(200).json(formattedSpot);
  } else {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
});

//* CREATE A SPOT
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const owner_id = req.user.id;
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      preview_image,
    } = req.body;

    const newSpot = await Spot.create({
      address: address,
      city: city,
      state: state,
      country: country,
      lat: lat,
      lng: lng,
      name: name,
      description: description,
      price: price,
      owner_id: owner_id,
      preview_image: preview_image,
    });

    const formattedNewSpot = {
      id: newSpot.id,
      ownerId: newSpot.owner_id,
      address: newSpot.address,
      city: newSpot.city,
      state: newSpot.state,
      country: newSpot.country,
      lat: newSpot.lat,
      lng: newSpot.lng,
      name: newSpot.name,
      description: newSpot.description,
      price: newSpot.price,
      preview_image: newSpot.preview_image,
      createdAt: createdAndUpdatedFormatter(newSpot.createdAt),
      updatedAt: createdAndUpdatedFormatter(newSpot.updatedAt),
    };

    return res.status(201).json(formattedNewSpot);
  } catch (e) {
    e.status = 400;
    e.message = 'Validation Error';
    return next(e);
  }
});

router.post('/:spotsId/images', requireAuth, async (req, res) => {
  const spotId = req.params.spotsId;
  const spot = await Spot.findByPk(spotId);
  const userId = req.user.id;

  if (spot === null) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  } else if (spot.owner_id !== userId) {
    return res
      .status(403)
      .json({ message: "Cannot add images to other user's spots" });
  } else {
    const { url, preview } = req.body;

    const newImage = await SpotImage.create({
      spot_Id: spotId,
      url: url,
      preview: preview || false,
    });

    if (newImage.preview === true) {
      await spot.update({
        preview_image: newImage.url,
      });
    }

    return res
      .status(200)
      .json({ id: newImage.id, url: newImage.url, preview: newImage.preview });
  }
});

//*EDIT A SPOT
router.put('/:spotId', requireAuth, async (req, res, next) => {
  try {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    const owner_id = req.user.id;

    if (spot === null) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    } else if (spot.owner_id !== owner_id) {
      return res
        .status(403)
        .json({ message: "Cannot edit another user's spot" });
    }

    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const updatedSpot = await spot.update({
      address: address,
      city: city,
      state: state,
      country: country,
      lat: lat,
      lng: lng,
      name: name,
      description: description,
      price: price,
      owner_id: owner_id,
    });

    const formattedUpdatedSpot = {
      id: updatedSpot.id,
      ownerId: updatedSpot.owner_id,
      address: updatedSpot.address,
      city: updatedSpot.city,
      state: updatedSpot.state,
      country: updatedSpot.country,
      lat: updatedSpot.lat,
      lng: updatedSpot.lng,
      name: updatedSpot.name,
      description: updatedSpot.description,
      price: updatedSpot.price,
      createdAt: createdAndUpdatedFormatter(updatedSpot.createdAt),
      updatedAt: createdAndUpdatedFormatter(updatedSpot.updatedAt),
    };

    return res.status(200).json(formattedUpdatedSpot);
  } catch (e) {
    e.status = 400;
    e.message = 'Validation Error';
    return next(e);
  }
});

//* DELETE SPOT
router.delete('/:spotId', requireAuth, async (req, res) => {
  let owner_id = req.user.id;
  let spotId = req.params.spotId;

  let spot = await Spot.findByPk(spotId);
  if (spot === null) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.owner_id !== owner_id) {
    return res
      .status(403)
      .json({ message: "Cannot delete another user's spot" });
  }

  let deletedSpot = await spot.destroy();
  return res.status(200).json({ message: 'Successfully deleted' });
});

//*Get all Reviews by a Spot's id

router.get('/:spotId/reviews', async (req, res, next) => {
  const spotId = req.params.spotId;

  try {
    const spot = await Spot.findByPk(spotId);

    const spotReviews = await Review.findAll({
      where: {
        spot_Id: spot.id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const formattedReviews = spotReviews.map((review) => ({
      id: review.id,
      userId: review.User.id,
      spotId: spotId,
      review: review.review,
      stars: review.stars,
      createdAt: createdAndUpdatedFormatter(review.createdAt),
      updatedAt: createdAndUpdatedFormatter(review.updatedAt),
      User: {
        id: review.User.id,
        firstName: review.User.firstName,
        lastName: review.User.lastName,
      },
      ReviewImages: review.ReviewImages.map((img) => ({
        id: img.id,
        url: img.url,
      })),
    }));

    return res.status(200).json({ Reviews: formattedReviews });
  } catch (e) {
    e.status = 404;
    e.message = "Spot couldn't be found";
    next(e);
  }
});

//* Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
  //get the ids for user and spots
  const spotId = req.params.spotId;
  const userId = req.user.id;

  //get req body
  const { review, stars } = req.body;

  //check if the spot exists
  const existingSpot = await Spot.findByPk(spotId);
  if (existingSpot === null) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  //check if a review for this spot by the user already exists
  const existingUserReview = await Review.findAll({
    where: {
      user_Id: userId,
      spot_Id: spotId,
    },
  });

  //if the review exists/ return response stating user has a review already
  if (existingUserReview.length) {
    return res
      .status(500)
      .json({ message: 'User already has a review for this spot' });
  }

  try {
    const newReview = await Review.create({
      user_Id: userId,
      spot_Id: spotId,
      review: review,
      stars: stars,
    });

    const formattedReview = {
      id: newReview.id,
      userId: newReview.user_Id,
      spotId: newReview.spot_Id,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: createdAndUpdatedFormatter(newReview.createdAt),
      updatedAt: createdAndUpdatedFormatter(newReview.updatedAt),
    };

    return res.status(201).json(formattedReview);
  } catch (error) {
    // console.log(error);
    const errors = {};

    error.errors.forEach((e) => {
      errors[e.path] = e.message;
    });

    return res.status(400).json({
      message: 'Validation Error',
      errors: errors,
    });
  }
});

//*GET ALL BOOKINGS FOR A SPOTID

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;

  //find the spot
  const spot = await Spot.findByPk(spotId);

  //if it doesn't exitst
  if (spot === null) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  //case for either spot owner or other
  if (spot.owner_id === Number(userId)) {
    console.log('here');
    const bookings = await Booking.findAll({
      where: {
        spot_Id: spot.id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      attributes: [
        'id',
        'spot_Id',
        'user_Id',
        'start_date',
        'end_date',
        'createdAt',
        'updatedAt',
      ],
    });

    const formattedBookings = bookings.map((booking) => {
      return {
        User: {
          id: booking.User.id,
          firstName: booking.User.firstName,
          lastName: booking.User.lastName,
        },
        id: booking.id,
        spotId: booking.spot_Id,
        userId: booking.user_Id,
        startDate: startAndEndDateFormatter(booking.start_date),
        endDate: startAndEndDateFormatter(booking.end_date),
        createdAt: createdAndUpdatedFormatter(booking.createdAt),
        updatedAt: createdAndUpdatedFormatter(booking.updatedAt),
      };
    });

    //return the formatted bookings
    return res.status(200).json({ Bookings: formattedBookings });
  } else {
    //else case for non spot owner
    const bookings = await Booking.findAll({
      where: {
        spot_Id: spot.id,
      },
      attributes: ['spot_Id', 'start_date', 'end_date'],
    });
    const formattedBookings = bookings.map((booking) => ({
      spotId: booking.spot_Id,
      startDate: startAndEndDateFormatter(booking.start_date),
      endDate: startAndEndDateFormatter(booking.end_date),
    }));

    return res.status(200).json({ Bookings: formattedBookings });
  }
});

//* CREATE BOOKING FROM SPOT ID
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  //get needed ids
  const spotId = req.params.spotId;
  const userId = req.user.id;

  //req body is coming in as string
  const { startDate, endDate } = req.body;

  //check if spot exists
  const spotToBeBooked = await Spot.findByPk(spotId);
  if (spotToBeBooked === null) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spotToBeBooked.owner_id === userId) {
    return res.status(403).json({ message: 'Cannot book your own spot' });
  }
  //establish today and turn req strings into date obj
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  //conditionals to ensure dates would be valid
  if (today.getTime() > start.getTime()) {
    return res.status(400).json({ message: 'startDate cannot be in the past' });
  }
  if (end.getTime() === start.getTime() || end.getTime() < start.getTime()) {
    return res
      .status(400)
      .json({ message: 'endDate cannot be on or before startDate' });
  }

  //query db to check for conflicting dates
  const conflictingBookings = await Booking.findAll({
    where: {
      spot_Id: spotId,
      [Op.and]: [
        { start_date: { [Op.lte]: end } },
        { end_date: { [Op.gte]: start } },
      ],
    },
  });

  //if conflicting bookings exist return the error
  if (conflictingBookings.length > 0) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking',
      },
    });
  }

  //if it makes it here try to create the booking
  const newBooking = await Booking.create({
    spot_Id: spotId,
    user_Id: userId,
    start_date: startDate,
    end_date: endDate,
  });

  const formattedStart = startAndEndDateFormatter(newBooking.start_date);
  const formattedEnd = startAndEndDateFormatter(newBooking.end_date);

  const formattedCreated = createdAndUpdatedFormatter(newBooking.createdAt);
  const formattedUpdated = createdAndUpdatedFormatter(newBooking.updatedAt);

  //create a res object to use instead of newBooking
  const formattedBookingForDates = {
    id: newBooking.id,
    spotId: newBooking.spot_Id,
    userId: newBooking.user_Id,
    startDate: formattedStart,
    endDate: formattedEnd,
    createdAt: formattedCreated,
    updatedAt: formattedUpdated,
  };

  return res.status(200).json(formattedBookingForDates);
});

module.exports = router;
