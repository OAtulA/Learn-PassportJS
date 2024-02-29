import React from "react";

const LogoutPage = () => {
  const handleLogout = () => {
    console.log("Logout initiated");
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;

    // Delete request on localhost:8002
    fetch("http://localhost:8002/api/auth/logout", {
      method: "DELETE",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div>
      <h2>LogOut form</h2>
      <div className="form">
        <input type="email" className="email" placeholder="kudda@mail.com" />
        <br />
        <input type="password" className="password" placeholder="password" />
        <br />
        <button
          style={{
            width: "7rem",
            height: "3rem",
            backgroundColor: "aquamarine",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LogoutPage;
