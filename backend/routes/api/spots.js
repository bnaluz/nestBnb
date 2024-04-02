const express = require('express');
const router = express.Router();
const { Spot, Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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

module.exports = router;
