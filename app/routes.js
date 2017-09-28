// app/routes.js
const bodyParser= require('body-parser')
var fs = require('fs');
// load up the user model
var Team           = require('../app/models/team');
var ObjectId = require('mongodb').ObjectId; 


module.exports = function(app, passport, mongoose) {
    var connection = mongoose.connection;
    app.use(bodyParser.urlencoded({extended: true}));
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.redirect('/dash'); // load the index.ejs file
    });



    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
     

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
       
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    
    
    // =====================================
    // LOCAL SIGNUP ==============================
    // =====================================

 /*   app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
*/
        // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/dash',
                    failureRedirect : '/login'
            }));

    // LOCAL routes =================================================
 /*   app.post('/login', passport.authenticate('local-login', {
        suclogoucessRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
     app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
*/
    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
   

    app.get('/create', isLoggedIn, function(req, res) {
       
// owner : userid }, {name: 1, _id : 0
      
                    res.render('create.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
            
      
     });


   app.get('/dash', isLoggedIn, function(req, res) {
       
// owner : userid }, {name: 1, _id : 0
      
                    res.render('dash.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
            
      
     });

      app.get('/profile', isLoggedIn, function(req, res) {
       
// owner : userid }, {name: 1, _id : 0
      
                    res.render('profile.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
            
      
     });

      app.get('/splash', isLoggedIn, function(req, res) {
       
// owner : userid }, {name: 1, _id : 0
      
                    res.render('splash.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
            
      
     });

     app.get('/team', isLoggedIn, function(req, res) {
       
        var id = req.param('id');
        console.log("Setting team id as active: " + id);
          
        var o_id = new ObjectId(id);

        // get team
         connection.db.collection("teams", function(err, collection){
                    collection.findOne({"_id" : o_id}, function(err, team){
                            if(err){
                                res.send(err);
                            }else{

                               console.log(JSON.stringify(team));
                               // build online status and return
                                var online = [];
                                connection.db.collection("users").findOne({"_id" : ObjectId(team.owner)}, {"google.online" : true}, function(err, user){
                                     if(err){
                                        res.send(err);
                                    }else{
                                       online.push(team.owner);
                                       console.log(online);

                                        res.render('team.ejs', {
                                        user : req.user, // get the user out of session and pass to template
                                        team : team,
                                        online : online
                                    });

                                    }
                                });
                               
                                // get online status for owner

                                // get online status from team members

                             
                            }
                        });
                 
            });
     });

    app.get('/updateteampic', isLoggedIn, function(req, res) {
       
        var id = req.param('id');
       
      
         var fstream;
         req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 

        fstream = fs.createWriteStream('./teampics/' + id + ".jpg");
        file.pipe(fstream);
        fstream.on('close', function () {
                res.redirect('/dash');
        });

 });

                    res.render('team.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
            
      
     });

       // add team
       

    app.post('/toggleStatus', isLoggedIn, (req, res) => {
        
        console.log("Toggling online status"); 

        connection.db.collection("users").findOne({"_id" : ObjectId(req.user.id)}, function(err, user) {
            if (err) {
                res.send(err);
            }

               connection.db.collection("users").update({"_id" : ObjectId(req.user.id)},{$set : {"google.online" : !user.google.online}}, function(err, data){
                                if(err){
                                    res.send(err);
                                }

                                res.send( {
                                    user : req.user // get the user out of session and pass to template
                                });
                            });
                });

        });
        

        

    app.post('/updatepic', isLoggedIn, (req, res) => {
        
         var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 

        fstream = fs.createWriteStream('./profilepics/' + req.user.id + ".jpg");
        file.pipe(fstream);

        /* set picset to true for user */
        connection.db.collection("users").update({"_id" : ObjectId(req.user.id)},{$set : {"google.picSet" : true}}, function(err, data){
                                if(err){
                                    res.send(err);
                                }
                            });


        fstream.on('close', function () {
                res.redirect('/profile');
        });


   
      });
});
         // add user to team
    app.post('/addUser', isLoggedIn, (req, res) => {
        console.log("Add use to team requested...");
         var requester = req.user.id;
         var teamid = req.body.teamid;
         var email = req.body.name;

         //find userid, matching email
         connection.db.collection("users").findOne({"google.email" : email}, {"_id" : 1}, function(err, data) {
            if (err) {
                res.send(err);
            }
            // add boolean return from db instead
            if (data == null) { 
                console.log("email not found");
                return;
            }

            console.log("Email found");
                    // ensure adder is team owner and then add member
             
             connection.db.collection("teams").update({"_id" : ObjectId(teamid), "owner" : requester},{$push : {"members" : data._id}}, function(err, team){
                                if(err){
                                    res.send(err);
                                }
                            });
                                // update team for user
                connection.db.collection("users").update({"_id" : ObjectId(data._id)},{$push : {"google.fteams" : ObjectId(teamid)}}, function(err, team){
                                if(err){
                                    res.send(err);
                                }

                                console.log("Updated team for user");

                           });

                   
    
         });

      

         console.log("team: " + teamid + " email: " + email + " requester: " + requester);
      
    });
   


    

    // ==================f===================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login')
    });
   
    // add team
    app.post('/teamAdd', isLoggedIn, (req, res) => {
        console.log(req.body);

        var newTeam = new Team();

        newTeam.name = req.body.name;
        newTeam.owner = req.user.id;
        newTeam.picSet = false;

        console.log("Saving team: " +  newTeam.name + " for owner: " + req.user.id );
            newTeam.save(function(err) {
                    if (err) {
                        throw err;
                    }

                    console.log("Team: " + newTeam._id + "added!");

                    connection.db.collection("users", function(err, collection){
                    collection.update({"_id" : req.user._id}, {$push :{"google.teams" : newTeam._id, "google.defaultTeam" : newTeam._id}  }, function(err){
                            if(err){
                                res.send(err);
                            }else{
                               res.send(newTeam._id);
                              
                            }
                        });
             

                            // ===================
                        });
                    });

      });

   
      

}


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
