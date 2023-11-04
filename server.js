const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

app.use("/users", userRoutes);

app.listen(8002, () => {
  console.log("Server started\n Listening on http://localhost:8002");
});
