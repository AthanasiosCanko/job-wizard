var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	first: String,
	last: String,
	email: {type: String, unique: true},
	password: {type: String, required: true},
	education: String,
	occupation: String,
	day: String,
	month: String,
	year: String
});

UserSchema.methods.validatePassword = function(password, callback) {
	bcrypt.compare(password, this.password, function(err, isValid) {
		if (err) return callback(err);
		return callback(null, isValid);
	}

};