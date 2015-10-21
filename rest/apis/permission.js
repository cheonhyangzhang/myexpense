var http = require('http');
var https = require("https");
var jwt    = require('jsonwebtoken');
var config = require('../../config');
var error = require('./error');

module.exports = {
	checkThirdParty:function(from, fromName, token, callback){
		if (from == "Google"){
			var url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+token;
			var https = require('https');
			https.get(url, function(res) {
				var body = '';
			    res.on('data', function(chunk){
			        body += chunk;
			    });
			    res.on('end', function(){
			        var authResp = JSON.parse(body);
			        var email = authResp.email;
			        if (email == fromName){
			        	callback(null);
			        }
			        else{
						callback(
						{
							'reason':"Failed",
							"message":"Token not matched third party login"
						})
			        }
			    });

			}).on('error', function(e) {
			  console.error(e);
			});
		}
		else{
			callback(
			{
				'reason':"Failed",
				"message":"Unsupported third party login"
			})
		}

	},
	sameUserCheck: function(req, res){
		var token = req.headers['x-access-token'];
		console.log("sameUserCheck");
		if (token){
			 jwt.verify(token, config.secret, function(err, decoded) {      
		     	if (!err) {
		     		console.log("Returning decoded");
		     		console.log(decoded);
		     		return null;
		     	}
		     	else {
					return error.forbaddien("Invalid token", "Invalid token", res);
		    	}
		    });
		}
		else{
			return error.forbaddien("No token provided", "No token provided", res);
		}
	},
	userFromToken: function(req, callback){
		// var token = req.body.token || req.query.token || req.headers['x-access-token'];
		var token = req.headers['x-access-token'];
		console.log("userFromToken");
		if (token){
			 jwt.verify(token, config.secret, function(err, decoded) {      
		     	if (!err) {
		     		console.log("Returning decoded");
		     		console.log(decoded);
		     		callback(decoded);
		     	}
		     	else {
		      		callback(null);
		    	}
		    });
		}
		else{
		    callback(null);
		}
	},
	checkAuth:function(user, req, res){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		console.log("checkAuth");
		console.log(token);
		if (token) {
		    // verifies secret and checks exp
		    jwt.verify(token, config.secret, function(err, decoded) {      
		      if (err) {
		        console.log("failed");
		        return res.json({ success: false, message: 'Failed to authenticate token.' });    
		      } else {
		        console.log("success");
		        // if everything is good, save to request for use in other routes
		        req.decoded = decoded;    
		        user = decoded;
		        if (user.username == user){
		        	return null;
		        }
		        else{
		        	return res.json({ success: false, message: 'Failed to authenticate token.' });   
		        }
		        // next();
		      }
		    });

		  } 
		  else {

		    // if there is no token
		    // return an error
		    return res.status(403).send({ 
		        success: false, 
		        message: 'No token provided.' 
		    });
		    
		  }
	},
	check:function(req, res){
			console.log("permission check");
			var token = req.body.token || req.query.token || req.headers['x-access-token'];
			console.log("token");
			console.log(token);
		  // decode token
		  if (token) {
		    // verifies secret and checks exp
		    jwt.verify(token, config.secret, function(err, decoded) {      
		      if (err) {
		        console.log("failed");
		        return res.json({ success: false, message: 'Failed to authenticate token.' });   


		      } else {
		        console.log("success");
		        // if everything is good, save to request for use in other routes
		        req.decoded = decoded;    
		        console.log("decoded !!!!!!");
		        console.log(decoded);
		        // next();
		        return null;
		      }
		    });

		  } 
		  else {

		    // if there is no token
		    // return an error
		    return res.status(403).send({ 
		        success: false, 
		        message: 'No token provided.' 
		    });
		    
		  }
	}
}