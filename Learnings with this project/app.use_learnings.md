# Learnings with app.use()

## This is not working as intended

server.js

```JS
const express = require("express");
const app = express();
const userRoutes = require("./routes/usersRoutes");
const pagesRoutes = require('./routes/pagesRoutes')

app.use(express.json());

app.use('/', pagesRoutes)
app.use("/", userRoutes);

app.listen(8002, () => {
  console.log("Server started\n Listening on http://localhost:8002");
});

```

## What's the issue? GG

Culprit is *pagesRouter.js*
You see this generic link its causing the error.

File **pagesRouter.js**

```JS
let express = require('express');
let pagesRouter = express.Router()

pagesRouter.get("/", (req, res) => {
    res.send("Yeah connected");
  })
  
pagesRouter.get("/:page", (req, res) => {
    res.send(`We are working on ${req.params.page}`)
  })


module.exports = pagesRouter
  
```

## How did I fix this? Duck knows : ) ha ha

just put them like this and its done  

```JS
app.use("/", userRoutes);
app.use('/', pagesRoutes);
```
