/* global google */
import LoginShader from "../components/LoginShader";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/authContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { VscLoading } from "react-icons/vsc";
function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [userNameError, setUsernameError] = useState("");
  const { loginWithGoogle, isAuthenticated, login } = useContext(AuthContext);
  const [email, setEmail] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          const idToken = response.credential;
          console.log("Google ID Token received");
          try {
            setLoading(true);
            await loginWithGoogle(idToken);
            navigate("/");
          } catch (error) {
            console.error("Google login failed:", error);
            setError(error.response?.data?.message || "Google sign-in failed");
          } finally {
            setLoading(false);
          }
        },
        use_fedcm_for_prompt: false,
      });
    } else {
      console.error("Google API not loaded");
    }
  }, [loginWithGoogle]);

  const handleGoogleLogin = () => {
    google.accounts.id.prompt();
  };

  if (isAuthenticated) return null;
  async function Register() {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND}/api/User/register`, {
        email: email,
        password: password,
        name: username,
      });
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <LoginShader />
      <div className="relative z-20 min-h-screen flex flex-col">
        <header className="">
          <Link to={"/"}>
            <p className="cursor-pointer font-zendots text-3xl py-8 px-10">
              C-MEN
            </p>
          </Link>
        </header>
        <div className="flex-1 flex justify-center items-center py-10 sm:py-20">
          <div className="flex justify-center items-center flex-col border border-[#FFFFFF] bg-[#DFE0F0] w-[500px] min-h-[700px] shadow-[inset_0_1px_4px_0px_rgba(255,255,255)] drop-shadow-[0_4px_20px_rgba(132,95,255,0.8)] rounded-3xl gap-4">
            <div className="flex justify-center items-center gap-3 flex-col w-[80%]">
              <h1 className="font-vagrounded text-4xl text-center">
                Let's Get Started!
              </h1>
              <button
                disabled={loading}
                className={`flex flex-row justify-center items-center gap-2.5 font-vagrounded text-xlborder border-[#ffffff] px-8 py-3 rounded-2xl drop-shadow-[0_4px_4px_rgba(0,0,0,.25)] w-full ${
                  loading ? `  bg-gray-500` : `bg-[#DFE0F0]`
                }`}
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="text-3xl" /> Continue with Google
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 w-[85%] my-6">
              <hr className="flex-1 border-black" />
              <p className="text-2xl text-gray-500 font-vagrounded">or</p>
              <hr className="flex-1 border-black" />
            </div>
            <div className="flex items-center justify-center flex-col gap-7 text-gray-400 w-[80%]">
              <div className="flex justify-center items-center flex-col gap-4 w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="placeholder-gray-400 text-black border w-full font-vagrounded text-xl bg-[#DFE0F0]  border-[#ffffff] px-8 py-3 rounded-2xl drop-shadow-[0_4px_4px_rgba(0,0,0,.25)] "
                />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUsername(value);
                    if (value.length < 4) {
                      setUsernameError(
                        "Username can't be lower than 4 letters"
                      );
                    } else {
                      setUsernameError("");
                    }
                  }}
                  className="placeholder-gray-400 text-black border w-full font-vagrounded text-xl bg-[#DFE0F0]  border-[#ffffff] px-8 py-3 rounded-2xl drop-shadow-[0_4px_4px_rgba(0,0,0,.25)] "
                />
                {userNameError && (
                  <>
                    <div className="font-vagrounded text-red-500">
                      {userNameError}
                    </div>
                  </>
                )}
                <div className="relative w-full">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="placeholder-gray-400 text-black border  w-full font-vagrounded text-xl bg-[#DFE0F0]  border-[#ffffff] px-8 py-3 rounded-2xl drop-shadow-[0_4px_4px_rgba(0,0,0,.25)] "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="relative w-full">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPass}
                    onChange={(e) => {
                      setConfirmPass(e.target.value);
                      if (password !== e.target.value) {
                        setError("Password and Confirm Password don't match");
                      } else {
                        setError("");
                      }
                    }}
                    className="placeholder-gray-400 text-black border w-full font-vagrounded text-xl bg-[#DFE0F0] border-[#ffffff] px-8 py-3 rounded-2xl drop-shadow-[0_4px_4px_rgba(0,0,0,.25)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {error && (
                  <>
                    <div>
                      <p className="font-vagrounded text-red-500">{error}</p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={Register}
                disabled={loading}
                className={`flex justify-center items-center active:scale-95 duration-150 text-black  w-full py-3 font-vagrounded text-2xl border border-[#FFFFFF] drop-shadow-[0_4px_4px_rgba(0,0,0,.25)] rounded-2xl
                ${loading ? `bg-gray-400` : `bg-[#B9AAF6]`}`}
              >
                {loading ? (
                  <VscLoading className="text-2xl  animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
            <div className="font-vagrounded flex justify-center items-center gap-1 mt-3">
              <p>
                Already a member?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 underline underline-offset-2"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
