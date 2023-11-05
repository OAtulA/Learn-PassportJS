const express = require("express");
const app = express();
const userRoutes = require("./routes/usersRoutes");
const pagesRoutes = require('./routes/pagesRoutes')

app.use(express.json());
app.use("/", userRoutes);
app.use('/', pagesRoutes)


app.listen(8002, () => {
  console.log("Server started\n Listening on http://localhost:8002");
});
