require('dotenv').config();
const connect = require('../config/db');
const User = require('../models/User');
const Report = require('../models/Report');
const bcrypt = require('bcrypt');

async function run(){
  await connect(process.env.MONGO_URI);
  console.log('Connected');
  // create authority user if not exists
  const authEmail = 'authority@sevamitra.local';
  let a = await User.findOne({ email: authEmail });
  if(!a){
    const hash = await bcrypt.hash('password123', 10);
    a = await User.create({ name: 'Authority', email: authEmail, password: hash, role: 'authority' });
    console.log('Created authority account ->', authEmail, 'password: password123');
  } else console.log('Authority exists');

  // create sample reports
  await Report.deleteMany({});
  await Report.create([{
    fullName: 'Amit Kumar', contactNumber: '9876543210', category: 'Road', description: 'Pothole near gate', location: { lat: 22.7, lng: 75.9 }, status: 'open'
  },{
    fullName: 'Priya Sharma', contactNumber: '9123456780', category: 'Sewage', description: 'Overflowing drain', location: { lat: 22.71, lng: 75.92 }, status: 'open'
  }]);
  console.log('Seeded sample reports');
  process.exit(0);
}
run().catch(err=>{ console.error(err); process.exit(1); });
