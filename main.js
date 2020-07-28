require("dotenv").config();
const path = require("path");
const DButils = require("./utils/DButils");
const utils = require("./utils/helpingFunc");
const cors = require("cors");

//Libearies importing
const express = require("express");
const logger = require("morgan");
const session = require("client-sessions");
//const bodyParser = require("body-parser");//??????

//Routes importing
const search = require("./routes/search");
const userAuth = require("./routes/userAuth");
const profile = require("./routes/profile");
const recipes = require("./routes/recipes");

//#App setting and config
const port = process.env.PORT || "3000";
const app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: process.env.COOKIE_SECRET, // the encryption key
    duration: 24 * 60 * 60 * 1000, // expired after 20 min
    activeDuration: 0, // if expiresIn < activeDuration,
    //the session will be extended by activeDuration milliseconds
    cookie: {
      httpOnly: false,
    },
  })
);

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

//app.get("/", (req, res) => res.send("welcome"));

app.use(userAuth);
app.use(search);
app.use("/profile", profile);
app.use("/recipes", recipes);

app.use((req, res) => {
  res.sendStatus(404);
});

//if we want to throw error of the server
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send(err.message);
});

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

process.on("SIGINT", function () {
  if (server) {
    server.close(() => console.log("server closed"));
  }
  process.exit();
});
