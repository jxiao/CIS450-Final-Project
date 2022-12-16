/**
 * Utility file for connecting to MongoDB
 */
const dotenv = require("dotenv");

dotenv.config();

// MongoDB URL
const url = `mongodb+srv://admin:${process.env.MONGO_PASSWORD}@entertainment-engine.p1ckgxh.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

module.exports = { url };
