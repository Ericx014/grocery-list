const itemsRouter = require("express").Router();
const Item = require("../models/item");
const User = require("../models/user");

itemsRouter.get("/", async (request, response) => {
  try {
    const items = await Item.find({});
    response.json(items);
  } catch {
    console.error("Error", error);
    response.status(500).json({error: "Internal server error"});
  }
});

itemsRouter.get("/:id", async (request, response, next) => {
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
    next(error);
  }
});

itemsRouter.post("/", async (request, response) => {
  try {
    const {title, note, user} = request.body;
    const foundUser = await User.findById(user);

    if(!title) {
			response.end(204).json({error: "Title missing"}) 
		}
		if (!foundUser) {
      return response.status(404).json({error: "User not found"});
    }
    const newItem = new Item({
      title,
      note,
      user: foundUser._id,
    });
    const savedItem = await newItem.save();
    foundUser.items = foundUser.items.concat(savedItem._id);
    await foundUser.save();
    response.status(201).json(savedItem);
  } catch(error) {
		console.error("Error: ", error);
		response.status(500).json({error: "Internal server error"});
  }
});

itemsRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const deletedItem = await Item.findByIdAndDelete(id);

    deletedItem
      ? response.status(204).end
      : response.status(404).json({error: `No item with id of ${id} found`});
  } catch (error) {
    next(error);
  }
});

itemsRouter.put("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const {title, note} = request.body;
    const updatedItem = await Item.findByIdAndUpdate(id, {title, note});

    if (!title) {
      return response.status(400).json({error: "Title missing"});
    }

    if (updatedItem) {
      response.json(updatedItem);
      console.log(`Updated item with the id of ${id}`);
    } else {
      response.status(404).json({error: `No item with id of ${id} found`});
    }
  } catch (error) {
    next(error);
  }
});

module.exports = itemsRouter;
