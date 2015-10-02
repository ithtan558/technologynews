var express = require('express');
var user = require('./user');
var skill = require('./skill');
var article = require('./article');
var category = require('./category');
var comment = require('./comment');
var middlewareLogin = require('./middleware/login');
module.exports = function(app, passport){
	user(app,passport);
	skill(app);
	article(app);
	category(app);
	comment(app);
	app.get('/home/:name', function (req, res){
		var name = req.params.name;
		res.render('home/' + name);
	});
	app.get('/user/:name', function (req, res){
		var name = req.params.name;
		res.render('user/' + name);
	});
	app.get('/articles/:name', function (req, res){
		var name = req.params.name;
		res.render('articles/' + name);
	});
	app.get('/modal/:name', function (req, res){
		var name = req.params.name;
		res.render('modal/' + name);
	});
	app.get('/partials/:name', function (req, res){
		var name = req.params.name;
		res.render('partials/' + name);
	});
	app.get('/register-login', middlewareLogin.loggedIn, function(req, res, next) {
	  	res.render('index');
	});
	app.get('*', function(req, res, next) {
	  	res.render('index');
	});
}