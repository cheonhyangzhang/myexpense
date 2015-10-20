module.exports = {
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