const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./connect");
const { User, Log } = require("./Model");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/views/index.html");
// });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/users", async (req, res) => {
  const newUser = new User(req.body);
  console.log("newUser", newUser);
  await newUser.save();
  res.json(newUser);
});

app.get("/api/users", async (req, res) => {
  const allUsers = await User.find({}, "_id username");
  res.json(allUsers);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  console.log("exercises id", req.params._id);
  try {
    const addedUser = await User.findOne({ _id: req.params._id });
    console.log(addedUser._id);
    const { description, duration, date } = req.body;
    let newLog;
    if (date) {
      newLog = new Log({
        description,
        duration,
        date: new Date(date).toISOString(),
        createdBy: addedUser._id
      });
    } else {
      newLog = new Log({
        description,
        duration,
        date: new Date().toISOString(),
        createdBy: addedUser._id
      });
    }
    console.log("newLog", newLog);
    newLog.save();
    console.log("exercises", {
      username: addedUser.username,
      description,
      duration: Number(duration),
      date: new Date(date).toDateString(),
      _id: addedUser._id
    });
    res.json({
      username: addedUser.username,
      description,
      duration: Number(duration),
      date: new Date(date).toDateString(),
      _id: addedUser._id
    });
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

app.get("/api/users/:id/logs", async (req, res) => {
  console.log("logs id", req.params.id);
  const addedUser = await User.findOne({ _id: req.params.id });
  try {
    let userLog;
    const { from, to, limit } = req.query;
    console.log("from, to, limit:", from, to, limit);
    
    if (Object.keys(req.query).length !== 0) {
      const selector = "-_id description duration date";
      if (from && !to) {
        console.log("only from");
        const fromOnly = {
          createdBy: req.params.id,
          date: {
            $gte: new Date(from).toISOString()
          }
        };
        if (limit) {
          userLog = await Log.find(fromOnly, selector).limit(Number(limit));
        } else {
          userLog = await Log.find(fromOnly, selector);
        }
        console.log(userLog);
      } else if (!from && to) {
        console.log("only to");
        const toOnly = {
          createdBy: req.params.id,
          date: {
            $lte: new Date(to).toISOString()
          }
        };
        if (limit) {
          userLog = await Log.find(toOnly, selector).limit(Number(limit));
        } else {
          userLog = await Log.find(toOnly, selector);
        }
        console.log(userLog);
      } else if (from && to) {
        console.log("both");
        const bothFromTo = {
          createdBy: req.params.id,
          date: {
            $gte: new Date(from).toISOString(),
            $lte: new Date(to).toISOString()
          }
        };
        if (limit) {
          userLog = await Log.find(bothFromTo, selector).limit(Number(limit));
        } else {
          userLog = await Log.find(bothFromTo, selector);
        }
        console.log(userLog);
      } else if(!from && !to && limit) {
        console.log("only limit");
        userLog = await Log.find({createdBy: req.params.id}, selector).limit(Number(limit));
      }
      userLog.map(log => {
          log.date = new Date(log.date).toDateString();
        })
      res.json({
        username: addedUser.username,
        count: userLog.length,
        _id: addedUser._id,
        logs: userLog
      });
    } else {
      try {
        const userHasLogged = await User.find({ _id: req.params.id });
        console.log("userHasLogged", userHasLogged);
        userLog = await Log.find({ createdBy: req.params.id }, '_id description duration date');
        userLog.map(log => {
          log.date = new Date(log.date).toDateString();
        })
        console.log("userLog", userLog)
        console.log("check type of count", req.params.id, {
          username: addedUser.username,
          count: userLog.length,
          _id: addedUser._id,
          logs: userLog
        });
        res.json({
          username: addedUser.username,
          count: userLog.length,
          _id: addedUser._id,
          logs: userLog
        });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    res.json(error);
  }
});

// update exercise
app.patch('/api/users/:id/logs', async (req, res) => {
  console.log('req body', { ...req.body })
  let updatedLog = await Log.findByIdAndUpdate(req.params.id, { ...req.body });
  await updatedLog.save();
  res.send("updated");
});

app.delete('/api/users/:id/logs', async (req, res) => {
  console.log('req body', req.params);
  await Log.findByIdAndDelete(req.params.id)
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log("Your app is listening on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
