require('dotenv').config();

var express  = require('express')
  , echojs = require('echojs')
  , app      = express()
  , mongoose = require('mongoose')
  , passport = require('passport')
  , flash    = require('connect-flash')
  , morgan       = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , session      = require('express-session')
  , configDB = require('./config/database.js')
  , port     = process.env.PORT || 3000
  , echo = echojs({ key: process.env.ECHONEST_KEY });


app.use("/mixes", express.static(__dirname + '/mixes'));
app.use("/audiojs", express.static(__dirname + '/audiojs'));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect(configDB.url);
require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

//Passport
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(allowCrossDomain);
//Routes
require('./routes.js')(echo, app, passport);

app.listen(port);
console.log('Now running on port: ' + port);