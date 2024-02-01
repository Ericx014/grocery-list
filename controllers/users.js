const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("items");
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
	const id = request.params.id;
	const user = await User.findById(id).populate("items");

	if (user) {
    response.json(user);
    console.log(`Displayed item with id of ${id}`);
  } else {
    response.status(404).json({error: `No item with id of ${id} found`});
  }
})

usersRouter.post("/", async (request, response) => {
	const {username, name, password} = request.body

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const user = new User({
    username,
    name,
    passwordHash,
  });

	const savedUser = await user.save()

	response.status(201).json(savedUser)
})

module.exports = usersRouter;