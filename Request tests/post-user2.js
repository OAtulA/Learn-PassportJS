const fs = require('fs').promises;
const { resolve } = require('path');
let format_user = [];

async function getUsers() {
 try {
    const data = await fs.readFile('Bunch-of-users.txt', 'utf8');
    users = data;
    newUsers = users.split('\n')
    console.log('newUsers= ', newUsers)
    format_user = newUsers.map(user => {
      let user2 = user.split(' ');
      let new_user = { name: user2[0], password: user2[1] };
      return new_user;
    });
 } catch (err) {
    console.error(err);
 }
}

function postUsers() {
 console.log('format_user=', format_user)
 console.log('no. of user signups: ',format_user.length)

 const fetchRequests = format_user.map(user => {
    return fetch('http://localhost:8002/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: user.name,
        password: user.password
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error creating user');
        }
      })
      .then(data => {
        console.log('New user created:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
 });

 Promise.all(fetchRequests).then(() => console.log('All users have been signed up.'));
}

let signups = async ()=>{
 await getUsers()
 //Login check
 postUsers();
}

signups()