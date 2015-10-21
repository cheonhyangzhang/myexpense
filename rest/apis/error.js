module.exports = {
	common:function(code, title, detail, res){
		return res.status(code).send({ 
		        reason: title, 
		        code: code,
		        message: detail
		});
	},
	forbidden:function(title, detail, res){
		return this.common(403, title,detail, res);
	},
	notFound:function(title, detail, res){
		return this.common(404, title,detail, res);
	},
	internalError:function(title, detail, res){
		return this.common(500, title,detail, res);
	},
	badRequest:function(title, detail, res){
		return this.common(400, title,detail, res);
	},
	conflict:function(title, detail, res){
		return this.common(409, title,detail, res);

	}

}