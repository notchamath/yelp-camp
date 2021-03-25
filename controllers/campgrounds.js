const Campground = require('../models/campgrounds');

module.exports.index = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', {camps});
}

module.exports.getNewCamp = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.postNewCamp = async (req, res, next) => {
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    camp.images = req.files.map(f =>({
        url: f.path,
        filename: f.filename
    }));
    console.log(camp)
    await camp.save();
    
    req.flash('success', 'Created New Campground!');
    res.redirect(`/campgrounds/${camp.id}`);
}

module.exports.show = async (req, res) => {
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
}

module.exports.getEditCamp = async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error', 'Sorry! Cannot find that Campground');
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', {camp});
}

module.exports.postEditCamp = async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    
    req.flash('success', 'Campground Updated!');
    res.redirect(`/campgrounds/${camp.id}`);
}

module.exports.destroyCamp = async (req, res) => {
    const {id} = req.params; 
    await Campground.findByIdAndDelete(id);
    
    req.flash('success', 'Deleted Campground');
    res.redirect(`/campgrounds/`);
}