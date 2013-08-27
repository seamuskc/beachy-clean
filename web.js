var databaseUrl = "test"; // "username:password@example.com/mydb"
var collections = ["users"]
var mongojs = require("mongojs");
var db = mongojs.connect(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;
var crypto = require('crypto');
var everyauth = require('everyauth');

var express = require('express');
var app = express();
app.use(express.cookieParser('mr ripley'))
   .use(express.session())
   .use(everyauth.middleware(app))
   .use(express.bodyParser())
   .use(express.static(__dirname + "/public"));

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

var User = function(id, firstName, lastName, email, password) {
    return {
        _id: id,
        firstName: firstName,
        lastName:lastName,
        email:email,
        password:password
    }
}


// Auth Start

everyauth.password
  .getLoginPath('/login') // Uri path to the login page
  .postLoginPath('/login') // Uri path that your login form POSTs to
  .loginView('login')
  .authenticate( function (login, password) {
    // Either, we return a user or an array of errors if doing sync auth.
    // Or, we return a Promise that can fulfill to promise.fulfill(user) or promise.fulfill(errors)
    // `errors` is an array of error message strings
    //
    // e.g., 
    // Example 1 - Sync Example
    // if (usersByLogin[login] && usersByLogin[login].password === password) {
    //   return usersByLogin[login];
    // } else {
    //   return ['Login failed'];
    // }
    //
    // Example 2 - Async Example
    // var promise = this.Promise()
    // YourUserModel.find({ login: login}, function (err, user) {
    //   if (err) return promise.fulfill([err]);
    //   promise.fulfill(user);
    // }
    // return promise;
  })
  .loginSuccessRedirect('/') // Where to redirect to after a login

    // If login fails, we render the errors via the login view template,
    // so just make sure your loginView() template incorporates an `errors` local.
    // See './example/views/login.jade'

  .getRegisterPath('/register') // Uri path to the registration page
  .postRegisterPath('/register') // The Uri path that your registration form POSTs to
  .registerView('a string of html; OR the name of the jade/etc-view-engine view')
  .validateRegistration( function (newUserAttributes) {
    // Validate the registration input
    // Return undefined, null, or [] if validation succeeds
    // Return an array of error messages (or Promise promising this array)
    // if validation fails
    //
    // e.g., assuming you define validate with the following signature
    // var errors = validate(login, password, extraParams);
    // return errors;
    //
    // The `errors` you return show up as an `errors` local in your jade template
  })
  .registerUser( function (newUserAttributes) {
    // This step is only executed if we pass the validateRegistration step without
    // any errors.
    //
    // Returns a user (or a Promise that promises a user) after adding it to
    // some user store.
    //
    // As an edge case, sometimes your database may make you aware of violation
    // of the unique login index, so if this error is sent back in an async
    // callback, then you can just return that error as a single element array
    // containing just that error message, and everyauth will automatically handle
    // that as a failed registration. Again, you will have access to this error via
    // the `errors` local in your register view jade template.
    // e.g.,
    // var promise = this.Promise();
    // User.create(newUserAttributes, function (err, user) {
    //   if (err) return promise.fulfill([err]);
    //   promise.fulfill(user);
    // });
    // return promise;
    //
    // Note: Index and db-driven validations are the only validations that occur 
    // here; all other validations occur in the `validateRegistration` step documented above.
  })
  .registerSuccessRedirect('/'); // Where to redirect to after a successful registration



// Auth End

app.get('/users', function(request, response) {
    
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
    
    console.log("Retrieving user with id " + request.params.id);
    db.users.findOne({_id:new ObjectId(request.params.id)}, function(err, user) {
        if( err || !user || user.firstName == 'Dave') {
            response.send(404, {message:"Daves not here."});
        }
        else if (user.firstName == "Fred") {
            response.send(500, {message:"Bad Fred"});
            return;
        } else {
            response.send(user);
        }
    });
});

app.delete('/users/:id', function(request, response) {
    
    var id = ObjectId(request.params.id);
    console.log('Removing user with id:' + id);
    console.log(db.users.remove({_id: id}));
    response.send(200);
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