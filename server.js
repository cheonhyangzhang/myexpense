// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./rest/models/user.js'); // get our mongoose model
    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
console.log("Try connect");
mongoose.connect(config.database); // connect to database
// app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

apiRoutes = require('./rest/routes.js');



// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// routes ================
// =======================
// basic route

app.use("/bower_components", express.static(__dirname + '/app/bower_components'));
app.use("/styles", express.static(__dirname + '/app/styles'));
app.use("/scripts", express.static(__dirname + '/app/scripts'));
app.use("/images", express.static(__dirname + '/app/images'));
app.use("/elements", express.static(__dirname + '/app/elements'));

app.get('*', function(req, res) {
    res.sendfile('./app/index.html'); // load our public/index.html file
});











// API ROUTES -------------------
// we'll get to these in a second

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);