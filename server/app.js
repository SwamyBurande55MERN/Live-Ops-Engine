const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const cors = require('cors');   // used proxy instead!
const path = require('path')

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(cors());                 // used proxy instead!
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 

app.use(express.static('uploads'));

const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const offerRoutes = require('./routes/offers')

//middleware function ==> 
const fetchUser = require('./middleware/fetchUser')
app.use('/user', userRoutes);
app.use('/product',fetchUser,  productRoutes);
app.use('/offer', fetchUser, offerRoutes)

module.exports = app;