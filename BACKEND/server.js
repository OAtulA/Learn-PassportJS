const express = require("express");
const app = express();
const userRoutes = require("./routes/usersRoutes");

app.use(express.json());

app.use("/", userRoutes);

app.listen(8002, () => {
  console.log("Server started\n Listening on http://localhost:8002");
});
