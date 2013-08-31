
var routes = require("./routes/routes.js");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("./conf/dao.js").db;
var mongojs = require("mongojs");
var crypto = require('crypto');
var ObjectId = mongojs.ObjectId;

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.users.findOne({email: username, password:hashPassword(password, "xxx")}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Invalid Username or Password' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    console.log("from serialize: " + JSON.stringify(user));
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    console.log("deserializeUser: " + id);
    db.users.findOne({_id:new ObjectId(id)}, function(err, user) {
        console.log("deserialized User: " + JSON.stringify(user));
        done(err, user);
  });
});


var express = require('express');
var app = express();
app.use(express.cookieParser('mr ripley'))
   .use(express.session())
   .use(express.bodyParser())
   .use(passport.initialize())
   .use(passport.session())
   .use(express.static(__dirname + "/public"));

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(function(req, res, next){
  //console.log('req.user -->' + req.user);
  console.log('session -->' + JSON.stringify(req.session));
  next();
});

var User = function(id, firstName, lastName, email, password) {
    return {
        _id: id,
        firstName: firstName,
        lastName:lastName,
        email:email,
        password:password
    }
}


//***********
// function requireLogin(req, res, next) {
//   if (req.session.loggedIn) {
//     next(); // allow the next route to run
//   } else {
//     // require the user to log in
//     res.redirect("/login"); // or render a form, etc.
//   }
// }

// // Automatically apply the `requireLogin` middleware to all
// // routes starting with `/admin`
// app.all("/admin/*", requireLogin, function(req, res, next) {
//   next(); // if the middleware allowed us to get here,
//           // just move on to the next route handler
// });

//************


app.get("/", routes.index);

app.get('/login', routes.login);

app.post('/login',
  passport.authenticate('local', { successRedirect: '/app/index.html#/users/list',
                                   failureRedirect: '/login',
                                   failureFlash: false })
);

app.get('/users', function(request, response) {
    
    request.session.name = "someName";
    
    db.users.find({}, function(err, users) {
        if( err || !users) {
            response.send(500, {message:"Unable to retrieve users at this time."});
            return;
        }
        else {
            response.send(users);
        }
    });
});

app.get('/users/:id', function(request, response) {
   
    console.log("from session:" + request.session.name);
    console.log("Retrieving user with id " + request.params.id);
    db.users.findOne({_id:new ObjectId(request.params.id)}, function(err, user) {
        if(err) {
            response.send(500, {message:"Unable to retrieve user at this time."});
        }
        else if (!user) {
            response.send(404, {message:"No user found for id " + request.params.id});
        } else {
            response.send(user);
        }
    });
});

app.delete('/users/:id', function(request, response) {
    
    var id = ObjectId(request.params.id);
    console.log('Removing user with id:' + id);
    db.users.remove({_id: id}, function(err, updateCount){
        console.log("removeCount: " + updateCount + "  err:" + err);
        response.send(updateCount > 0 ? 200 : 500);    
    })
    
});

app.post('/users', function(request, response) {
    
    
    var id = (request.body._id) ? ObjectId(request.body._id) : ObjectId();
    var params = request.body;
    if (params.firstName == "Dave") {
        response.send(500, {message:"Daves Not Here"});
        return;
    }
    var user = new User(id, params.firstName, params.lastName, params.email, hashPassword(params.password, "xxx"));
    db.users.save(user);
    
    response.send(user);

});

var hashPassword = function(pw, salt) {
    
    var saltedAndHashed = pw + "," + salt;
    var digest = crypto.createHash('md5');
    digest.update(saltedAndHashed);
    return digest.digest('hex'); 
    
};

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});

