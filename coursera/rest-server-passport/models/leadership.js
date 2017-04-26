var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leaderSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  designation: {
    type: String,
    default: ''
  },
  abbr: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  }
},{
  collection: 'Leaders'
})

var Leaders = mongoose.model('Leaders', leaderSchema);
module.exports = Leaders;
