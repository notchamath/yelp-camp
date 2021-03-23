const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/YelpCampV1', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('mongoDB is online with mongoose!');
    }).catch(e => {
        console.log('Error connecting to Mongoose! :::' + e);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/featured/?nature,australia',
            desc: 'LorIn publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. WikipediaFeedback',
            price: price,
            author: '605830032f6e6641309651f6'
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('Data Seeded')
})