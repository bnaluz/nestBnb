const express = require('express');
const router = express.Router();

const { Booking, User, Spot, ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');

//*DELETE A REVIEW IMAGE
router.delete('/:imageId', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const reviewImageId = req.params.imageId;

  const reviewImage = await ReviewImage.findByPk(reviewImageId);

  const review = await Review.findByPk(reviewImage.review_Id);

  if (review.user_Id !== userId) {
    return res
      .status(403)
      .json({ message: "Cannot delete other user's images" });
  }

  if (reviewImage === null) {
    return res.status(400).json({ message: "Review image couldn't be found" });
  } else {
    reviewImage.destroy();
    return res.status(200).json({ message: 'Sucessfully deleted' });
  }
});

module.exports = router;
