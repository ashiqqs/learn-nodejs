const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

//internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/error-handler.middleware");
const userRoute = require("./routers/user.router");
const inboxRoute = require("./routers/inbox.router");

const app = express();
dotenv.config();

//db connection
mongoose
  .connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

//requet parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set view engine
app.set("view engine", "ejs");

//set static folder
app.use(express.static(__dirname + "/public"));

//parse cookies
app.use(cookieParser(process.env.SECRET));

//routing setup
app.use("/user", userRoute);
app.use("/inbox", inboxRoute);

//error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server started on port " + process.env.PORT);
});
