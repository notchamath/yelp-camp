const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campgrounds');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {joiSchemaCampground} = require('./joiSchemas');
const {joiSchemaReview} = require('./joiSchemas');
const Review = require('./models/review');

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

const validateCampground = (req, res, next) => {
    const {error} = joiSchemaCampground.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const{error} = joiSchemaReview.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', {camps});
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/Campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp.id}`);
}));

app.get('/Campgrounds/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {camp});
}));

app.get('/Campgrounds/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {camp});
}));

app.put('/Campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    res.redirect(`/campgrounds/${camp.id}`);
}));

app.delete('/Campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params; 
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect('/campgrounds/'+camp.id);
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