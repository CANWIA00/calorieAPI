const mongoose = require('mongoose');


const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/FoodCount-app'

mongoose.connect(uri, 
{useNewUrlParser: true, 
useUnifiedTopology: true,
useCreateIndex: true,
useFindAndModify: false
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
    console.log("Mongoose online")
});