// Imports
const express = require("express");
const redis = require("redis");
const bodyParser = require("body-parser");
const cors = require("cors");
const async = require("async");
const convertToLower = require("./utils/Utils");

const port = 2160;
const app = express();

// Redis Connection
// create and connect redis client to local instance.
const redisClient = redis.createClient();
// redisClient.connect();

// Print redis errors to the console
redisClient.on("error", (err) => {
  console.log("Error " + err);
});

// Print redis success to the console
redisClient.on("connect", () => {
  console.log("Connected to Redis...");
});

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoint

app.post("/login", (req, res) => {
  const userName = convertToLower(req.body.userName);
  if (userName) {
    (async () => {
      redisClient.get(userName, async (err, userDetails) => {
        if (err) console.error(err);
        if (userDetails != null) {
          console.log("USER ALREADY CREATED", "CACHE HIT");
          res.json(
            Object.assign(
              {
                requestSuccess: true,
                userStatus: "OLD",
              },
              JSON.parse(userDetails)
            )
          );
        } else {
          console.log("Creating NEW USER", "CACHE MISS");
          await redisClient.set(
            userName,
            JSON.stringify({
              loggedInDate: new Date(),
              win: 0,
              loose: 0,
            })
          );
          res.json({
            requestSuccess: true,
            userStatus: "NEW",
          });
        }
      });
    })();
  } else {
    res.status("404").send({
      message: "Username is required.",
    });
  }
});

app.get("/leaderboard", (req, res) => {
  redisClient.keys("*", function (err, keys) {
    if (err) return console.log(err);
    if (keys) {
      async.map(
        keys,
        function (key, cb) {
          redisClient.get(key, function (error, value) {
            if (error) return cb(error);
            cb(null, Object.assign({ userName: key }, JSON.parse(value)));
          });
        },
        function (error, results) {
          if (error) return console.log(error);
          res.json({
            data: results
              .sort((a, b) => (a.win > b.win ? -1 : 1))
              .filter((result, index) => index < 5),
          });
        }
      );
    }
  });
});

app.post("/save-game", (req, res) => {
  //TRUE - WIN FALSE - LOOSE
  const gameResult = req.body.isWinner;
  const userName = convertToLower(req.body.userName);
  if (userName && gameResult !== "undefined") {
    (async () => {
      redisClient.get(userName, async (err, userDetails) => {
        if (err) console.error(err);
        if (userDetails != null) {
          const jsonUserObj = JSON.parse(userDetails);
          const savedObj = Object.assign(jsonUserObj, {
            win: gameResult ? jsonUserObj.win + 1 : jsonUserObj.win,
            loose: gameResult ? jsonUserObj.loose : jsonUserObj.loose + 1,
          });
          await redisClient.set(userName, JSON.stringify(savedObj));
          res.json({
            message: "Game score added sucessfully.",
          });
        } else {
          res.json({
            message: "User not available.",
          });
        }
      });
    })();
  } else {
    res.status("404").send({
      message: "Username & GameResult is required.",
    });
  }
});

// Servr Start
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
