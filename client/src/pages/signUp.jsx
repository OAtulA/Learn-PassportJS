import React from "react";
import LoginPage from "./login";
import ProtectedPage from "./protected";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const sendData = () => {
    const bodyObj = JSON.stringify({
      email: "kaduMosai@mail.com",
      password: "123",
    });
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: bodyObj,
    };

    fetch("http://localhost:8002/auth/signup", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));

    console.log("I made the request.");
  };

  return (
    <div>
      <form style={{ display: "none", flexDirection: "column" }}>
        <label htmlFor="email">Email</label>
        <input type="text" placeholder="kaduMosai@mail.com" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" placeholder="123" id="password" />
      </form>
      <button onClick={sendData}>Submit</button>
      {/* link to Login page */}
      <Link to="/login">Login Page</Link>
      <br />
      <br />
      <p></p>

      <a href="/home/atul/MyCode/Projects/WEB-DEV/basics/Backend_Minis/UserAuth/client/auth-learn/quick-pages/protect.html"></a>
    </div>
  );
};

export default SignUpPage;
