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
            images: [
                {
                  url: 'https://res.cloudinary.com/yelpcamp99/image/upload/v1616646185/YelpCamp/bpxy57lnf3ixbhniwwcw.jpg',
                  filename: 'YelpCamp/bpxy57lnf3ixbhniwwcw'
                },
                {
                  url: 'https://res.cloudinary.com/yelpcamp99/image/upload/v1616646185/YelpCamp/qhrq5zqscihbk2dramun.jpg',
                  filename: 'YelpCamp/qhrq5zqscihbk2dramun'
                },
                {
                  url: 'https://res.cloudinary.com/yelpcamp99/image/upload/v1616646191/YelpCamp/fx3of1ni7ybvdxbpgfhx.jpg',
                  filename: 'YelpCamp/fx3of1ni7ybvdxbpgfhx'
                }
              ],
            desc: 'LorIn publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. WikipediaFeedback',
            price: price,
            author: '605830032f6e6641309651f6',
            geometry: { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] }
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('Data Seeded')
})