var express = require('express');
var app = express();
app.use(express.bodyParser());
app.use(express.static(__dirname + "/public"));

//app.engine('.html', require('ejs').__express);
//app.set('view engine', 'html');

var databaseUrl = "test"; // "username:password@example.com/mydb"
var collections = ["users"]
var mongojs = require("mongojs");
var db = mongojs.connect(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;

var User = function(id, firstName, lastName, email, password) {
    return {
        _id: id,
        firstName: firstName,
        lastName:lastName,
        email:email,
        password:password
    }
}

app.get('/user', function(request, response) {
    
    db.users.find({}, function(err, users) {
        if( err || !users) {
            response.send({});
        }
        else {
            response.send(users);
        }
    });
});

app.get('/user/:id', function(request, response) {
    
    console.log("Retrieving user with id " + request.params.id);
    db.users.findOne({_id:new ObjectId(request.params.id)}, function(err, user) {
        if( err || !user) {
            response.send(404);
        }
        else {
            response.send(user);
        }
    });
});

app.delete('/user/:id', function(request, response) {
    
    var id = ObjectId(request.params.id);
    console.log('Removing user with id:' + id);
    console.log(db.users.remove({_id: id}));
    response.send(200);
});

app.post('/user', function(request, response) {
    
    
    var id = (request.body._id) ? ObjectId(request.body._id) : ObjectId();
    var params = request.body;
    var user = new User(id, params.firstName, params.lastName, params.email, params.password);
    db.users.save(user);
    
    response.send(user);

});




var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});