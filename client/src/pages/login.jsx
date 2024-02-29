import React from "react";

const LoginPage = () => {
  const loginCall = () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        email: "kaduMosai@mail.com",
        password: "123",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("http://localhost:8002/auth/login", options)
      .then((response) => {
        // Check if response status is in the 200 range
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        console.log("response is: ", response);

        // print all headers from response
        console.log("headers are: ");
        let headers = response.headers;
        for (let pair of headers.entries()) {
          console.log(pair);
        }

        return response.json();
      })
      .then((response) => {
        console.log(response);
        let accessToken = response.accessToken;
        console.log("access token is: ", accessToken);

        // save accessToken to cookie
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <button onClick={loginCall}>Click me already :)</button>
    </div>
  );
};

export default LoginPage;
