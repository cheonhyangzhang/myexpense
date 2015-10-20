var http = require('http');
var https = require("https");

module.exports = {
	checkThirdParty:function(from, fromName, token, callback){
		console.log("checkThirdParty");
		console.log(from);
		console.log(fromName);
		if (from == "Google"){
			console.log("checking google auth");
			console.log(fromName + " : " + token);
			var url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+token;
			console.log(url);	
			var https = require('https');
			https.get(url, function(res) {
				var body = '';
			    res.on('data', function(chunk){
			        body += chunk;
			    });
			    res.on('end', function(){
			        var authResp = JSON.parse(body);
			        var email = authResp.email;
			        console.log(fromName);
			        console.log(email);
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