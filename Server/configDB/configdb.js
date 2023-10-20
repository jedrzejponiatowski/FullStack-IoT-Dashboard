const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://0.0.0.0:27017/alfadb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
        //const db = mongoose.connection
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};

module.exports = connectDB;