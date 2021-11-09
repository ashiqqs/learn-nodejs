const express = require("express");
const Todo = require("../models/todo.model");
const authGuard = require("../middleware/auth-guard.middlware");
const logger = require("../middleware/logger");

const router = express.Router();

router.get("/", authGuard, logger, async (req, res) => {
  try {
    const result = await Todo.find({ status: "active" })
      .select({
        __v: 0,
        date: 0,
      })
      .limit(3);
    res.json(result);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/active", async (req, res) => {
  try {
    const todo = new Todo();
    const data = await todo.getActiveTodos().matchByTitle('Learn');
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/completed", async (req, res) => {
  try {
    const data = await Todo.find().matchByTitle('earn');
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:id", (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(todo);
    }
  });
});

router.post("/", (req, res) => {
  const todo = new Todo(req.body);
  todo.save((err) => {
    if (err) return res.status(500).send(err.message);
    return res.status(200).send(todo);
  });
});

router.post("/many", (req, res) => {
  Todo.insertMany(req.body, (err, todos) => {
    if (err) return res.status(500).send(err.message);
    return res.status(200).send(todos);
  });
});

router.put("/:id", (req, res) => {
  const updatedTodo = Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        status: req.body.status,
        completed: req.body.completed,
      },
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) return res.status(500).send(err.message);
      return res.status(200).json("Updated success.");
    }
  );
  console.log(updatedTodo);
});

router.delete("/:id", (req, res) => {
  Todo.deleteOne({ _id: req.params.id }, (err) => {
    if (err) return res.status(500).send(err.message);
    return res.status(200).send("Deleted success.");
  });
});

module.exports = router;
