var databaseUrl = "test"; // "username:password@example.com/mydb"
var collections = ["users"] // Users
var mongojs = require("mongojs");
var db = mongojs.connect(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;
var mongojs = require("mongojs");

exports.db = db;
exports.Oid = ObjectId;

