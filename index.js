require("dotenv").config();
const express = require("express");
const app = express();
// const cors = require("cors")
const Item = require("./models/item");

app.use(express.json());
app.use(express.static("dist"));
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

app.get("/", (request, response) => {
	response.send("<h1>Hello World</h1>")
})

app.get("/api/items", async (request, response) => {
  try {
    const items = await Item.find({});
    response.json(items);
  } catch {
    console.error("Error", error);
    response.status(500).json({error: "Internal server error"});
  }
});

app.get("/api/items/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const specificItem = await Item.findById(id);

    if (specificItem) {
      response.json(specificItem);
      console.log(`Displayed item with id of ${id}`);
    } else {
      response.status(404).json({error: `No item with id of ${id} found`});
    }
  } catch (error) {
    console.error("Error", error);
    response.status(500).json({error: "Internal server error"});
  }
});

app.post("/api/items", async (request, response) => {
  try {
    const {title, note} = request.body;
    !title ? response.end(204).json({error: "Title missing"}) : {};
    const newItem = new Item({title, note});
    const savedItem = await newItem.save();
    response.status(201).json(savedItem);
  } catch {
    console.error("Error:", error);
    response.status(500).json({error: "Internal server error"});
  }
});

app.delete("/api/items/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const deletedItem = await Item.findByIdAndDelete(id);

    if (deletedItem) {
      response.status(204).end;
      console.log(`Deleted item with the id of ${id}`);
    } else {
      response.status(404).json({error: `No item with id of ${id} found`});
    }
  } catch {
    console.error("Error:", error);
    response.status(500).json({error: "Internal server error"});
  }
});

app.put("/api/items/:id", async (request, response) => {
	try {
		const id = request.params.id
		const {title, note} = request.body
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {title, note}
    );

		if (!title) {
      return response.status(400).json({error: "Title missing"});
    }

		if (updatedItem) {
			response.json(updatedItem)
			console.log(`Updated item with the id of ${id}`);
		} else {
      response.status(404).json({error: `No item with id of ${id} found`});
    }

	} catch {
		console.error("Error:", error);
    response.status(500).json({error: "Internal server error"});
	}
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({error: "unknown endpoint"})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});