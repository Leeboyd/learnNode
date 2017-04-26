var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
  postedBy: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dishes'
  }]
},{
  timestamps: true,
  collection: 'Favorites'
});

var Favorites = mongoose.model('Favorites', favoriteSchema);
module.exports = Favorites;
