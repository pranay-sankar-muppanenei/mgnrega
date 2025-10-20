// server/routes/districtRoutes.js
const express = require('express');
const router = express.Router();
const { getPerformance, getDistricts } = require('../controllers/districtController');

router.get('/districts', getDistricts);
router.get('/district/:district/performance', getPerformance);

module.exports = router;
