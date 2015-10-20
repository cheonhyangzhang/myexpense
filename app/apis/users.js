var permission = require('./permission');
var error = require('./error')

module.exports = function (apiRoutes) {
	// route to return all users (GET http://localhost:8080/api/users)
	var User   = require('../models/user');
	
	//available to everybody
	apiRoutes.post('/users', function(req, res) {
		if (req.body.username && req.body.from && req.body.fromname){
			User.findOne({ 'username': req.body.username }).then(function(user){
				console.log("same user?");
				console.log(user);
				if (user){
					error.conflict("Username conflict", "Username has already been taken. Try another one", res);
				}
				else{
					var user = new User();
					user.username = req.body.username;
					user.from = req.body.from;
					user.fromname = req.body.fromname;
					user.save().then(function(err){
						console.log(err);
						if (err){
							error.internalError('','',res);
						}
						res.json(user);
					});
				}
			});
		}
		else{
			error.badRequest('Missing required field','Required field is missing!',res);
		}
	});  

	apiRoutes.get('/users', function(req, res) {
		// var error = permission.check(req, res);
		var error = null;
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
