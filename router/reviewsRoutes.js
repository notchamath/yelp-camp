const express =  require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');

router.get("/", reviews.getReview);

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.postReview));

router.get("/:reviewId", reviews.showReview);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview));

module.exports = router;