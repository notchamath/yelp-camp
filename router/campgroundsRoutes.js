const express =  require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, 
        upload.array('image'),
        validateCampground, 
        catchAsync(campgrounds.postNewCamp
    ));

router.get('/new', isLoggedIn, campgrounds.getNewCamp);

router.route('/:id')
    .get(catchAsync(campgrounds.show))  

    .put(isLoggedIn, 
        isAuthor, validateCampground, 
        catchAsync(campgrounds.postEditCamp
    ))

    .delete(isAuthor, 
        isLoggedIn, 
        catchAsync(campgrounds.destroyCamp
    ));

router.get('/:id/edit', 
    isLoggedIn, 
    isAuthor, 
    catchAsync(campgrounds.getEditCamp
));

module.exports = router;