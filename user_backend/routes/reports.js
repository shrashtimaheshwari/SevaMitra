// backend-user/routes/reports.js
const express = require('express');
const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// POST create report (public)
router.post('/', validate, async (req, res) => {
  try{
    const { fullName, contactNumber, category, description, location, imageBase64 } = req.body;

    // save image to disk for demo (if provided)
    let imageUrl = null;
    if(imageBase64){
      // support data URLs like: data:image/png;base64,AAA...
      const matches = imageBase64.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/);
      if(matches){
        const ext = matches[2] === 'jpeg' ? 'jpg' : matches[2];
        const data = matches[3];
        const fileName = `img_${Date.now()}.${ext}`;
        const filePath = path.join(__dirname, '..', 'uploads');
        if(!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
        const fullPath = path.join(filePath, fileName);
        fs.writeFileSync(fullPath, Buffer.from(data, 'base64'));
        imageUrl = `/uploads/${fileName}`;
      } else {
        // fallback: if client sent a raw url, store as-is
        imageUrl = imageBase64;
      }
    }

    const rpt = await Report.create({ fullName, contactNumber, category, description, location, imageUrl, imageBase64 });
    return res.json({ success: true, reportId: rpt._id });
  } catch(err){
    console.error('Error creating report:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET list (public) - paginated simple
router.get('/', async (req, res) => {
  try{
    const page = parseInt(req.query.page || '1');
    const limit = Math.min(50, parseInt(req.query.limit || '20'));
    const skip = (page - 1) * limit;
    const q = {};
    if(req.query.category) q.category = req.query.category;
    if(req.query.status) q.status = req.query.status;
    const total = await Report.countDocuments(q);
    const items = await Report.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit);
    return res.json({ total, page, limit, items });
  }catch(err){
    console.error('Error fetching reports:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET detail
router.get('/:id', async (req, res) => {
  try{
    const rpt = await Report.findById(req.params.id);
    if(!rpt) return res.status(404).json({ message: 'Not found' });
    return res.json(rpt);
  }catch(err){
    console.error('Error fetching report detail:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/reports/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Report.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Report not found' });
    return res.json({ message: 'Report deleted', removedId: id });
  } catch (err) {
    console.error('Error deleting report:', err);
    return res.status(500).json({ message: 'Server error while deleting report' });
  }
});

module.exports = router;
