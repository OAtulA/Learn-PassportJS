# Protected Route

A route I want only a registered user to be able to access.

Here I am checking it via **accessToken**  

So the dummy request I made was like this.

```JS
accessToken=''// your access token
refreshToken=''; // your refresh token

fetch('http://localhost:8002/auth/protected', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'Cookie': `refreshToken=${refreshToken}`
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  console.log('User information:', data.user); // User information
  console.log('Success message:', data.successMessage); // Success message
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});

```

***The Output is like***

```JS
User information: {
  _id: '65c48eff9ef3637333d9b189',
  email: 'kaduMosai@mail.com',
  password: '$2b$10$hBNaMjs1G1KUBYqFJahCqeS5mm8E2DbLcSGBZSV3M5V4SXrY5O3im',
  __v: 0
}
Success message: You are verified 😇️ 
```
