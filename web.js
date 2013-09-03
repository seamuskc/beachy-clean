var routes = require("./routes/routes.js");
var passport = require("passport");
var pass = require("./conf/pass.js");

var express = require('express');
var app = express();
app.use(express.cookieParser('mr ripley'))
   .use(express.session())
   .use(express.bodyParser())
   .use(passport.initialize())
   .use(passport.session())
   .all('/pvt/*', pass.ensureAuthenticated, function(req, resp, next){
        next();
    })
   .use(express.static(__dirname + "/public"));

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(function(req, res, next){
  console.log('session -->' + JSON.stringify(req.session));
  next();
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/protected',
                                   failureRedirect: '/login',
                                   failureFlash: false })
);


app.get("/", routes.index);
app.get('/login', routes.login);
app.get('/users', routes.getUserList);
app.get('/users/:id', routes.getUser);
app.delete('/users/:id', routes.deleteUser);
app.post('/users', routes.saveUser);


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});