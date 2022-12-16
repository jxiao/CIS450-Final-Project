/**
 * @fileoverview MongoDB connection and queries
 * MongoDB database operations
 */
// Import MongoDB driver
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

// Connect to the DB and return the connection object
const connect = async (url) => {
  try {
    const conn = (
      await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    ).db();
    return conn;
  } catch (err) {
    throw new Error("could not connect to the db");
  }
};

const getBestAuthors = async (db) => {
  if (db) {
    const rat = await db
      .collection("books")
      .aggregate([
        { $group: { _id: "$author", avgRating: { $avg: "$rating" } } },
        { $sort: { avgRating: -1 } },
        { $limit: 1 },
      ])
      .toArray();
    const maxAvgRating = rat[0].avgRating;
    const promises = [];
    const authors = await db
      .collection("books")
      .aggregate([
        { $group: { _id: "$author", avgRating: { $avg: "$rating" } } },
        { $match: { avgRating: maxAvgRating } },
        { $project: { _id: 0, author: "$_id", avgRating: 1 } },
        { $sample: { size: 10 } },
      ])
      .toArray();
    authors.forEach(async (author) => {
      promises.push(
        db
          .collection("books")
          .aggregate([{ $match: { author: author.author } }, { $limit: 1 }])
          .toArray()
      );
    });
    const results = await Promise.all(promises);
    return results.map((result) => result[0]);
  }
  return [];
};

module.exports = {
  connect,
  getBestAuthors,
};
