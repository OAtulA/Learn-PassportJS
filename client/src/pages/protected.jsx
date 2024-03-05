import React from "react";
import axios from "axios";
const ProtectedPage = () => {
  const protectedCheck = () => {
    const requestData = {
      email: "kaduMosai@mail.com",
      password: "123",
    };

    axios
      .post("http://localhost:8002/auth/protected", requestData, {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        alert(error.message);
        console.error(error);
      });
  };

  return (
    <div>
      <button onClick={protectedCheck}>Protected page check</button>
    </div>
  );
};

export default ProtectedPage;
