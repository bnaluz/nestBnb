const express = require('express');
const router = express.Router();
const { Spot } = require('../../db/models');
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

module.exports = router;
