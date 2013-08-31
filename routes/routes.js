var db = require("../conf/dao.js").db;
var Oid = require("../conf/dao.js").Oid;
var pass = require("../conf/pass.js");


exports.index = function(request, response) {
    response.redirect("/app/index.html");
};

exports.login = function(req, resp){
    resp.render("login", {title:"Login"});
};

exports.getUserList = function(request, response) {
    
    db.users.find({}, function(err, users) {
        if( err || !users) {
            response.send(500, {message:"Unable to retrieve users at this time."});
            return;
        }
        else {
            response.send(users);
        }
    });
};

exports.getUser = function(request, response) {
   
    console.log("Retrieving user with id " + request.params.id);
    db.users.findOne({_id:new Oid(request.params.id)}, function(err, user) {
        if(err) {
            response.send(500, {message:"Unable to retrieve user at this time."});
        }
        else if (!user) {
            response.send(404, {message:"No user found for id " + request.params.id});
        } else {
            response.send(user);
        }
    });
};

exports.deleteUser = function(request, response) {
    
    var id = Oid(request.params.id);
    console.log('Removing user with id:' + id);
    db.users.remove({_id: id}, function(err, updateCount){
        console.log("removeCount: " + updateCount + "  err:" + err);
        response.send(updateCount > 0 ? 200 : 500);    
    });
    
};

exports.saveUser = function(request, response) {
    
    
    var id = (request.body._id) ? Oid(request.body._id) : Oid();
    var params = request.body;
    if (params.firstName == "Dave") {
        response.send(500, {message:"Daves Not Here"});
        return;
    }
    var user = new User(id, params.firstName, params.lastName, params.email, pass.hashPassword(params.password, "xxx"));
    db.users.save(user);
    
    response.send(user);

};

var User = function(id, firstName, lastName, email, password) {
    return {
        _id: id,
        firstName: firstName,
        lastName:lastName,
        email:email,
        password:password
    };
};