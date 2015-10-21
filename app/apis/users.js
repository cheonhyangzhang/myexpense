var permission = require('./permission');
var error = require('./error')
var jwt    = require('jsonwebtoken');
var config = require('../../config');

module.exports = function (apiRoutes) {
	// route to return all users (GET http://localhost:8080/api/users)
	var User   = require('../models/user');
	//available to everybody
	apiRoutes.post('/users', function(req, res) {
		if (req.body.username && req.body.from && req.body.fromname){
			User.findOne({ 'username': req.body.username }).then(function(user){
				if (user){
					error.conflict("Username conflict", "Username has already been taken. Try another one", res);
				}
				else{
					var user = new User();
					user.username = req.body.username;
					user.from = req.body.from;
					user.fromname = req.body.fromname;
					user.displayName = req.body.displayName;
					user.save().then(function(user){
						if (!user) error.internalError('','',res);
						res.json(user);
					});
				}
			});
		}
		else{
			error.badRequest('Missing required field','Required field is missing!',res);
		}
	});  

	apiRoutes.post('/authenticate', function(req, res) {
		console.log("authenticate");
		if (!req.body.username || !req.body.token){
			error.badRequest('Missing required field','Required field is missing!',res);
		}
		else{
			User.findOne({
				username: req.body.username
			}, function(err, user) {
				if (err) throw err;
				if (!user) {
					error.notFound('User not found',"User not found", res);
				} 
				else{
					permission.checkThirdParty(user.from, user.fromname, req.body.token, function(resp){
						console.log("third party check resp:");
						console.log(resp);
						if (!resp){
							var token = jwt.sign(user, config.secret, {
						      expiresIn: 3600 // expires in 24 hours
						    });
						    res.json({
						      token: token
						    });
						}
						else{
							error.forbidden('Forbidden', 'Authentication info is not correct', res);
						}
					});
				}

			});
		}
	});  

	apiRoutes.get('/users', function(req, res) {
		var error = permission.check(req, res);
		
		// var error = null;
		if (!error){
	  		User.find({}, function(err, users) {
	    		res.json(users);
	  		});
		}
		else{
			return error;
		}
	});  

};
