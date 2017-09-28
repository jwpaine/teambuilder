// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var serveStatic = require('serve-static');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
// var fileupload = require('express-fileupload');
var configDB = require('./config/database.js');

var serveStatic = require('serve-static');
var fs = require('fs');
var busboy = require('connect-busboy');
//...

var path = require('path');

//HTTPS
var https = require('https');


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
//app.use(fileupload);
// set up our express application
app.use(busboy()); 
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(serveStatic(path.join(__dirname, 'public')))

app.set('view engine', 'ejs'); // set up ejs for templating


// required for passport
app.use(session({ 

cookie: {
	path : '/',
	httpOnly : false,
	maxAge : 24*60*60*1000
},
secret: 'Nhs7Fg58Jjshhr67ujhbvr7hsw34rtghj' 

})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use("/profilepics", express.static(__dirname + '/profilepics'));
app.use("/teampics", express.static(__dirname + '/teampics'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/css", express.static(__dirname + '/css'));

// routes ======================================================================
require('./app/routes.js')(app, passport, mongoose); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
 var options = {
  key: fs.readFileSync('/home/tsunami/web/cert/privkey.pem'),
  cert: fs.readFileSync('/home/tsunami/web/cert/cert.pem'),
  ca: fs.readFileSync('/home/tsunami/web/cert/fullchain.pem')
};


//app.listen(port);
https.createServer(options, app).listen(port);
console.log('Server running on port ' + port);
