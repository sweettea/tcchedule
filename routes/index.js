
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

var redis = require('redis-url').connect(process.env.REDISTOGO_URL);

//redis.get('foo', function(err, value) {
//  console.log('foo is: ' + value);
//});

var fs=require("fs");
var child_process=require("child_process");
var loadsched=function(req,res){
	redis.get(":data:"+req.params.id,function(err,data){
		res.writeHeader(200,"Content-Type: application/json");
		if(err || data==null || data==undefined){
			res.write(JSON.stringify({"data":{}}));
			}
		else{
			res.write(data);
			}
		res.end();
		});
	};
var loadresponses=function(req,res){
	redis.get(":schedule:"+req.params.id,function(err,data){
		res.writeHeader(200,"Content-Type: application/json");
		if(err || data==null || data==undefined){
			res.write(JSON.stringify({"respondents":[]}));
			}
		else{
			res.write(data);
			}
		res.end();
		});
	};
var writesched=function(req,res){
	redis.set(":data:"+req.params.id,JSON.stringify(req.body));
	redis.get(":lsdata",function(err,data){
		if(err || data==null || data==undefined){redis.set(":lsdata",JSON.stringify({'files':[req.params.id]}));}
		else{
			var p=JSON.parse(data);
			p['files'].push(req.params.id);
			redis.set(":lsdata",JSON.stringify(p));
			}
		});
	res.end();
};
var loadables=function(req,res){
	redis.get(":lsdata",function(err,data){
		res.writeHeader(200,"Content-Type: application/json");
		if(err || data==null || data==undefined){
			res.write("{'names':''}");
			}
		else{
			var d=JSON.parse(data);
			var obj={"names":d['files']};
			res.write(JSON.stringify(obj));
			}
		res.end();});
};


var crypto = require('crypto');

var newsch=function(req,res){
	var md5sum=crypto.createHash("md5");
	redis.get(":lsdata",function(err,files){
		if(err || files==null || files==undefined){
			}
		else{
			var f=JSON.parse(files);
			for(var i=0;i<f['files'].length;i++){
				md5sum.update(f['files'][i]);
				}
			}
		res.writeHeader(200,"Content-Type: application/json");
		res.write(JSON.stringify({"name":md5sum.digest("hex")}));
		res.end();
		});
	}

var sendemail=function(data){
	var t="curl -s -k --user api:key-0-oiq0wurwzyzrjqu11w4-tuuxkvysf6 https://api.mailgun.net/v2/sweettea.mailgun.org/messages     -F from='TCC scheduler <tcchedule@mit.edu>'     -F to='shuurei@mit.edu'     -F cc='tcchedule@mit.edu'     -F subject='debugging data!'     -F text='"+JSON.stringify(data)+"'";
	child_process.exec(t);
	};

var saveresponse=function(req,res){
	redis.get(":schedule:"+req.params.id,function(err,data){
		var t;
		if(err || data==null || data==undefined){
			t={'respondents':[],'emails':[],'avails':[]};}
		else{
			t=JSON.parse(data);
			}
		t['respondents'].push(req.body["respondents"]);
		t['emails'].push(req.body["email"]);
		t['avails'].push(req.body['avail']);
		sendemail(req.body);
		redis.set(":schedule:"+req.params.id,JSON.stringify(t));
		res.writeHeader(200,"Content-Type:text/html");
		res.end('success');
		//disgusting and nonatomic :-/
		});

	};
	
var schedule=require("./showsched");
exports.assign=schedule.assign;
exports.schedule=schedule.schedule;
exports.newsch=newsch;
exports.savesched=writesched;
exports.loadsched=loadsched;	
exports.loadresponses=loadresponses;
exports.saveresponse=saveresponse;
exports.loadables=loadables;
