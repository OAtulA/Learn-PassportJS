import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const LoginPage = () => {
  const loginCall = () => {
    const options = {
      method: "POST",
      data: {
        email: "kaduMosai@mail.com",
        password: "123",
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure Axios includes cookies in the request
    };

    axios("http://localhost:8002/auth/login", options)
      .then((response) => {
        // Check if response status is in the 200 range
        if (response.status >= 200 && response.status < 300) {
          console.log("response is: ", response);

          // Print all headers from response
          console.log("headers are: ");
          console.log(response.headers);

          let responseData = response.data;
          console.log(responseData);

          let accessToken = responseData.accessToken;
          console.log("access token is: ", accessToken);

          // Set the accessToken cookie correctly
          document.cookie = `accessToken=${accessToken}; path=/; secure=true ;SameSite=Strict; expires=${new Date(
            Date.now() + 1000 * 60 * 5
          ).toUTCString()}`;
          console.log("cookie is: ", document.cookie);

          // The refreshToken HttpOnly cookie will be automatically stored by the browser
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <button onClick={loginCall}>Click me already :)</button>
      <br />
      <br />
      <br />
      <Link to="/signup">Sign Up</Link>
      <br />
      <br />
      <br />
      <Link to="/protected">Protected</Link>
    </div>
  );
};

export default LoginPage;
