var permission = require('./permission');
var error = require('./error')

module.exports = function (apiRoutes) {
	// route to return all users (GET http://localhost:8080/api/users)
	var Expense   = require('../models/expense');
	//available to everybody
	apiRoutes.post('/expenses', function(req, res) {
		if (req.body.date && req.body.org && req.body.amount){
			var expense = new Expense();
			expense.date = req.body.date;
			expense.org = req.body.org;
			expense.description = req.body.description;
			expense.category = req.body.category;
			expense.amount = req.body.amount;
			expense.save().then(function(user){
			if (!user) error.internalError('','',res);
				res.json(user);
			});
		}
		else{
			error.badRequest('Missing required field','Required field is missing!',res);
		}
	});  

	// apiRoutes.get('/expenses', function(req, res) {
	// 	// var error = permission.check(req, res);
	// 	var error = null;
	// 	if (!error){
	//   		User.find({}, function(err, users) {
	//     		res.json(users);
	//   		});
	// 	}
	// 	else{
	// 		return error;
	// 	}
	// });  

};
