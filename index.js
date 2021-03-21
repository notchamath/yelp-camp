const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {joiSchemaReview} = require('./joiSchemas');
const Review = require('./models/review');
const campgrounds = require('./router/campgroundsRoutes');
const Campground = require('./models/campgrounds');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost:27017/YelpCampV1', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false })
    .then(() => {
        console.log('mongoDB is online with mongoose!');
    }).catch(e => {
        console.log('Error connecting to Mongoose! :::' + e);
});

const validateReview = (req, res, next) => {
    const{error} = joiSchemaReview.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.use('/campgrounds', campgrounds);

app.get('/', (req, res) => {
    res.render('home');    
});

app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp.id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

app.all('*', (req, res, next) =>{
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const{statusCode = 500, message = 'Something went wrong!'} = err;
res.status(statusCode).render('error', {err});
});


app.listen(3000, () => {
    console.log('Online on Port 3000');
})