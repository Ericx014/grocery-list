const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Anonimoe:${password}@fullstack-anonimo.o9noq5l.mongodb.net/grocery-list?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const itemSchema = new mongoose.Schema({
  title: String,
  note: String,
});

const Item = mongoose.model("Item", itemSchema);

if (process.argv.length === 5) {
  const item = new Item({
    title: process.argv[3],
    note: process.argv[4],
  });

  item
    .save()
    .then((result) => {
      console.log(`Added ${item.title} to the list`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log("Error saving item ", error);
    });
}

if (process.argv.length === 3) {
	Item
		.find({})
		.then((items) => {
			console.log("List: ")
			items.forEach((item) => {
				console.log(`Title: ${item.title}, Note: ${item.note}`)
			})
			mongoose.connection.close();
		})
		.catch((error) => {
			console.log("Error fetching items!", error)
		})
}