const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup",async (req, res) => {
    // console.log('??DEBUG req.body:', req.body)
    let user = await userController.addUser(req.body);
    // //DEBUG
    // console.log('??DEBUG user:', user)
    if (user !== null) {
      res.status(201).send(user);
      console.log("Newly added user: ", users[users.length - 1])
    }
    else res.status(401).send('User name unavailable');
  });
router.put("/users/password", (req, res) => {
    let existingUser = req.body.existingUser;
    let updatedPassword = req.Update.password;
    userController.editUserPassword(existingUser, updatedPassword);
  });
router.put("/users/name", 
(req, res) => {
    let existingUser = req.body.existingUser;
    let updatedName = req.Update.Name;
    userController.editUserName(existingUser, updatedName);
  });
router.delete("/users/remove", userController.removeUser);
router.post("/users/login", userController.login);

module.exports = router;

/* for the normal requests the body will look like this.
`
body: JSON.stringify({
      name: 'Aman',
      password: '1245heail'
    }
`
But for the put I want request
for password update
`
body:JSON.stringify({
  existingUser:{
      name: 'Aman',
      password: '1245heail'
    },
    Update:{
    password: 'mohan2984'
  }
}
`

*/

