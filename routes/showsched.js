var fs=require("fs");
var schedule=function(req,res){
	fs.readFile("schedule.htm",function(err,data){
		if(err){
			res.writeHeader(404,"Content-Type: text/html");
			res.write(err);
			res.end();
			}
		else{
			res.writeHeader(200,"Content-Type: text/html");
			res.write(data);
			res.end();
			}
		});
	};

exports.schedule=schedule;
