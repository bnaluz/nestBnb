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
router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;

  console.log(spotId);
  const spot = await Spot.findByPk(spotId);

  if (spot !== null) {
    return res.json(spot);
  } else {
    return res.json({ message: "Spot couldn't be found" });
  }
});

module.exports = router;
