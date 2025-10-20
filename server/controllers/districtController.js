// server/controllers/districtController.js
const Performance = require('../models/Performance');

const getPerformance = async (req, res) => {
  try {
    const { district } = req.params;

    // Fetch ALL records for the district (which will likely be one document per financial year)
    // To simplify the frontend, let's fetch ALL records for the district.
    const records = await Performance.find({ district }).sort({ financialYear: 1 });

    if (!records || records.length === 0) {
      return res.status(404).json({
        state: null,
        district,
        financialYear: null,
        performance: [],
        message: 'No data found for this district',
      });
    }

    // --- NEW LOGIC: Flatten and Prepare Data for the Chart ---
    
    // 1. Flatten the monthly performance arrays from all records (all years)
    const allMonthlyPerformance = records.flatMap(record => {
        // Map monthly items, adding state/year context to each monthly entry
        return record.performance.map(item => ({
            ...item.toObject(), // Convert Mongoose sub-document to plain object
            financialYear: record.financialYear,
            state: record.state,
            district: record.district,
        }));
    });
    
    // 2. Sort the data by year and then by month for chronological charting
    const monthOrder = ["April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    allMonthlyPerformance.sort((a, b) => {
        if (a.financialYear !== b.financialYear) {
            return a.financialYear.localeCompare(b.financialYear);
        }
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    // We return the raw, sorted monthly array, wrapped in the district context.
    const response = {
      state: records[0].state || null,
      district: records[0].district || null,
      // financialYear is no longer singular; let the frontend handle the range
      financialYear: records.map(r => r.financialYear).join(', '), 
      performance: allMonthlyPerformance, // This is the array of ALL monthly objects
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching district performance:', err);
    res.status(500).json({
      state: null,
      district: null,
      financialYear: null,
      performance: [],
      message: 'Server Error',
    });
  }
};

const getDistricts = async (req, res) => {
  try {
    const districts = await Performance.distinct('district');
    res.json(districts);
  } catch (err) {
    console.error('Error fetching districts:', err);
    res.status(500).json([]);
  }
};
module.exports = { getPerformance, getDistricts };