// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var timestamps = require('mongoose-timestamp');
// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        lastLogin	 : String,
        group 		: Number
    },

    google: {

    	id : String,
    	token: String,
    	name : String,
    	email : String,
        teams : [String],
        defaultTeam : String,
        session : String,
        picSet : Boolean,
        online : Boolean
        
    }

});


userSchema.plugin(timestamps);

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};






// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);