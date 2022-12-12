const dotenv = require("dotenv");

dotenv.config();

// MongoDB URL
const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cis557.w3y4f6v.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@entertainment-engine.p1ckgxh.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

module.exports = { url };
