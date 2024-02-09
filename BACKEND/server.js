const express = require("express");
const app = express();
const userRoutes = require("./routes/usersRoutes");
const pagesRoutes = require('./routes/pagesRoutes')
const path = require("path");
const authRouter = require("./controllers/passport-jwt-auth");
const { default: mongoose } = require("mongoose");
let cors = require('cors')

app.use(cors())

const db = mongoose.connect("mongodb://localhost:27017")
  .then(
    (og) => {
      console.log("Hello db is connected.")
    } 
)

app.use(express.json());
// app.use("/", userRoutes);
// app.use('/', pagesRoutes)

app.get('/', (req, res) => {
  // res.sendFile(path.resolve("views/index.html"));
  res.send("Cool the server is up and running.")
})

app.use('/auth', authRouter)

app.post("/auth/protected",(req, res, next)=>{
  console.log('/auth/protected hit.');
  next();
}, authRouter.authenticateJWT, (req, res)=>{
  res.send(`User is ${req.user}`)
  res.status(201).send("You are verified 😇️ ")
} )

app.listen(8002, () => {
  console.log("Server started\n Listening on http://localhost:8002");
});
