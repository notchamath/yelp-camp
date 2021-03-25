const catchAsync = require('./utils/catchAsync');
const {joiSchemaCampground, joiSchemaReview} = require('./joiSchemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campgrounds');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must login first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    
    if(!camp.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
});

module.exports.validateCampground = (req, res, next) => {
    const {error} = joiSchemaCampground.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const{error} = joiSchemaReview.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = catchAsync(async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
});