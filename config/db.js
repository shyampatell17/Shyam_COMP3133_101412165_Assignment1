const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shyam:shyam17@cluster0.le16v.mongodb.net/comp3133_101412165_assignment1?retryWrites=true&w=majority';
        
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
        
        return conn;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB; 