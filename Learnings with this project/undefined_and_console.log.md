# DEBUG with console.log() and undefined

So My functions were not working as expected.  
For mainly user creation.  

## MY TRIAL

I tried putting ```console.log()```
It was that simple to spot the error.  

```Javascript
async function addUser(user) {
  
  // duplicate user functionality not created.

  // checking if user already exists
  const freshUser = users.find(async u =>
    (u.name === user.name) && await bcrypt.compare(user.password, u.password));
    // //DEBUG
    // console.log('DEBUG FreshUser:',freshUser);
  if (freshUser === undefined) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = { name: user.name, password: hashedPassword };
    // //DEBUG 
    // console.log('DEBUG New user is: ',newUser)
    users.push(newUser);
    fs.writeFile('USERS.json', JSON.stringify(users), (err) => {
      if (err) throw err;
    });
    return newUser;    
  }
  else 
    return null;
  
}
```

## How helpful it was  

I was able to see that find was giving ```undefined```  
That's it I put it in the if statement and it worked.  
