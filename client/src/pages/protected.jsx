import React from "react";

const ProtectedPage = () => {
  const protectedCheck = () => {
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: "kaduMosai@mail.com",
        password: "123",
      }),
    };

    fetch("http://localhost:8002/auth/protected", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  };

  return (
    <div>
      <button onClick={protectedCheck}>Protected page check</button>
    </div>
  );
};

export default ProtectedPage;
