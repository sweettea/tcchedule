
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};


var fs=require("fs");

var loadsched=function(req,res){
	fs.readFile("./data/"+req.params.id,function(err,data){
		res.writeHeader(200,"Content-Type: application/json");
		if(err){
			res.write(JSON.stringify({"data":{}}));
			}
		else{
			res.write(data);
			}
		res.end();
		});
	};
var writesched=function(req,res){
	fs.writeFile("./data/"+req.params.id,JSON.stringify(req.body));
};
var loadables=function(req,res){
	fs.readdir("./data/",function(err,data){
		res.writeHeader(200,"Content-Type: application/json");
		if(err){
			res.write("{}");
			}
		else{
			var obj={"names":data};
			res.write(JSON.stringify(obj));
			}
		res.end();});
};


var crypto = require('crypto');

var newsch=function(req,res){
	var md5sum=crypto.createHash("md5");
	fs.readdir("./data",function(err,files){
		for(var i=0;i<files.length;i++){
			md5sum.update(files[i]);
			}
		res.writeHeader(200,"Content-Type: application/json");
		res.write(JSON.stringify({"name":md5sum.digest("hex")}));
		res.end();
		});
	}
	
exports.newsch=newsch;
exports.savesched=writesched;
exports.loadsched=loadsched;	
exports.loadables=loadables;
