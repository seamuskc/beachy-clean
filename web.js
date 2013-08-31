var routes = require("./routes/routes.js");
var passport = require("passport");

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
  console.log('session -->' + JSON.stringify(req.session));
  next();
});


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


app.post('/login',
  passport.authenticate('local', { successRedirect: '/app/index.html#/users/list',
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