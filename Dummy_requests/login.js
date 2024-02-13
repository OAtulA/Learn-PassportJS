const options = { method: 'POST', 
headers: {'Content-type':'application/json'},
body: JSON.stringify({ "email": "kaduMosai@mail.com", "password": "123" }) };

fetch('http://localhost:8002/auth/login', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));