const mongoose = require('mongoose');

// Sub-schema for individual monthly performance records
const MonthlyPerformanceSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  activeJobCards: {
    type: Number,
    default: 0,
  },
  activeWorkers: {
    type: Number,
    default: 0,
  },
  totalExpenditure: {
    type: Number,
    default: 0,
  },
  avgWage: {
    type: Number,
    default: 0,
  },
  ongoingWorks: {
    type: Number,
    default: 0,
  },
  completedWorks: {
    type: Number,
    default: 0,
  },
  womenPersondays: {
    type: Number,
    default: 0,
  },
}, { _id: false }); // We don't need an ID for the sub-documents

// Main Schema for District-Year aggregation
const PerformanceSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
    index: true, // Index for faster lookups by district
  },
  financialYear: {
    type: String,
    required: true,
  },
  // The monthly data array
  performance: [MonthlyPerformanceSchema], 
});

// Compound index to ensure uniqueness for a given district and financial year
PerformanceSchema.index({ district: 1, financialYear: 1 }, { unique: true });

const Performance = mongoose.model('Performance', PerformanceSchema);

module.exports = Performance;