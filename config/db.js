const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://shyam:shyam17@cluster0.le16v.mongodb.net/comp3133_101412165_assignment1?retryWrites=true&w=majority', {
            // No need for deprecated options
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`); // This will show which database you're connected to
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 