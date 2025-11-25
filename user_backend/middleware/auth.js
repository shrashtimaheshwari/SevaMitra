const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next){
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  if(!token) return res.status(401).json({ message: 'No auth token' });
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }catch(err){
    return res.status(401).json({ message: 'Invalid token' });
  }
}
