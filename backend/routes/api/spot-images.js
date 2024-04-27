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
const { Op } = require('sequelize');

//*DELETE A SPOT IMAGE
router.delete('/:imageId', requireAuth, async (req, res) => {
  //get the spot and check if the spot belongs to current user
  //   const spotId = req.params.spotId;//this will come from the spotsImage
  const spotImageId = req.params.imageId;
  const userId = req.user.id;

  //find the image
  const spotImage = await SpotImage.findByPk(spotImageId);
  if (spotImage === null) {
    return res.status(404).json({ message: "Spot image couldn't be found" });
  }

  //find the spot
  const spot = await Spot.findByPk(spotImage.spot_Id);
  //check if its the users
  if (spot.owner_id !== userId) {
    return res
      .status(403)
      .json({ message: "Cannot delete other user's images" });
  } else {
    if (spotImage.url === spot.preview_image) {
      await spot.update({
        preview_image: 'Default Url',
      });
    }
    spotImage.destroy();
    return res.status(200).json({ message: 'Successfully deleted' });
  }
});

module.exports = router;
