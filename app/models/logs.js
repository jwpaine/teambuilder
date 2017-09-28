// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var timestamps = require('mongoose-timestamp');
// define the schema for our user model
var logSchema = mongoose.Schema({
    
    group : {
    	add : {
    		user : String,
    		group : String
    	}
    }
   
     
});

logSchema.plugin(timestamps);
// create the model for users and expose it to our app
module.exports = mongoose.model('log', logSchema);