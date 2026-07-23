const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const runTests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillsphere');
    console.log('✅ MongoDB Connected Successfully.');

    const testEmail = `test_${Date.now()}@example.com`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const testUser = await User.create({
      name: 'Test User',
      email: testEmail,
      password: hashedPassword,
      role: 'Freelancer',
    });
    console.log('✅ User Schema & Creation Test Passed:', testUser._id);

    if (testUser.role === 'Freelancer') {
      console.log('✅ RBAC Role Assignment Test Passed.');
    } else {
      console.error('❌ RBAC Role Assignment Test Failed.');
    }

    await User.findByIdAndDelete(testUser._id);
    console.log('✅ Cleanup Completed.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test Failed with Error:', error.message);
    process.exit(1);
  }
};

runTests();