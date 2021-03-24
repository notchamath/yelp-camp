const express =  require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');


router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.getNewCamp);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.postNewCamp));

router.get('/:id', catchAsync(campgrounds.show));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.getEditCamp));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.postEditCamp));

router.delete('/:id', isAuthor, isLoggedIn, catchAsync(campgrounds.destroyCamp));


module.exports = router;