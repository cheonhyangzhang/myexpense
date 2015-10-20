module.exports = function (apiRoutes) {
	// route to return all users (GET http://localhost:8080/api/users)
	var User   = require('../models/user')
	apiRoutes.get('/users', function(req, res) {
	  User.find({}, function(err, users) {
	    res.json(users);
	  });
	});  
};
