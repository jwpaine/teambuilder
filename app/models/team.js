// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var timestamps = require('mongoose-timestamp');
// define the schema for our user model
var teamSchema = mongoose.Schema({
	    name : String,
	    owner : String,
	    admins : [String],
	    members : [String],
	    picSet : Boolean
});

teamSchema.plugin(timestamps);
// create the model for users and expose it to our app
module.exports = mongoose.model('Team', teamSchema);