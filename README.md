# passport-jwt branch

I want to learn passport-jwt.  
But I am getting some errors in implementing it.

## What have I tried

I tried 10-15 tutorials from Youtube and read some blogs.  
But I can't implement it still.  

## Why did I choose PassportJS

I read it offers 500+ strategies so wanted to give it a try.  

## What is the error 

`BACKEND/controllers/passport-jwt-auth.js` is not working as expected.  
The main thing is below the `Line 93` part.  
Thats the `passportJwtStrategy` part.

I tried the RapidAPI Client to send the generated cookies but its not working  
to authenticate.

**Signup and login** is working as expected.  
But `authenticateJWT` at `line 243` is not.  

The `passportJwtStrategy` is not getting the `refreshToken` as cookie.

## SETUP INSTRUCTIONS

Ensure `npm` is installed.

*If you don't use `node 20` or above. Please modify the dev in package.json.  I do not use nodemon*

### CLone this repo

`git clone git@github.com:OAtulA/Learn-PassportJS.git`

`cd` into the folder.

### Start the mongodb on your system
As my code uses the local mongodb.

### Node part

Paste it in the terminal and it should start at `http://localhost:8002`
```
npm i pnpm
pnpm i
pnpm run dev
```

## Reproducing the error

### Signup part

```JS
const options = {method: 'POST', body: '{"email":"kaduMosai@mail.com","password":"123"}'};

fetch('http://localhost:8002/auth/signup', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

### login part

```JS
const options = {method: 'POST', body: '{"email":"kaduMosai@mail.com","password":"123"}'};

fetch('http://localhost:8002/auth/login', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

### Authentication part

```JS

let accessToken = ''  //Recieved accessToken
let refreshToken = '' //Recieved refreshToken
const options = {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    Cookie: `refreshToken=${refreshToken}`
  }
};

fetch('http://localhost:8002/auth/protected', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

## THANKS

Thank you for reading this.  
If any question please ask.  
If any mistake please tell.