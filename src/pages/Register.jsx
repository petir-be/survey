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
import toast, { Toaster } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import ShaderBackground from "../components/ShaderBackground";
import { useMediaQuery } from "react-responsive";

function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [userNameError, setUsernameError] = useState("");
  const { loginWithGoogle, isAuthenticated, login } = useContext(AuthContext);

  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 700px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 699px)" });
  let navigate = useNavigate();

  const [emailError, setEmailError] = useState("");

  useEffect(() => {

    if (confirmPass.length > 0) {
      if (password !== confirmPass) {
        setError("Password and Confirm Password don't match");
      } else {
        setError("");
      }
    } else {

      setError("");
    }
  }, [password, confirmPass]);

  useEffect(() => {

    if (email.length === 0) {
      setEmailError("");
      return;
    }

    // Start a 2-second timer (2000 milliseconds)
    const delayDebounceFn = setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Check the email after 2 seconds
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }, 1000);

    // CRITICAL: This cleanup function cancels the timer if the user types another letter!
    return () => clearTimeout(delayDebounceFn);

  }, [email]); // <-- This tells React to run this effect every time 'email' changes

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
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(
        (t) => (
          <div className="flex justify-between items-center gap-2 font-vagrounded">
            <span>{msg}</span>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-white text-lg"
            >
              <IoMdClose />
            </button>
          </div>
        ),
        {
          duration: 5000,
          style: {
            minWidth: "250px",
            padding: "16px",
            color: "#fff",
            background: "#f56565",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#f56565",
          },
        }
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <ShaderBackground />

      {isDesktopOrLaptop &&
        <>
          <Toaster position="top-right" />
          <div className="relative z-20 min-h-dvh flex flex-col">
            <header className="text-white">
              <Link to={"/"}>
                <p className="text-white cursor-pointer font-baloo font-black text-[28px] pt-8 pb-0 px-12">
                  ISPECMN
                </p>
              </Link>
            </header>
            <div className=" flex justify-center mt-10 py-5">
              <div className="text-white flex py-10 justify-center items-center flex-col bg-black w-[500px]  shadow-[inset_0_1px_4px_0px_rgba(255,255,255)] drop-shadow-[0_4px_20px_rgba(34,197,94,0.4)] rounded-3xl gap-4">
                <div className="flex justify-center items-center gap-5 flex-col w-[80%]">
                  <h1 className="font-vagrounded text-3xl text-center">
                    Let's Get Started!
                  </h1>
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className={`text-black flex flex-row justify-center items-center gap-2.5 font-vagrounded text-xl bg-white  duration-400 ring ring-white px-8 py-2.5 rounded-2xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] w-full
                       ${loading ? `  bg-white` : ` hover:shadow-[0_2px_20px_rgba(255,255,255,.80)]`
                      }`}

                  >
                    <FcGoogle className="text-3xl" /> Continue with Google
                  </button>
                </div>
                <div className="flex items-center justify-center gap-4 w-[85%] my-2">
                  <hr className="flex-1 border-gray-400" />
                  <p className="text-l text-gray-500 font-vagrounded">or</p>
                  <hr className="flex-1 border-gray-400" />
                </div>


                <form onSubmit={(e) => {
                  e.preventDefault();
                  Register();
                }
                }

                  className="flex items-center justify-center flex-col gap-7 text-gray-400 w-[80%]"
                >


                  <div className="flex justify-center items-center flex-col gap-4 w-full ">

                    {/* EMAIL INPUT */}
                    <div className="w-full flex flex-col gap-1 ">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        autoFocus
                        required
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) {
                            setEmailError("");
                          }
                        }}
                        className="login-input w-full"
                      />
                      {/* EMAIL ERROR DISPLAY */}
                      {emailError && (
                        <div className="font-vagrounded text-red-500 items-center text-center mt-3">
                          {emailError}
                        </div>
                      )}
                    </div>
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
                      className="login-input"
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
                        className="login-input"
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
                        required // 
                        onChange={(e) => setConfirmPass(e.target.value)}
                        className="login-input"
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
                    type="submit"
                    disabled={loading}
                    className={`flex justify-center items-center transition-color ease-out text-white duration-400 w-full py-2.5 font-vagrounded text-xl outline outline-white rounded-2xl   
                ${loading ? 'bg-[#008000]' : "bg-[#008000] hover:bg-[#00A300] shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"


                      }`}
                  >
                    {loading ? (
                      <VscLoading className="text-3xl  animate-spin" />
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </form>



                <div className=" font-vagrounded flex justify-center items-center gap-1 mt-3">
                  <p>
                    Already a member?{" "}
                    <Link
                      to="/login"
                      className="  text-green-600 hover:text-green-700   underline underline-offset-2"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      {isTabletOrMobile &&
        <>
          <Toaster position="top-right" />
          <div className="relative z-20 min-h-dvh flex flex-col">
            <header className="text-white">
              <Link to={"/"}>
                <p className="text-white  cursor-pointer font-baloo font-black text-[20px] pt-4 pb-0 px-6">
                  ISPECMN
                </p>
              </Link>
            </header>
            <div className=" flex justify-center mt-5 py-5">
              <div className="text-white flex py-10 justify-center items-center flex-col bg-black w-full mx-5 shadow-[inset_0_1px_4px_0px_rgba(255,255,255)] drop-shadow-[0_4px_20px_rgba(34,197,94,0.4)] rounded-3xl gap-4">
                <div className="flex justify-center items-center gap-5 flex-col w-[80%]">
                  <h1 className="font-vagrounded text-2xl text-center">
                    Let's Get Started!
                  </h1>

                  <button
                    className={`text-black flex flex-row justify-center items-center gap-2.5 font-vagrounded text-[16px] bg-white  duration-400 ring ring-white px-8 py-2.5 rounded-2xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] w-full
                       ${loading ? `  bg-white` : ` hover:shadow-[0_2px_20px_rgba(255,255,255,.80)]`
                      }`}

                  >
                    <FcGoogle className="text-xl" /> Continue with Google
                  </button>

                </div>
                <div className="flex items-center justify-center gap-4 w-[85%] my-2">
                  <hr className="flex-1 border-gray-400" />
                  <p className="text-l text-gray-500 font-vagrounded">or</p>
                  <hr className="flex-1 border-gray-400" />
                </div>


                <form onSubmit={(e) => {
                  e.preventDefault();
                  Register();
                }
                }

                  className="flex items-center justify-center flex-col gap-7 text-gray-400 w-[80%]"
                >

                  <div className="flex justify-center items-center flex-col gap-4 w-full">
                    <div className="w-full flex flex-col gap-1">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) {
                            setEmailError("");
                          }
                        }}
                        className="login-input !text-[16px]"
                      />
                      {/* EMAIL ERROR DISPLAY */}
                      {emailError && (
                        <div className="font-vagrounded text-red-500 text-sm items-center text-center mt-3">
                          {emailError}
                        </div>
                      )}
                    </div>



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
                      className="login-input !text-[16px]"
                    />
                    {userNameError && (
                      <>
                        <div className="font-vagrounded text-red-500 text-sm">
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
                        className="login-input !text-[16px]"
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
                        onChange={(e) => setConfirmPass(e.target.value)}
                        className="login-input !text-[16px]"
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
                          <p className="font-vagrounded text-red-500 text-sm">{error}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex justify-center hover:bg-[#00A300] items-center transition-color ease-out text-white duration-400 w-full py-2.5 font-vagrounded text-l outline outline-white
                       drop-shadow-md/30 rounded-2xl
   ${loading ? 'bg-[#008000]' : "bg-[#008000] hover:bg-[#00A300] shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                      }`}
                  >
                    {loading ? (
                      <VscLoading className="text-2xl  animate-spin" />
                    ) : (
                      "Sign in"
                    )}
                  </button>

                </form>
                <div className=" text-[12px] font-vagrounded flex justify-center items-center gap-1 mt-3">
                  <p>
                    Already a member?{" "}
                    <Link
                      to="/login"
                      className=" text-[12px] text-green-600 hover:text-green-700   underline underline-offset-2"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      }

    </>


  );
}

export default Register;