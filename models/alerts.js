const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alertSchema = new mongoose.Schema({
  expected_time: Date,
  lat: Number,
  lng: Number,
  step: Number,
  type: String,
  altitude: Number,
  captured_time: Date,
  captured_timestamp: Number,
  code_postal: String,
  country: String,
  expected_timestamp: Number,
  file_grid: Number,
  file_type: String,
  level: String,
  location: { 
    type: String, 
    coordinates: [Number] 
  },
  value: Schema.Types.Mixed
});

const AlertSchema = mongoose.model("alerts", alertSchema, "alerts");
const AlertItalySchema = mongoose.model("alerts_italy", alertSchema, "alerts_italy");
const AlertSubmersionSchema = mongoose.model("submersion", alertSchema, "submersion");
const AlertThunderSchema = mongoose.model("thunder_v2", alertSchema, "thunder_v2");
const AlertPollutionSchema = mongoose.model("pollution", alertSchema, "pollution");

module.exports = { 
  Alert: AlertSchema, 
  AlertItaly: AlertItalySchema,
  AlertSubmersion: AlertSubmersionSchema,
  AlertThunder: AlertThunderSchema,
  AlertPollution: AlertPollutionSchema
};
