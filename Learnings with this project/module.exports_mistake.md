# I got crazy errors today

## What went wrong? You wanna know?  

### CODE

```JS

router.delete("/users/remove", userController.removeUser);
router.post("/users/login", userController.login);
```

### ERROR

```JS

Error: Route.delete() requires a callback function but got a [object Undefined]

at Object.<anonymous> (/home/atul/MyCode/Projects/WEB-DEV/basics/Backend_Minis/UserAuth/BACKEND/routes/usersRoutes.js:28:14)


at Object.<anonymous> (/home/atul/MyCode/Projects/WEB-DEV/basics/Backend_Minis/UserAuth/BACKEND/routes/usersRoutes.js:28:14)


at Object.<anonymous> (/home/atul/MyCode/Projects/WEB-DEV/basics/Backend_Minis/UserAuth/BACKEND/server.js:3:20)

```

## This was the reason

**Looks fine right?**

```JS
const userControllers = [addUser, login, isLoggedIn, removeUser, editUserName, editUserPassword]
module.exports = userControllers;
```

**What's wrong here?**

So the module exports ```object``` not the ```array```  

## WOrking COde

And it all went smooth

```JS
const userControllers = {addUser, login, isLoggedIn, removeUser, editUserName, editUserPassword}
module.exports = userControllers;
```
