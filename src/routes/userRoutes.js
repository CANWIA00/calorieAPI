const express = require("../../node_modules/express");
const router = express.Router();
const bcrypt = require('../../node_modules/bcryptjs');
const jwt = require('../../node_modules/jsonwebtoken');
const User = require('../models/User');


const privateKey = '7f58842e-546e-41ec-86cc-98688aff65e5';


router.post('/new', async (req, res) => {
    try {
        const username = await User.findOne({username: req.body.username});

        if(!username){
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const data = await User.create(req.body)
            res.send(data)
        }else{
            res.status(409).send('username already exist');
        }
        
    } catch{
        res.status(400).send('Bad request');
    }
});


router.post('/login', async (req, res) => {
    try {
        const data = await User.findOne({ username: req.body.username });

        if (data && await bcrypt.compare(req.body.password, data.password)) {

            const payload = {
                id: data._id,
                username: data.username
            }

            jwt.sign(payload, privateKey, { expiresIn: "4h" }, ((err, token) => {
                
                res.set('token', token);
                res.send('token created')
            }));

        } else {
            res.status(400).send('Enter valid  password');
        }
    } catch{
        res.status(400).send('Enter valid username & password');
    }
})




module.exports = router;