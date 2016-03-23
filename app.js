var express = require('express');
var app = express();

// http://developer.echonest.com/api/v4/

app.get('/', function (req, res) {
  routes = ["/", "/login", "/lookup"]
  var homepageText = 'Welcome to Club-Mix Creator. Available routes:'
  for (i = 0; i < routes.length; i++) { 
    homepageText += "\n- '" + routes[i] + "'";
  }
  res.send();
});

app.get('/login', function (req, res) {
  res.send('Login');
});

app.get('/lookup', function (req, res) {
  res.send('lookup');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Club DJ listening on port 3000!');
});