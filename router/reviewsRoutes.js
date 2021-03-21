const express =  require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const {joiSchemaReview} = require('../joiSchemas');
const Campground = require('../models/campgrounds');
const ExpressError = require('../utils/ExpressError');


const validateReview = (req, res, next) => {
    const{error} = joiSchemaReview.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


router.post("/", validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;