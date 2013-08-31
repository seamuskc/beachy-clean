var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require("passport-local").Strategy;

var db = require("../conf/dao.js").db;
var Oid = require("../conf/dao.js").Oid;

exports.hashPassword = function(pw, salt) {
    
    var saltedAndHashed = pw + "," + salt;
    var digest = crypto.createHash('md5');
    digest.update(saltedAndHashed);
    return digest.digest('hex'); 
    
};

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.users.findOne({email: username, password:this.hashPassword(password, "xxx")}, function (err, user) {
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
    db.users.findOne({_id:new Oid(id)}, function(err, user) {
        console.log("deserialized User: " + JSON.stringify(user));
        done(err, user);
  });
});