var User = require('../models/user');

module.exports = {
  addNewMix: function(id, mix_id, title) {
    User.findOneAndUpdate({ '_id': id }, {$push: {"userMixes": {title: title, mix_id: mix_id}}},
      {safe: true, upsert: true}, function (err, raw) {
      if (err) return handleError(err);
        console.log(raw);
    })
  },
  userMixes: function(id) {
    return User
      .findOne({ '_id': id }, 'userMixes')
      .then(user => {
        return user.userMixes;
    });
  }
} 