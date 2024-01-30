require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("Connecting to", url);

mongoose.connect(url)
	.then(result => {
		console.log("Connected to MongoDB")
	})
	.catch((error) => {
		console.log("Error connecting to MongoDB:", error.message)
	})

const itemSchema = new mongoose.Schema({
  title: String,
  note: String,
});

itemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Item", itemSchema)