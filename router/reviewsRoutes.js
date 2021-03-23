const express =  require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campgrounds');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');

router.get("/", (req, res) => {
    res.redirect(`/campgrounds/${req.params.id}`);
});

router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    review.author = req.user._id;
    camp.reviews.push(review);

    await review.save();
    await camp.save();

    req.flash('success', 'Posted New Review!');
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.get("/:reviewId", (req, res) => {
    res.redirect(`/campgrounds/${req.params.id}`);
});

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;