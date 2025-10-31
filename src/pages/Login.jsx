import React, { useState } from "react";
import { useAuth } from "../Context/useAuth";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");

  async function Auth() {
    try {
      await login(email, pass);
      alert("Logged in successfully!");
    } catch (error) {
      console.error(error);
      alert("Login failed. Check your credentials.");
    }
  }

  return (
    <div className="flex flex-col">
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          Auth();
        }}
      >
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <label>Password</label>
        <input
          value={pass}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
