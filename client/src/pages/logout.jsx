import React from "react";
import axios from "axios";

const LogoutPage = () => {
  const handleLogout = async () => {
    console.log("Logout initiated");

    const email =
      document.querySelector(".email").value || "kaduMosai@mail.com";
    const password = document.querySelector(".password").value || "123";

    try {
      // Include credentials (if applicable) for cookie-based authentication
      const response = await axios.delete(
        "http://localhost:8002/api/auth/logout",
        {
          data: { email, password }, // Optional if required by your backend
          withCredentials: true, // Include credentials if using cookie-based authentication
        }
      );

      // Handle successful logout response (clear cookies, redirect, etc.)
      console.log("Logout successful:", response.data);
      // Perform necessary actions like clearing cookies, redirecting to login
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout errors (display error message, retry, etc.)
    }
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
