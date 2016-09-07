var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var pg = require('pg');
/*var mongoose = require('mongoose');
var passport = require('passport');
var User = require('./user-model');
var BasicStrategy = require('passport-http').BasicStrategy;*/

var app = new express();

/*
app.get("/home", passport.authenticate("basic", {session: false}), function(req, res) {
	res.json({message: "Success login!"});
});

var strategy = new BasicStrategy(function(email, password, callback) {
	User.findOne({email: email}, function(err, user) {
		if (err) return callback(err);
		if (!user) return callback(null, false, {message: "User does not exist."});
		
		user.validatePassword(password, function(err, isValid) {
			if (err) return callback(err);
			if (!isValid) return callback(null, false, {message: "Incorrect password."});
			
			return callback(null, user);
		});
	
	});
});

passport.use(strategy);

app.use(passport.initialize());
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.get("/employee_signup", function(req, res) {
	res.sendFile(__dirname + "/public/employee_signup.html");
});

app.get("/employer_signup", function(req, res) {
	res.sendFile(__dirname + "/public/employer_signup.html");
});

app.post("/employee_signup", function(req, res) {

	// Body validation
	if (!req.body) return res.status(400).json({message: "No request body found!"});

	if (!('first' in req.body) ||
		!('last' in req.body) || 
		!('email' in req.body) || 
		!('password' in req.body) ||
		!('education' in req.body) ||
		!('occupation' in req.body) ||
		!('day' in req.body) ||
		!('month' in req.body) ||
		!('year' in req.body)) return res.status(422).json({message: "Please fill all fields!"});
	
	var first = req.body.first;
	var last = req.body.last;
	var email = req.body.email;
	var password = req.body.password;
	var education = req.body.education;
	var occupation = req.body.occupation;
	var day = req.body.day;
	var month = req.body.month;
	var year = req.body.year;
	
	if (first.trim() === "" ||
		last.trim() === "" ||
		email.trim() === "" ||
		password.trim() === "" ||
		education.trim() === "" ||
		occupation.trim() === "" ||
		day.trim() === "" ||
		month.trim() === "" ||
		year.trim() === "") return res.status(422).json({message: "Please fill all fields!"});
	
	
	if (typeof first !== 'string') return res.status(422).json({message: "Incorrect first name type."});
	else if (typeof last !== 'string') return res.status(422).json({message: "Incorrect last name type."});
	else if (typeof email !== 'string') return res.status(422).json({message: "Incorrect e-mail type."});
	else if (typeof password !== 'string') return res.status(422).json({message: "Incorrect password type."});
	else if (typeof education !== 'string') return res.status(422).json({message: "Incorrect education type."});
	else if (typeof occupation !== 'string') return res.status(422).json({message: "Incorrect occupation type."});
	else if (typeof day !== 'string') return res.status(422).json({message: "Incorrect day type."});
	else if (typeof month !== 'string') return res.status(422).json({message: "Incorrect month type."});
	else if (typeof year !== 'string') return res.status(422).json({message: "Incorrect year type."});
	
	
	bcrypt.genSalt(10, function(err, salt) {
		if (err) return res.status(500).json({message: "Internal Server Error"});
		
		bcrypt.hash(password, salt, function(err, hash) {
			if (err) return res.status(500).json({message: "Internal Server Error"});
			
			var user = {
				first: first,
				last: last,
				email: email,
				password: hash,
				education: education,
				occupation: occupation,
				day: day,
				month: month,
				year: year,
				done: false
			};
			
			pg.connect("pg://postgres:wtf@localhost:5432/job_users", function(err, client, done) {
			
				var query = client.query("INSERT INTO job_users(first, last, email, password, education, occupation, day, month, year, done) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", 
				[user.first,
				user.last,
				user.email,
				user.password,
				user.education,
				user.occupation,
				user.day,
				user.month,
				user.year,
				user.done]);

				query.on('end', function() { 
					client.end();
					// Returns array as JSON
					return res.json({message: "Sign up successful. Try logging in."});  		
				});

				if(err)	
					console.log(err);				
				});
			
			
			/*
			User.create(user, function(err, new_user) {
				if (err) return res.status(500).json({message: "Internal Server Error"});

				console.log(new_user);
				return res.status(201).json({message: "Sign up successful. Try logging in."});
			});
			*/

		});
	});
});

app.listen(8080);
