const express =  require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campgrounds');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');



router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', {camps});
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    
    req.flash('success', 'Created New Campground!');
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if(!camp){
        req.flash('error', 'Sorry! Cannot find that Campground');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', {camp});
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error', 'Sorry! Cannot find that Campground');
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', {camp});
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    
    req.flash('success', 'Campground Updated!');
    res.redirect(`/campgrounds/${camp.id}`);
}));

router.delete('/:id', isAuthor, isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params; 
    await Campground.findByIdAndDelete(id);
    
    req.flash('success', 'Deleted Campground');
    res.redirect(`/campgrounds/`);
}));


module.exports = router;