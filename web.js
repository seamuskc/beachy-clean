var express = require('express');
var app = express();
app.use(express.bodyParser());
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');


app.get('/register', function(request, response) {
    
    response.render('register', {title:"Register"});

});

app.post('/register', function(request, response) {
    
    response.render('confirm', {title:"Confirm", firstName:request.body.firstName, lastName:request.body.lastName});

});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});