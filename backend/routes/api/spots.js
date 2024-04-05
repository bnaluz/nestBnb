const express = require('express');
const router = express.Router();
const { Spot, Review, Booking, User } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');

//* GET ALL SPOTS
router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll({});

  return res.status(200).json(allSpots);
});

//*GET ALL USER SPOTS
//TODO: need to add/include aggregate starRating, numReviews and SpotImages []
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const userSpots = await Spot.findAll({
    where: {
      owner_id: userId,
    },
  });

  return res.status(200).json(userSpots);
});

//* GET SPECIFIC SPOT
//TODO: include associations (SpotImages) + reviews and avgStarRating
router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;

  console.log(spotId);
  const spot = await Spot.findByPk(spotId);

  if (spot !== null) {
    return res.status(200).json(spot);
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
    });

    return res.status(201).json(newSpot);
  } catch (e) {
    e.status = 400;
    return next(e);
  }
});

router.post('/:spotsId/images', async (req, res) => {
  const spotId = req.params.spotsId;
  const spot = await Spot.findByPk(spotId);

  if (spot === null) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  } else {
    const { url, preview } = req.body;

    const newImage = await SpotImage.create({
      spot_Id: spotId,
      url: url,
      preview: preview || false,
    });

    return res
      .status(200)
      .json({ id: newImage.id, url: newImage.url, preview: newImage.preview });
  }
});

//*EDIT A SPOT
router.put('/:spotId', requireAuth, async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    const owner_id = req.user.id;

    if (spot === null) {
      return res.status(404).json({ message: "Spot couldn't be found" });
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

    return res.status(200).json(updatedSpot);
  } catch (e) {
    e.status = 400;
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
    throw new Error('only owners can delete spot');
  }

  let deletedSpot = await spot.destroy();
  return res.status(200).json({ message: 'Successfully deleted' });
});

//*Get all Reviews by a Spot's id
//TODO: include ReviewImages once model is made
router.get('/:spotId/reviews', async (req, res, next) => {
  const spotId = req.params.spotId;

  try {
    const spot = await Spot.findByPk(spotId);

    const spotReviews = await Review.findAll({
      where: {
        spot_Id: spot.id,
      },
    });

    return res.status(200).json(spotReviews);
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

  const newReview = await Review.create({
    user_Id: userId,
    spot_Id: spotId,
    review: review,
    stars: stars,
  });

  return res.status(200).json(newReview);
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

  //use date formatters from booking then map through results
  const startAndEndDateFormatter = (date) => {
    return date.toISOString().split('T')[0];
  };

  const createdAndUpdatedFormatter = (date) => {
    const under10Formatter = (num) => {
      if (num < 10) {
        return '0' + num;
      } else return num;
    };

    const year = date.getFullYear();
    const month = under10Formatter(date.getMonth());
    const day = under10Formatter(date.getDate());
    const hours = under10Formatter(date.getHours());
    const min = under10Formatter(date.getMinutes());
    const sec = under10Formatter(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${min}:${sec}`;
  };

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
      startDate: booking.start_date,
      endDate: booking.end_date,
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
        { start_date: { [Op.lt]: end } },
        { end_date: { [Op.gt]: start } },
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

  //booking is created but response needs formatting for dates
  const startAndEndDateFormatter = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formattedStart = startAndEndDateFormatter(newBooking.start_date);
  const formattedEnd = startAndEndDateFormatter(newBooking.end_date);

  const createdAndUpdatedFormatter = (date) => {
    const under10Formatter = (num) => {
      if (num < 10) {
        return '0' + num;
      } else return num;
    };

    const year = date.getFullYear();
    const month = under10Formatter(date.getMonth());
    const day = under10Formatter(date.getDate());
    const hours = under10Formatter(date.getHours());
    const min = under10Formatter(date.getMinutes());
    const sec = under10Formatter(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${min}:${sec}`;
  };

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

//*DELETE A SPOT IMAGE
router.delete('/:spotId/images/:spotImageId', requireAuth, async (req, res) => {
  //get the spot and check if the spot belongs to current user
  const spotId = req.params.spotId;
  const spotImageId = req.params.spotImageId;
  const userId = req.user.id;

  //find the spot
  const spot = await Spot.findByPk(spotId);
  //check if its the users
  if (spot.owner_id !== userId) {
    return res
      .status(403)
      .json({ message: "Cannot delete other user's images" });
  }

  //find the image
  const spotImage = await SpotImage.findByPk(spotImageId);

  //if found delete or throw error
  if (spotImage === null) {
    return res.status(400).json({ message: "Spot image couldn't be found" });
  } else {
    spotImage.destroy();
    return res.status(200).json({ message: 'Successfully deleted' });
  }
});

module.exports = router;
