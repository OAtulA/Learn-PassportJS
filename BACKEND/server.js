const express = require("express");
const app = express();
const userRoutes = require("./routes/usersRoutes");
const pagesRoutes = require('./routes/pagesRoutes')
const path = require("path")

app.use(express.json());
// app.use("/", userRoutes);
// app.use('/', pagesRoutes)

app.get('/', (req, res)=>{
  res.sendFile(path.resolve("views/index.html"));
})

app.listen(8002, () => {
  console.log("Server started\n Listening on http://localhost:8002");
});
