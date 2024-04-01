const express = require('express');
const router = express.Router();

const { Review, User, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//* GET ALL REVIEWS OF CURRENT USER
//TODO: missing include ReviewImages
router.get('/current', requireAuth, async (req, res) => {
  const user_Id = req.user.id;
  const allReviews = await Review.findAll({
    where: {
      user_Id: user_Id,
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ['username', 'email', 'password', 'createdAt', 'updatedAt'],
        },
      },
      {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'description'],
        },
      },
    ],
  });

  return res.status(200).json(allReviews);
});

//*ADD AN IMAGE TO A REVIEW BASED ON REVIEW ID
//TODO: STILL NEED TO MAKE THE REVIEWIMAGES TABLE

//*EDIT A REVIEW
router.put('/:reviewId', requireAuth, async (req, res) => {
  //get needed variables from params
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  //get the possible updated values
  const { review, stars } = req.body;

  //validation of stars body
  if (stars === undefined || stars > 5 || stars < 1) {
    return res
      .status(400)
      .json({ message: 'Stars must be an integer between 1 and 5' });
  }

  //validation of review body
  if (review === undefined || review.length < 1) {
    return res.status(400).json({ message: 'Review text is required' });
  }

  //find the review
  const reviewToBeUpdated = await Review.findByPk(reviewId);

  //if review doesn't exist
  if (reviewToBeUpdated === null) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  //if the review isnt owned by current user
  if (reviewToBeUpdated.user_Id !== userId) {
    return res.status(401).json({ message: 'Cannot edit other user reviews' });
  }

  //update the review with the new values
  const updatedReview = await reviewToBeUpdated.update(
    {
      review: review,
      stars: stars,
    },
    {
      where: {
        id: reviewId,
      },
    }
  );

  return res.status(200).json(updatedReview);
});

//* DELETE A REVIEW
router.delete('/:reviewId', requireAuth, async (req, res) => {
  //get the required req body
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  //find the review to be deleted
  const reviewToDelete = await Review.findByPk(reviewId);

  if (reviewToDelete === null) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (reviewToDelete.user_Id !== userId) {
    return res
      .status(403)
      .json({ message: 'Cannot delete other user reviews' });
  } else {
    reviewToDelete.destroy();
    return res.status(200).json({ message: 'Successfully deleted' });
  }
});

module.exports = router;
