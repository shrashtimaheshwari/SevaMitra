// routes/reportRoutes.js
const express = require('express');
const Report = require('../models/Report');
// const auth = require('../middleware/authMiddleware'); // keep your existing auth

module.exports = function (io) {
  const router = express.Router();

  /**
   * GET /api/reports
   * Load all open reports for authority dashboard (metadata + usable base64 image if present)
   */
  router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = Math.min(50, parseInt(req.query.limit || '50', 10));
      const skip = (page - 1) * limit;
      const q = { status: 'open' };

      if (req.query.category) q.category = req.query.category;
      if (req.query.status) q.status = req.query.status;

      const total = await Report.countDocuments(q);
      const reports = await Report.find(q)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // allow modification

      // 🔥 FIX: Convert Binary → Base64 so frontend can display
      const sanitized = reports.map(r => {
        if (r.imageData && r.imageData.buffer) {
          r.imageBase64 = `data:${r.imageMime || "image/jpeg"};base64,${r.imageData.buffer.toString("base64")}`;
        }

        return r;
      });

      return res.json({ total, page, limit, items: sanitized });

    } catch (err) {
      console.error('Error fetching reports:', err);
      return res.status(500).json({ message: 'Server error while fetching reports' });
    }
  });

  /**
   * GET /api/reports/:id/image
   * Binary image endpoint (still supported)
   */
  router.get('/:id/image', async (req, res) => {
    try {
      const { id } = req.params;
      const rpt = await Report.findById(id).select('imageData imageMime');

      if (!rpt || !rpt.imageData) {
        return res.status(404).send('Image not found');
      }

      const mime = rpt.imageMime || 'image/jpeg';
      const data = rpt.imageData;

      res.setHeader('Content-Type', mime);
      res.setHeader('Content-Length', Buffer.byteLength(data));
      res.setHeader('Cache-Control', 'public, max-age=86400');

      return res.send(data);
    } catch (err) {
      console.error('Error serving image:', err);
      return res.status(500).send('Server error while serving image');
    }
  });

  /**
   * PATCH /api/reports/:id/resolve
   * Mark report as resolved and remove from DB
   */
  router.patch('/:id/resolve', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Report.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Report not found' });
      }

      io.emit("report_updated", { id, action: "resolved" });

      return res.json({
        message: 'Report resolved and removed from database',
        removedId: id
      });
    } catch (err) {
      console.error('Error resolving report:', err);
      return res.status(500).json({ message: 'Server error while resolving report' });
    }
  });

  /**
   * DELETE /api/reports/:id
   */
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Report.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Report not found' });
      }

      io.emit("report_updated", { id, action: "deleted" });

      return res.json({ message: 'Report deleted', removedId: id });
    } catch (err) {
      console.error('Error deleting report:', err);
      return res.status(500).json({ message: 'Server error while deleting report' });
    }
  });
// authority_backend/routes/reportRoutes.js
router.patch('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Report.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Report not found' });
    return res.json({ message: 'Report resolved and removed', removedId: id });
  } catch (err) {
    console.error('Error resolving report:', err);
    return res.status(500).json({ message: 'Server error while resolving report' });
  }
});


  return router;
};
