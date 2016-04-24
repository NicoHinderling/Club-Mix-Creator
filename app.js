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

var fs = require('fs');

function makeid(strLength){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < strLength; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

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

var fs = require('fs');
var youtubeStream = require('youtube-audio-stream');

app.post('/submitSongs', function(req, res) {
  var listItems = req.body.songs;
  console.log(listItems)
  for(i=0; i < listItems.length; i++){
    console.log(listItems[i]);
  };

  try {
    youtubeStream(requestUrl).pipe(res)
  } catch (exception) {
    res.status(500).send(exception)
  }


  var data = {"nico": "meow"};
  // res.writeHead(200, { 'Content-Type': 'application/json' }); 
  // res.end(JSON.stringify(data));
  // res.render('pages/index.ejs', {
  //     message: "nah"
  // });
});

app.get('/tunes', function(req, res) {
  var requestUrl = 'https://www.youtube.com/watch?v=s-mOy8VUEBk'
  // var requestUrl = 'http://youtube.com/watch?v=' + req.params.videoId
  try {
    youtubeStream(requestUrl).pipe(res)
  } catch (exception) {
    res.status(500).send(exception)
  }
});
    // .pipe(fs.createWriteStream('video.flv'));
    // res.render('pages/createmix.ejs', {
    //     user : req.user,
    //     message: "you're dope"
    // });

app.listen(port);
console.log('Now running on port: ' + port);