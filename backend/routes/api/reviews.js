const express = require('express');
const router = express.Router();

const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//* GET ALL REVIEWS OF CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
  const user_Id = req.user.id;
  const userReviews = await Review.findAll({
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
      { model: ReviewImage, attributes: ['id', 'url'] },
    ],
  });

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

  const formattedReviews = userReviews.map((review) => ({
    id: review.id,
    spotId: review.Spot.id,
    review: review.review,
    stars: review.stars,
    createdAt: createdAndUpdatedFormatter(review.createdAt),
    updatedAt: createdAndUpdatedFormatter(review.updatedAt),
    User: {
      id: review.User.id,
      firstName: review.User.firstName,
      lastName: review.User.lastName,
    },
    Spot: {
      id: review.Spot.id,
      name: review.Spot.name,
      address: review.Spot.address,
      city: review.Spot.city,
      state: review.Spot.state,
      country: review.Spot.country,
      lat: review.Spot.lat,
      lng: review.Spot.lng,
      price: review.Spot.price,
    },
    ReviewImages: review.ReviewImages.map((img) => ({
      id: img.id,
      url: img.url,
    })),
  }));

  return res.status(200).json(formattedReviews);
});

//*ADD AN IMAGE TO A REVIEW BASED ON REVIEW ID
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  //get the needed variables to identify the model instances
  const userId = req.user.id;
  const reviewId = parseInt(req.params.reviewId, 10);

  const { url } = req.body;

  //find the review instance
  const reviewToAddImage = await Review.findByPk(reviewId, {
    include: [
      {
        model: ReviewImage,
      },
    ],
  });

  //if review doesnt exist
  if (reviewToAddImage === null) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  //if there are already 10 images on the review
  if (reviewToAddImage.ReviewImages.length >= 10) {
    return res.status(403).json({
      message: 'Maximum number of images for this resource was reached',
    });
  }

  //only the review owner can add images
  if (reviewToAddImage.user_Id !== userId) {
    return res.status(403).json({ message: 'Cannot edit other user reviews' });
  }

  const imageToAdd = await ReviewImage.create({
    url: url,
    review_Id: reviewId,
  });

  return res.status(200).json({ id: imageToAdd.id, url: imageToAdd.url });
});

//*EDIT A REVIEW
router.put('/:reviewId', requireAuth, async (req, res) => {
  //get needed variables from params
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  //get the possible updated values
  const { review, stars } = req.body;

  let errors = {};

  //validation of stars body
  if (stars === undefined || stars > 5 || stars < 1) {
    errors.review = 'Review test is required';
  }

  //validation of review body
  if (review === undefined || review.length < 1) {
    errors.stars = 'Stars must be an integer from 1 to 5';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Bad Request', errors });
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

  const formattedReview = {
    id: updatedReview.id,
    userId: updatedReview.user_Id,
    spotId: updatedReview.spot_Id,
    review: updatedReview.review,
    stars: updatedReview.stars,
    createdAt: createdAndUpdatedFormatter(updatedReview.createdAt),
    updatedAt: createdAndUpdatedFormatter(updatedReview.updatedAt),
  };

  return res.status(200).json(formattedReview);
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

//*DELETE A REVIEW IMAGE
router.delete(
  '/:reviewId/images/:reviewImageId',
  requireAuth,
  async (req, res) => {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;
    const reviewImageId = req.params.reviewImageId;

    const review = await Review.findByPk(reviewId);

    if (review.user_Id !== userId) {
      return res
        .status(403)
        .json({ message: "Cannot delete other user's images" });
    }

    const reviewImage = await ReviewImage.findByPk(reviewImageId);

    if (reviewImage === null) {
      return res
        .status(400)
        .json({ message: "Review image couldn't be found" });
    } else {
      return res.status(200).json({ message: 'Sucessfully deleted' });
    }
  }
);

module.exports = router;
