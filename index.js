require('dotenv').config();
const express = require('express');
require('./mongo');
const cors = require('cors');  
const app = express();
const path = require('path');
const port = 9000;




const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: 'http://localhost:3000',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

if (!isProduction) {
  
  app.use(cors(corsOptions));
} else {
  console.log("Express app running in production");
  app.use(express.static('./public'));
}


app.use(express.json());  

app.use("/user", userRouter);

if (isProduction) {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.listen(process.env.PORT || 9000, () => {
  console.log(`FoodCount app listening at http://localhost:${port}`);
});
