const express =  require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const {joiSchemaReview} = require('../joiSchemas');
const Campground = require('../models/campgrounds');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn} = require('../middleware');


const validateReview = (req, res, next) => {
    const{error} = joiSchemaReview.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Posted New Review!');
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;