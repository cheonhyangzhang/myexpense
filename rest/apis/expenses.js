var permission = require('./permission');
var error = require('./error')

module.exports = function (apiRoutes) {
	// route to return all users (GET http://localhost:8080/api/users)
	var Expense   = require('../models/expense');
	//available to everybody
	apiRoutes.post('/expenses', function(req, res){
		console.log("POST /expenses body:");
		console.log(req.body);
		permission.userFromToken(req, function(resp){
			console.log("permission.userFromToken resp:");
			console.log(resp);
			var tokenUser = resp;
			if (tokenUser){
				console.log("check required fields");
				if (req.body.date && req.body.merchant && req.body.amount){
					var expense = new Expense();
					expense.date = req.body.date;
					expense.merchant = req.body.merchant;
					expense.description = req.body.description;
					expense.category = req.body.category;
					expense.subcategory = req.body.subcategory;
					expense.amount = req.body.amount;
					expense.owner = tokenUser.username;
					console.log("before save to datastore");
					console.log(expense);
					expense.save(function(err, resp){
						console.log("save result");
						console.log(err);
						console.log(resp);
						if (err) error.internalError('Failed to save to mongodb','Failed to save to mongodb',res);
							
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

	apiRoutes.delete('/expenses', function(req, res){
		console.log("delete /expenses");
		permission.userFromToken(req, function(resp){
			var tokenUser = resp;
			if (tokenUser){
				var username = tokenUser.username;
				var query = {owner:username};
				query['date'] = {};
				if (req.query.after){
					query['date']["$gte"] = new Date(req.query.after);  
				}
				if (req.query.before){
					query['date']["$lt"] =  new Date(req.query.before)
				}
				console.log("before removing");
				console.log(query);
				var expenses = Expense.find().remove(query, function(err, removed){
					console.log("expenses");
					console.log(err);
					console.log(removed);
					res.json(removed);
				});
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
				var username = tokenUser.username;
				var query = {owner:username};
				query['date'] = {};
				if (req.query.after){
					query['date']["$gte"] = new Date(req.query.after);  
				}
				if (req.query.before){
					query['date']["$lt"] =  new Date(req.query.before)
				}
				var expenses = Expense.find(query).then(function(expenses){
					console.log("expenses");
					console.log(expenses);
					res.json(expenses);
				});
			}
			else{
				error.badRequest('Token missing', 'Token is missing or the token is not valid', res);
			}
		});	
	});  

};
