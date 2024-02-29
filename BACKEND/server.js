const express = require("express");
const app = express();
const userRoutes = require("./routes/usersRoutes");
const pagesRoutes = require("./routes/pagesRoutes");
const path = require("path");
const authRouter = require("./controllers/passport-jwt-auth");
const { default: mongoose } = require("mongoose");
let cors = require("cors");
const cookieParser = require("cookie-parser");
const { exec } = require("child_process");

app.use(cors());
app.use(cookieParser());

//  TO start the docker container for the passport-auth mongo
(() => {
  exec("docker start passport-auth", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
})();

const db = mongoose.connect("mongodb://localhost:27017").then((og) => {
  console.log("Hello db is connected.");
});

app.use(express.json());
// app.use("/", userRoutes);
// app.use('/', pagesRoutes)

app.get("/", (req, res) => {
  // res.sendFile(path.resolve("views/index.html"));
  res.send("Cool the UserAuth server is up and running.");
});

app.use("/auth", authRouter);

app.post(
  "/auth/protected",
  (req, res, next) => {
    console.log("/auth/protected hit.");
    next();
  },
  authRouter.authenticateJWT,
  (req, res) => {
    console.log("User verified");
    const user = req.user;
    const successMessage = "You are verified 😇️ ";
    const responseData = {
      user: user,
      successMessage: successMessage,
    };
    res.status(201).json(responseData);
  }
);

app.listen(8002, () => {
  console.log("Server started\n Listening on http://localhost:8002");
});
