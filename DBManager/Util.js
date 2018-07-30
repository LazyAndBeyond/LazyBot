const fs = require('fs')
module.exports =
{

	'write':function(path, write){

		fs.writeFile(path, write, function (err) {
  			if (err) console.log(err)
  			return err;
		});

	},

	'read':function(path){

		fs.readFile(path, function(err, data) {
			if(err) console.log(err)
			console.log(data)
			return data;
		})

	},

	'delete':function(path){

		fs.unlink(path, function (err) {
  			if (err) console.log(err)
  			return err;
		});

	},


}