const express = require('express');
const router = express.Router();
const { Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//* GET ALL SPOTS
router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll({});

  return res.json(allSpots);
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

  return res.json(userSpots);
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
router.post('/', requireAuth, async (req, res) => {
  try {
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
    });

    return res.status(201).json(newSpot);
  } catch (e) {
    return res.status(400).json({ message: `${e}` });
  }
});

module.exports = router;
