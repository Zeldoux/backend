
// 
const express = require('express');
const mongoose = require('mongoose');

const stuffRoutes = require('./Routes/stuff');
const userRoutes = require('./Routes/user');
const path = require('path');

mongoose.connect('mongodb+srv://dev:dev@cluster0.3v6h9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch( (e)=> console.log(e) );

// create an express APP
const app = express();


app.use(express.json());

// first middleWare to be executed by server
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH, OPTIONS' );
    next();
});



app.use('/api/books', stuffRoutes); // books routes
app.use('/api/auth', userRoutes); // users routes
app.use('/images', express.static(path.join(__dirname, 'images')));
 // img routes

module.exports = app;

