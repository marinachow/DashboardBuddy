
//Create express app
const express = require('express');
const session = require("express-session");
const app = express();
const port = 3000;
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//View engine
const pug = require("pug");
const path = require("path");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(express.json());
app.use(
	session({
		secret: "some secret key here",
		resave: true,
		saveUninitialized: false, 
	})
);

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));

//Set up the required data
const Dashboard = require('./Dashboard');
const jsonObj = require("./dashboard-data.json")[0];
const dashboard = new Dashboard(jsonObj.id, jsonObj.name, jsonObj.description, jsonObj.sections);
dashboard.print();