const express =  require('express');
const router = express.Router();


router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('/index', {camps});
}));

router.get('/new', (req, res) => {
    res.render('new');
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/${camp.id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('/show', {camp});
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('/edit', {camp});
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    res.redirect(`/${camp.id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params; 
    await Campground.findByIdAndDelete(id);
    res.redirect(``);
}));

router.post("/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect('/'+camp.id);
}));

router.delete('/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/${id}`);
}));

module.exports = router;