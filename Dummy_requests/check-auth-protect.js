accessToken='eciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzQ4ZWZmOWVmMzYzNzMzM2Q5YjE4OSIsIkV4cGlyZXMiOjE3MDc1MTY1NDUsImlhdCI6MTcwNzUwNTc0NX0.A0F6HOO4bCiCRnEEjCkoRNZIbFhiIal11CfYzuXtdZA'// your access token
refreshToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzQ4ZWZmOWVmMzYzNzMzM2Q5YjE4OSIsIkV4cGlyZXMiOjE3MDgxMTA1NDUsImlhdCI6MTcwNzUwNTc0NX0.m8xeboQb4EVLg-CjBKThcz_G0BKm1PvekK-k5zmDCVs'; // your refresh token

fetch('http://localhost:8002/auth/protected', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': `accessToken=${accessToken}`,
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
