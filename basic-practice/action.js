const EventEmmiter = require("events");

class Action extends EventEmmiter {
  kill = () => {
    this.emit("kill", "Person has killed");
  };

  fire = () => {
    setTimeout(() => {
      this.emit("fire", "Person fired.");
    },3000);
  };
}

module.exports = Action;
