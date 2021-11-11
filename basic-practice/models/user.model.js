const mongoos = require("mongoose");

const UserSchema = mongoos.Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
  todos: [
    {type: mongoos.Schema.Types.ObjectId, ref: "Todo"},
  ]
});


module.exports = mongoos.model("User", UserSchema);
