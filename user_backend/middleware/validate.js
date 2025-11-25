module.exports = function(req, res, next){
  const { fullName, contactNumber, category, description, location, imageBase64 } = req.body;
  if(!fullName || !contactNumber || !category || !description || !location || !location.lat || !location.lng || !imageBase64){
    return res.status(400).json({ message: 'Missing required fields' });
  }
  next();
}
