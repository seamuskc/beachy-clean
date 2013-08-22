var express = require('express');
var app = express();
app.use(express.bodyParser());
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

var databaseUrl = "test"; // "username:password@example.com/mydb"
var collections = ["users"]
var mongojs = require("mongojs");
var db = mongojs.connect(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;

app.get('/register', function(request, response) {
    
    response.render('register', {title:"Register"});

});

app.get('/users/list', function(request, response) {
    
    db.users.find({}, function(err, users) {
        var output = "";
        if( err || !users) {
            response.send("No Users users found");
        }
        else {
            response.render("userList", {title:"User List", users:users});
            //users.forEach( function(user) {
            //    output += JSON.stringify(user);
            //});
        }
        
        //response.send(output);
    });
    
    
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

app.post('/register', function(request, response) {
    
    var id = ObjectId();
    var params = request.body;
    var user = new User(id, params.firstName, params.lastName, params.email, params.password);
    db.users.save(user);
    
    response.render('confirm', {
        title:"Confirm",
        user:user
    });

});

app.get('/users/delete/:id', function(request, response) {
    
    var id = ObjectId(request.params.id);
    console.log('Removing user with id:' + id);
    console.log(db.users.remove({_id: id}));
    
    response.send("Deleted user " + id + "<a href='/users/list'>User List</a>");

});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});