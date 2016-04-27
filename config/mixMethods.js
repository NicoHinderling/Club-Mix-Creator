var Mix = require('../models/mix');

module.exports = {
  createMix: function(mix_id, title) {
    Mix.findOne({ 'mix_id' :  mix_id }, function(err) {
      var newMix = new Mix();
      newMix.mix_id = mix_id;
      newMix.title = title;

      newMix.save(function(err) {
        if (err)
          throw err;
      });
    });
  },
  mixTitle: function(mix_id) {
    return Mix
      .findOne({ 'mix_id' : mix_id }, 'title')
      .then(mix => {
        console.log("inside mixMethods");
        console.log(mix.title);
        return mix.title;
      });
  }
};
