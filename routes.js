var fs = require('fs');
var youtubeStream = require('youtube-audio-stream');

var mixMethods = require('./config/mixMethods');
var userMethods = require('./config/userMethods');

var path = require('path');
var mime = require('mime');

function makeid(strLength){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for( var i=0; i < strLength; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

module.exports = function(echo, app, passport) {
    app.get('/', function(req, res) {
      res.redirect('/profile');
    });

    app.get('/userMixes', isLoggedIn, function(req, res) {
      userMethods
        .userMixes(req.user.id)
        .then(mixArray => {
          console.log(mixArray);
          res.send(mixArray);
        });
    });

    // ROUTE: /Login
    app.get('/login', function(req, res) {
        res.render('pages/login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    // ROUTE: /Signup
    app.get('/signup', function(req, res) {
        res.render('pages/signup.ejs', { 
          message: req.flash('signupMessage') 
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // ROUTE: /profile
    app.get('/profile', isLoggedIn, function(req, res) {
      res.render('pages/profile.ejs', {
          user : req.user
      });
    });

    // ROUTE: /createmix
    app.get('/createmix', isLoggedIn, function(req, res) {
        res.render('pages/createmix.ejs', {
            message: ""
        });
    });

    // ROUTE: /logout
     app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/submitSongs', isLoggedIn, function(req, res) {
      for(i=0; i < req.body.songs.length; i++){
        console.log(req.body.songs[i]);
      };
      var songId = makeid(10);
      while(fs.existsSync(__dirname + '/mixes/' + songId + '.mp3')) {
        songId = makeid(10);
      };
      var songFile = fs.createWriteStream(__dirname + '/mixes/' + songId + '.mp3');

      function audioConcat() {
        if (!req.body.songs.length) {
          res.send("/mix/" + songId);
          songFile.end("Done");
          return;
        }
        currentfile = req.body.songs.shift();
        stream = youtubeStream(currentfile);
        stream.pipe(songFile, {end: false});
        stream.on("end", function() {
          console.log(currentfile + ' appended');
          audioConcat();        
        });
      }
      audioConcat();
      mixMethods.createMix(songId, req.body.mixName);
      userMethods.addNewMix(req.user.id, songId, req.body.mixName);
    });

    app.get('/download/:id', function(req, res){
      var file = __dirname + '/mixes/' + req.params.id + '.mp3';
      var mimetype = mime.lookup(file);

      mixMethods
        .mixTitle(req.params.id)
        .then(mixTitle => res.setHeader('Content-disposition', 'attachment; filename=' + mixTitle + '.mp3'));

      res.setHeader('Content-type', mimetype);

      var filestream = fs.createReadStream(file);
      filestream.pipe(res);
    });

    app.get('/mix/:id', function (req, res) {
      if(fs.existsSync(__dirname + '/mixes/' + req.params.id + '.mp3')) {
        mixMethods
          .mixTitle(req.params.id)
          .then(mixTitle => 
            res.render('pages/mix.ejs', {
              'mixTitle': mixTitle,
              "audioID": '/mixes/' + req.params.id + '.mp3',
              "downloadID": '/download/' + req.params.id
            }));
      } else {
        res.render('pages/mixNotFound.ejs');
      }
    });

    app.get('/500', function(req, res){
        console.log("500 hit");
        throw new Error('This is a 500 Error');
    });

    app.get('/*', function(req, res){
      res.render('pages/404.ejs');
    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}