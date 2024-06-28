const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
            await mongoose.connect(process.env.MONGODB_URI),{
                dbName: 'Login',
            }
            console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDb connection error', error)
        process.exit(1)
    }
};

module.exports = connectDB