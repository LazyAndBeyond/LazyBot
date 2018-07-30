const path = require('path')
const fs = require('fs')
const util = require('../Util')
const databases = require('./databases.json')

class db {

	constructor(options) {

		this.path = path.join(__dirname, `/databases/${options.name}.json`)
		this.options = options

		if(databases.includes(options.name)) {
			this.data = require(this.path)
			this.name = options.name
		} else {
			//Create the db
			util.write(this.path, "{}")
			//Add it to the list of Databases
			databases.push(options.name)
			this.data = {}
		}

		//Save the databases file

		util.write(path.join(__dirname, 'databases.json'), JSON.stringify(databases))


	}

	read(){
		return require(path.join(__dirname, `/databases/${this.options.name}.json`))
	}

	write(data){
		util.write(path.join(__dirname, `/databases/${this.options.name}.json`), JSON.stringify(data))
		this.data = data
	}

	delete(){
		//Delete the file
		util.delete(path.join(__dirname, `/databases/${this.options.name}.json`))
		//Remove it from the list of databases
		var index = databases.indexOf(this.options.name)
		databases.splice(index, 1);
		//save the databases file

		util.write(path.join(__dirname, 'databases.json'), JSON.stringify(databases))

	}



}

module.exports = db



/*

const DBManager = require('DBManager') //Import The database manager
const DB = new DBManager.db() //If database doesnt exist, make one, else load the database
DB.write() //Write in the database
DB.delete() //Delete the database

*/


