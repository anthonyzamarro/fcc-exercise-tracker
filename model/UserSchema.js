const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:  String,
    count: Number,
    log: [{description: String, duration: Number, date: Date}]
  });

const User = mongoose.model('User', userSchema);

module.exports = User;