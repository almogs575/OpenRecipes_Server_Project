var express = require("express");
var router = express.Router();
const DButils = require("../utils/DButils");
const utils = require("../utils/helpingFunc");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res, next) => {
  try {
    let countries = await utils.getCountries();
    const users = await DButils.execQuery("SELECT username FROM dbo.users");
    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };
    // add the new username
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO dbo.users VALUES (default,'${req.body.username}','${hash_password}','${req.body.first_name}','${req.body.last_name}','${req.body.country}','${req.body.email}','${req.body.image_URL}',0,0)`
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM dbo.users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }
    req.session.user_id = user.user_id;
    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", function (req, res) {
  req.session.reset();
  console.log(req.session);
  res.send({ success: true, message: "logout succeeded" });
});

// router.post("/Logout", function (req, res) {
//   req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
//   res.send({ success: true, message: "logout succeeded" });
// });

module.exports = router;
