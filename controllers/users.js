const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const user = await User.findById(id);

  if (user) {
    response.json(user);
    console.log(`Displayed user with id of ${id}`);
    console.log("User", user);
  } else {
    response.status(404).json({error: `No item with id of ${id} found`});
  }
});

usersRouter.get("/username/:username", async (request, response) => {
  const username = request.params.username;
  try {
    const user = await User.findOne({username});

    if (user) {
      response.json(user);
      console.log(`Displayed user with username of ${username}`);
      console.log("User", user);
    } else {
      response
        .status(404)
        .json({error: `No user with username ${username} found`});
    }
  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({error: "Internal server error"});
  }
});

usersRouter.post("/", async (request, response) => {
  const {username, name, password} = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
  console.log(savedUser);
});

usersRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const deletedItem = await User.findByIdAndDelete(id);

    deletedItem
      ? response.status(204).end
      : response.status(404).json({error: `No user with id of ${id} found`});
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
