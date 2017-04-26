var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var promoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  price: {
    type: Currency,
    default: 0.00
  },
  description: {
    type: String,
    required: true
  }
},{
  collection: 'Promos'
})

var Promos = mongoose.model('Promos', promoSchema);
module.exports = Promos;
