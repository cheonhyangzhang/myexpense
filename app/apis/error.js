module.exports = {
	common:function(code, title, detail, res){
		return res.status(400).send({ 
		        reason: title, 
		        code: code,
		        message: detail
		});
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