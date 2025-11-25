const express = require('express');
const router = express.Router();
const phoneData = [
  { department: 'Sewage Cleaning (Urban Local Body)', phone: '1916', notes: 'Call local ULB helpline' },
  { department: 'Road Maintenance / PWD', phone: '1033', notes: 'State PWD helpline' },
  { department: 'Traffic Police', phone: '103', notes: 'Local traffic control' },
  { department: 'Solid Waste / Garbage', phone: '1800-123-4567', notes: 'Municipal Corporation' },
  { department: 'Public Toilets / Sanitation', phone: '1800-111-222', notes: 'City Sanitation Department' },
  { department: 'Disaster Management (NDMA)', phone: '1078', notes: 'National helpline' }
];

router.get('/', (req, res) => res.json(phoneData));
module.exports = router;
