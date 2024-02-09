let express = require('express');
let pagesRouter = express.Router()

pagesRouter.get("/", (req, res) => {
    res.send("Yeah connected");
  })
  
pagesRouter.get("/:page", (req, res) => {
    res.send(`We are working on ${req.params.page}`)
  })


module.exports = pagesRouter
  