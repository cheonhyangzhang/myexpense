// API ROUTES -------------------
var express     = require('express');
var config = require('../config');
var jwt    = require('jsonwebtoken');
// get an instance of the router for api routes
var apiRoutes = express.Router(); 

var User   = require('./models/user')



require('./apis/users')(apiRoutes);
require('./apis/expenses')(apiRoutes);



// // route middleware to verify a token
// apiRoutes.use(function(req, res, next) {
// 	console.log("middleware verify a token");
//   console.log(req.body);
//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   // decode token
//   if (token) {

//     // verifies secret and checks exp
//     jwt.verify(token, config.secret, function(err, decoded) {      
//       if (err) {
//         console.log("failed");
//         return res.json({ success: false, message: 'Failed to authenticate token.' });    
//       } else {
//         console.log("success");
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;    
//         next();
//       }
//     });

//   } else {

//     // if there is no token
//     // return an error
//     return res.status(403).send({ 
//         success: false, 
//         message: 'No token provided.' 
//     });
    
//   }
// });


// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token

// route to show a random message (GET http://localhost:8080/api/)
// apiRoutes.get('/', function(req, res) {
//   res.json({ message: 'Welcome to the coolest API on earth!' });
// });







module.exports = apiRoutes;
