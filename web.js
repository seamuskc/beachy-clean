var databaseUrl = "test"; // "username:password@example.com/mydb"
var collections = ["users"]
var mongojs = require("mongojs");
var db = mongojs.connect(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;
var crypto = require('crypto');

var express = require('express');
var app = express();
app.use(express.cookieParser('mr ripley'))
   .use(express.session())
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