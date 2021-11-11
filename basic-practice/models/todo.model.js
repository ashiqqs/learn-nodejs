const mongoos = require("mongoose");

const TodoSchema = mongoos.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  completed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user:{
    type: mongoos.Types.ObjectId,
    ref: "User",
  }
});

//Instance method
TodoSchema.methods = {
  getActiveTodos: () => {
    return mongoos.model("Todo").find({
      status: "active",
    }).select({__v:0, date:0});
  },
};

//static method

TodoSchema.statics= {
    getCompletedTodos: function() {
        return this.findfind({
            status: "completed",
        }).select({__v:0, date:0});
    },
}

//query helper

TodoSchema.query = {
    matchByTitle: function(title){
        return this.find({
            title:new RegExp(title, 'i')
        })
    }
}

module.exports = mongoos.model("Todo", TodoSchema);
