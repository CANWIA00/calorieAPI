require('dotenv').config();
const express = require('express');
require('./mongo');
const app = express();
const path = require('path');
const port = 9000;


const userRouter = require('./src/routes/userRoutes');
const foodRouter = require('./src/routes/foodRoutes');
const foodDetailsRouter = require('./src/routes/foodDetailsRoutes');


const isProduction = process.env.NODE_ENV === 'production';

if (isProduction){
    console.log("Express app running in production")
    app.use(express.static('./public'));
}


app.use(express.json());


app.use("/user", userRouter);
app.use("/food", foodRouter);
app.use("/foodDetails", foodDetailsRouter);

if (isProduction){
    app.get('/*', (req,res) =>{
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    })
}


app.listen(process.env.PORT || 9000, () => {
    console.log(`FoodCount app listening at http://localhost:${port}`)
})