var Hapi = require("hapi");
var Joi = require("joi");
var Path = require('path');
var Inert = require('inert');
var server = new Hapi.Server();
server.connection({										// establishing server connection
	host:'localhost',
	port:3000
});
server.register([require('vision'), Inert],function(err){
	if(err){
		throw err;
	}
	server.route({
		method:'POST',
		path:'/',
		handler:function(req,reply){			
			var value = req.payload;
			var index = value.number;
			var i;
			var seq = [];
			seq[0] = 1;
			seq[1] = 1;
			for(i=2;i<value.number;i++){
				seq[i] = seq[i-1] + seq[i-2];
			}
			var doc ={value:value.number,sequence:seq};
			reply(doc);
		 },
		config: {
        	validate: {
            	payload: {
                	number: Joi.number().integer().min(1).max(1000).default(1)
            	}
        	}
    	}
	});
	server.route([{
		method:'GET',
		path:'/',
		handler:function(req,reply){
			reply.file('index.html');
		}
	},
	{
		method: 'GET',
		path: '/public/{param*}',
		handler: {
		    directory: {
		        path: Path.normalize(__dirname + '/public')
		    }
		}
	}]);
	server.views({
		engines:{
			html:require('handlebars')
		},
		path: Path.join(__dirname, 'public')
	});
});
server.start(function(){ 								//start the server
	console.log("server running at: ",server.info.uri); // server.info.uri has the info // outputs : server running at:  http://localhost:3000
});
