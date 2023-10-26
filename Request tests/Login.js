const options = {method: 'GET', headers: {'Content-Type': 'application/json'}};

fetch('localhost:8002/users/login', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));