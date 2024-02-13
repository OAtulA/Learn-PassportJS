const options = {method: 'POST', headers: {'Content-type':'application/json'}, body: '{"email":"kaduMosai@mail.com","password":"123"}'};

fetch('http://localhost:8002/auth/signup', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));