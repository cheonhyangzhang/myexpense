var permission = require('./permission');
var error = require('./error')

module.exports = function (apiRoutes) {
	// route to return all users (GET http://localhost:8080/api/users)
	var Expense   = require('../models/expense');
	//available to everybody
	apiRoutes.post('/expenses', function(req, res){
		permission.userFromToken(req, function(resp){
			var tokenUser = resp;
			if (tokenUser){
				if (req.body.date && req.body.org && req.body.amount){
					var expense = new Expense();
					expense.date = req.body.date;
					expense.org = req.body.org;
					expense.description = req.body.description;
					expense.category = req.body.category;
					expense.subcategory = req.body.subcategory;
					expense.amount = req.body.amount;
					expense.owner = tokenUser.username;
					expense.save().then(function(resp){
						console.log("save result");
						console.log(resp);
					if (!resp) error.internalError('','',res);
						res.json(resp);
					});
				}
				else{
					error.badRequest('Missing required field','Required field is missing!',res);
				}
			}
			else{
				error.badRequest('Token missing', 'Token is missing or the token is not valid', res);
			}
		});
		
		
	});  

	apiRoutes.get('/expenses', function(req, res) {
		console.log("get /expnese");
		permission.userFromToken(req, function(resp){
			var tokenUser = resp;
			if (tokenUser){
				if (req.query.username){
					var username = req.query.username;
					if (tokenUser.username == username){
						var expenses = Expense.find({owner:username}).then(function(expenses){
							console.log("expenses");
							console.log(expenses);
							res.json(expenses);
						});
					}
					else{
						error.forbidden("Access not allowed", "Not allowed to access expenses data for other users",res);
					}
				}
				else{
					error.badRequest('Missing required field','Required field is missing!',res);
				}
			}
			else{
				error.badRequest('Token missing', 'Token is missing or the token is not valid', res);
			}
		});	
	});  

};
