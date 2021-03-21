const express =  require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campgrounds');
const {joiSchemaCampground} = require('../joiSchemas');
const ExpressError = require('../utils/ExpressError');


const validateCampground = (req, res, next) => {
    const {error} = joiSchemaCampground.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', {camps});
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {camp});
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {camp});
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params; 
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds/`);
}));


module.exports = router;