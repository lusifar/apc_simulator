const mongoose = require('mongoose');

const { Schema } = mongoose;

factorSchema = new Schema({
  
  thickness: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  moisture: {
    type: Schema.Types.Decimal128,
    required: true,
  },
});

const Deliver = mongoose.model('factor', factorSchema);

module.exports = Deliver;
