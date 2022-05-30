const mongoose = require('mongoose');

const { Schema } = mongoose;

paramsSchema = new Schema({
  factor_thickness: {
    type: Schema.Types.Number,
    required: true,
  },
  factor_moisture: {
    type: Schema.Types.Number,
    required: true,
  },
});

const Params = mongoose.model('parameters', paramsSchema);

module.exports = Params;
