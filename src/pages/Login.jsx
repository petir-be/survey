import React, { useState } from "react";
import { useAuth } from "../Context/useAuth";
import DotShader2 from "../components/DotShader2";
import { FcGoogle } from "react-icons/fc";

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
    <>
      <div className="relative w-full h-dvh min-h-dvh flex items-center justify-center ">
        <DotShader2 />
        <header className="absolute top-0 left-0 py-8 px-10 overflow-hidden">
          <h1 className="bg-(--white) z-50 font-zendots text-3xl px-2">
            C-MEN
          </h1>
        </header>

        {/* form */}
        <form 
         onSubmit={(e) => {
          e.preventDefault;
          Auth();
         }}
         className="z-50 bg-(--white) w-1/3 h-2/3 gap-5 rounded-2xl inset-shadow-white inset-shadow-sm/100 ring ring-white shadow-[0px_4px_40px_10px_rgba(132,95,255,0.35)] flex flex-col items-center p-10"
         >
          <h1 className="text-4xl font-vagrounded">Welcome back!</h1>
          <button 
          className="font-vagrounded items-end gap-3 flex justify-center text-lg w-9/12 py-2 rounded-xl shadow-md/30 ring ring-white hover:bg-black/5 transition-color duration-300 ease-out"
          >
            <FcGoogle className="text-3xl" />
            Continue with Google
          </button>
          <div className="flex items-center justify-center w-full gap-15">
            <span className="w-full">
              <hr className="h-0.5 border-t-0 bg-black opacity-100 dark:opacity-50" />
            </span>
            <span className="font-vagrounded text-lg opacity-30">or</span>
            <span className="w-full">
              <hr className="h-0.5 border-t-0 bg-black opacity-100 dark:opacity-50" />
            </span>
          </div>
          <input
            type="email"
            className="login-input placeholder:text-gray-500 focus:outline-none focus:ring-gray-400 focus:ring-2 "
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            className="login-input placeholder:text-gray-500 focus:outline-none focus:ring-gray-400 focus:ring-2 "
            placeholder="Password"
            value={pass}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
          className="login-input bg-purple-200 mt-6 cursor-pointer hover:bg-purple-300 transition-color duration-200 ease-out"
          type = "submit"
          >
            Log in
          </button>
          <div className="flex w-full items-center justify-center gap-2">
            <p className="font-vagrounded text-sm">Don't have an account yet?</p>
            <button 
            className="text-sm text-blue-500 cursor-pointer font-vagrounded"
            >
              <u>Sign up</u>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
