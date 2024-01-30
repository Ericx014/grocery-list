require("dotenv").config();
const express = require("express");
const app = express();
const Item = require("./models/item");

const requestLogger = (request, response, next) => {
	console.log("Method", request.method)
	console.log("Path", request.path)
	console.log("Body", request.body)
	next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

	(error.name === "CastError")
	?	response.status(400).send({error: "malformatted id"})
	: {}

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint"});
};

app.use(express.json());
app.use(requestLogger)
app.use(express.static("dist"));

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

app.get("/api/items/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const specificItem = await Item.findById(id);

    if (specificItem) {
      response.json(specificItem);
      console.log(`Displayed item with id of ${id}`);
    } else {
      response.status(404).json({error: `No item with id of ${id} found`});
    }
  } catch (error) { next(error) }
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

app.delete("/api/items/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const deletedItem = await Item.findByIdAndDelete(id);

		deletedItem
      ? response.status(204).end
      : response.status(404).json({error: `No item with id of ${id} found`});
		
  } catch(error) { next(error)  }
});

app.put("/api/items/:id", async (request, response, next) => {
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

	} catch (error) { next(error) }
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});