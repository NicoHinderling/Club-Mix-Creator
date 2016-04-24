// http://developer.echonest.com/api/v4/

module.exports = function(echo, app, passport) {

    // ROUTE: / (Default)
    app.get('/', function(req, res) {
      var homepageText = "Welcome to Club-Mix Creator. Available routes: ['/', '/login', '/lookup']"
      res.render('pages/index.ejs', { message: homepageText });
    });

    // ROUTE: /Lookup
    app.get('/lookup', function (req, res) {
      res.render('pages/lookup.ejs', {message: ""}); 
    });

    app.post('/lookup', function(req, res) {
      console.log(req.body.title);
      console.log(req.body.artist);
      if (req.body.artist === '' || req.body.title === '') {
        console.log("broke");
        res.render('pages/lookup.ejs', {message: "Please include both a song name and title"});
      }
      else {
        lookupParams = {title: req.body.title, artist: req.body.artist}
        echo('song/search').get(lookupParams, function (err, json) {
          res.render('pages/results.ejs', { results: json.response['songs']}); 
        });
      }
    });

    app.get('/songSearch/:id', function(req, res) {
      id = req.params.id
      echo('song/profile').get({
        id: id,
        bucket: 'audio_summary'
      }, function (err, json) {
        audio_summary = json.response['songs'][0]['audio_summary'];
        console.log(audio_summary); 
        res.send(audio_summary);
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

    app.get('/500', function(req, res){
        console.log("500 hit");
        throw new Error('This is a 500 Error');
    });

};

function isLoggedIn(req, res, next) {
    return next();
    // if (req.isAuthenticated())
    //     return next();

    // res.redirect('/');
}