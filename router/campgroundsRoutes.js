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
    req.flash('success', 'Created New Campground!');
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');

    if(!camp){
        req.flash('error', 'Sorry! Cannot find that Campground');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', {camp});
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);

    if(!camp){
        req.flash('error', 'Sorry! Cannot find that Campground');
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', {camp});
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    req.flash('success', 'Campground Updated!');
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params; 
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted Campground');
    res.redirect(`/campgrounds/`);
}));


module.exports = router;