const express =  require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campgrounds');
const {isLoggedIn, validateReview} = require('../middleware');


router.post("/", validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Posted New Review!');
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;