const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get('/users', userController.reqUser)

router.post("/signup",userController.signupUser);
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

