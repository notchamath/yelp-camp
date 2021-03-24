const Campground = require('../models/campgrounds');
const Review = require('../models/review');

module.exports.getReview = (req, res) => {
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.showReview = (req, res) => {
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.postReview = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    review.author = req.user._id;
    camp.reviews.push(review);

    await review.save();
    await camp.save();

    req.flash('success', 'Posted New Review!');
    res.redirect(`/campgrounds/${camp.id}`);
}

module.exports.destroyReview = async (req, res) => {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted Review');
    res.redirect(`/campgrounds/${id}`);
}