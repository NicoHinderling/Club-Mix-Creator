var mongoose = require('mongoose');

// define the schema for our user model
var mixSchema = mongoose.Schema({

    mix_id           : String,
    title            : String
});

// methods ======================
// generating a hash
// userSchema.methods.
// create the model for users and expose it to our app
module.exports = mongoose.model('Mix', mixSchema);