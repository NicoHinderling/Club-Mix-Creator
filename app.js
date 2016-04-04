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

//Routes
require('./routes.js')(echo, app, passport);

app.listen(port);
console.log('Now running on port: ' + port);