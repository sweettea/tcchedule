var fs=require("fs");

var loadsched=function(req,res){
	fs.readFile("./data/"+req.params.id,function(err,data){
		res.writeHeader(200,"Content-Type: application/json");
		if(err){
			res.write("{}");
			}
		else{
			res.write(data);
			}
		res.end();
		});
	};

exports.loadsched=loadsched;	
