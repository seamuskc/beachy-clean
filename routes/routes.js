

exports.index = function(request, response) {
    response.redirect("/app/index.html");
};

exports.login = function(req, resp){
    resp.render("login", {title:"Login"});
};