let bcrypt = require('bcrypt')
let fs = require('fs').promises

let users;

// For signup Route
async function addUser(user) {

  // duplicate user functionality not created.

  // DEBUG
  // console.log('DEBUG user:',user);
  // console.log(user.name === users[0].name)

  // checking if user already exists

  let freshUser = null;
  for (const u of users) {
    if (u.name === user.name && (await bcrypt.compare(user.password, u.password))) {
      freshUser = u;
      break;
    }
  }

  //DEBUG
  console.log('DEBUG FreshUser:', freshUser);

  if (freshUser === null) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = { name: user.name, password: hashedPassword };
    // //DEBUG 
    console.log('DEBUG New user is: ', newUser)
    users.push(newUser);
    fs.writeFile('USERS.json', JSON.stringify(users), (err) => {
      if (err) throw err;
      // console.log('User email updated in file!');
    });
    return newUser;
    // res.status(201).send(user);
  }
  else
    return null;
  // else {
  //   res.status(401).send('User name unavailable');
  // }
}

// Middleware function to check if the user is logged in
function isLoggedIn(req, res, next) {
  const user = users.find(user => (req.body.existingUser.name === user.name));
  //DEBUG
  console.log('DEBUG user:', user)
  if (user === null) {
    return res.status(401).send('Cannot find the user.');
  }
  try {
    if (bcrypt.compare(req.body.existingUser.password, user.password)) {
      // req.user = user;
      next();
      return true;
    } else {
      res.status(401).send('Not allowed');
    }
  } catch {
    res.status(500).send('Invalid user');
  }
}

let login = async (req, res) => {
  const user = users.find(u => req.body.name === u.name)
  if (user === null) {
    return res.status(401).send('Cannot find the user.')
  }
  console.log(user)
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).send('success')
    }
    else {
      res.status(401).send('Not allowed')
    }
  }
  catch {
    res.status(500).send("Invalid user")
  }
}

// here we send the latest updated user to be set after checking.
function editUserEmail(user, updatedEmail) {
  const foundUser = users.find(
    async u =>
      u.name === user.name && bcrypt.compare(user.password, u.password)
  );
  if (foundUser === undefined)
    res.status(401).send('User does not exist')
  else if (foundUser) {
    foundUser.email = updatedEmail;
    fs.writeFile('USERS.json', JSON.stringify(users), (err) => {
      if (err) throw err;
      console.log('User email updated in file!');
    });
    res.status(200).send("Changes successful")
  }
}
// here we send the latest updated user to be set after checking.
function editUserPassword(user, updatedPassword) {
  const foundUser = users.find(async u =>
    u.name === user.name && await bcrypt.compare(user.password, u.password)
  );
  if (foundUser === undefined)
    res.status(401).send('User does not exist')
  else if (foundUser) {
    foundUser.password = updatedPassword;
    fs.writeFile('USERS.json', JSON.stringify(users), (err) => {
      if (err) throw err;
      console.log('User password updated in file!');
    });
    res.status(200).send("Changes successful")
  }
}
// here we send the latest updated user to be set after checking.
async function editUserName(user, updatedName) {
  const foundUser = users.find(async u =>
    u.name === user.name && await bcrypt.compare(user.password, u.password)
  );
  if (foundUser === undefined)
    res.status(401).send('User does not exist')
  else if (foundUser) {
    foundUser.name = updatedName;
    fs.writeFile('USERS.json', JSON.stringify(users), (err) => {
      if (err) throw err;
      console.log('User name updated in file!');
    });
    res.status(200).send("Changed Name successfuly!")
  }
}

async function removeUser(req, res) {
  let user = req.body;
  let foundUser = false;
  for (const u of users) {
    if ((u.name === user.name) && (await bcrypt.compare(user.password, u.password))) {
      foundUser = true;
      users = users.filter(u => (u.name !== user.name));
      fs.writeFile('USERS.json', JSON.stringify(users), (err) => {
        if (err) throw err;
        console.log('User removed from file!');
      });
      res.status(200).send('User removed successfully');
      break;
    }
  }
  if (!foundUser) {
    res.status(401).send('User does not exist');
  }
}

/*
async function removeUser(req, res) {
  let user = req.body;
  const foundUser = false;
  for (const u of users) {
    if ((u.name === user.name) && (await bcrypt.compare(user.password, u.password))) {
      foundUser = u;
      break;
    }
  }
  if (foundUser === false)
    res.status(401).send('User does not exist')
  else {
    users = users.filter(u => (u.name === user.name));
    fs.writeFile('USERS.json', JSON.stringify(users), (err) => {
      if (err) throw err;
      console.log('User removed from file!');
      res.status(201).send('User Removed');
    });
  }
}
*/
async function readUsers() {
  try {
    let data = await fs.readFile('USERS.json', 'utf8');

    // For empty USERS.json 
    if (data.trim() === '') {
      fs.writeFile('./USERS.json', '[]', 'utf8');
      data = await fs.readFile('USERS.json', 'utf8');
    }
    users = JSON.parse(data);
    console.log('Existing users in db: ');
    console.log(users);
    console.log();
  } catch (error) {
    console.log(error);
  }
}
readUsers();

const userControllers = {addUser, login, isLoggedIn, removeUser, editUserName, editUserPassword}
module.exports = userControllers;