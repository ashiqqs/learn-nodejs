const express = require("express");
const router = express.Router();
const Todo = require("../models/todo.model");

router.get("/", async (req, res) => {
    await Todo.find({status:'active'}).select({
        __v:0,
        date:0
    })
    .limit(3)
    .exec((err, todos) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(todos);
        }
    })
});

router.get("/:id", async (req, res) => {
    await Todo.findById(req.params.id, (err, todo) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(todo);
        }
    })
});

router.post("/", async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save((err) => {
    if (err) return res.status(500).send(err.message);
    return res.status(200).send(todo);
  });
});

router.post("/many", async (req, res) => {
  await Todo.insertMany(req.body, (err, todos) => {
    if (err) return res.status(500).send(err.message);
    return res.status(200).send(todos);
  });
});

router.put("/:id", async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
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

router.delete("/:id", async (req, res) => {
    await Todo.deleteOne({ _id: req.params.id }, (err) => {
      if (err) return res.status(500).send(err.message);
      return res.status(200).send("Deleted success.");
    });
});

module.exports = router;
