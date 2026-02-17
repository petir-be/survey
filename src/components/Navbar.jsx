import React, { useContext, useState, } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Context/authContext";
import AccountModal from "./AccountModal";
import { motion, AnimatePresence } from "framer-motion";
import { IoDocumentText, IoSparkles, IoGrid } from "react-icons/io5";
import { FaSpinner, } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";

import "../global.css";




import axios from "axios";




function NavBar() {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 700px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 699px)" });
  const [showAccountModal, setShowAccountModal] = useState(false);

  const { isAuthenticated, user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
 

   
  const [form, setForm] = useState({});
  const [showAIInput, setShowAIInput] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
   async function MakeForm() {
    if (!user?.id) {
      console.log("nyaw");
      navigate("/login");
      toast.error("Please log in to create a form.");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Form/createform`,
        {
          userId: user.id,
          title: "Untitled",
        },
        {
          withCredentials: true,
        },
      );
      if (res.data && res.data.surveyId) {
        navigate(`/newform/${res.data.surveyId}`);
      }
      setForm(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function MakeAIForm() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Form/Ai`,
        {
          userId: user.id,
          title: "",
          promt: aiPrompt,
        },
        {
          withCredentials: true,
        },
      );
      if (res.data && res.data.surveyId) {
        navigate(`/newform/${res.data.surveyId}`);
      }
      setForm(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowAIInput(false);
      setAiPrompt("");
    }
  }
  return (
    <>
      <AccountModal
        isOpen={showAccountModal}
        close={() => setShowAccountModal(false)}
        title="Account Information"
      ></AccountModal>
       <Toaster position="top-right" />
      
      {isDesktopOrLaptop && (
        
        <nav className="absolute w-full z-10">
          <div className="flex items-center justify-between py-8 px-10 ">
            <Link to={`/`}>
              <h1 className="font-zendots text-white text-[24px] ">SnapQ</h1>
            </Link>

            <div className=" flex  items-center   gap-25 ">
                {/* Redirect to login page if dont have acc log */}
                <button className="text-left " onClick={() => setShowModal(true)}>
              
                  
                    <span className="text-white vagrounded font-semibold text-[12px] hover:text-gray-300">
                      Create Forms
                    </span>
                 
             
                </button>
                {/* Contains of functionality of the system */}
                <Link to={`Workspaces`} className="contents">
                  <button className="  justify-center flex   ">
                    <span className="vagrounded font-semibold text-[12px] text-white hover:text-gray-300 ">
                      My Workspaces
                    </span>
                  </button>
                </Link>
              </div>

              
            <div className="font-vagrounded">
              {isAuthenticated ? (
                <div className="bg-white h-12 w-12 rounded-full flex justify-center items-center">
                  <img
                    src={user.avatar}
                    onClick={() => setShowAccountModal(true)}
                    className="h-10 w-10 cursor-pointer rounded-full"
                  />
                </div>
              ) : (
                <Link className="w-full h-full" to={`login`}>
            <button 
      className="flex items-center justify-center px-10  py-3  ring ring-white text-[14px] font-bold rounded-3xl drop-shadow-md text-white bg-black hover:bg-[#1E1E1E] cursor-pointer"
    >
      Get Started
    </button>
                </Link>
              )}
            </div>
          </div>
          <AnimatePresence>
              {showModal && (
                <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
                >
                  <span
                    className="absolute w-full h-full bg-transparent"
                    onClick={() => setShowModal(false)}
                  ></span>

                  <div className="p-10 w-2/3 h-2/3 bg-(--white) ring ring-white rounded-lg fixed z-50">
                    <h1 className="font-vagrounded text-xl">
                      Start a new Form
                    </h1>
                    <div className="absolute top-0 right-0 w-15 h-15 flex items-center justify-center">
                      <button
                        onClick={() => setShowModal(false)}
                        className="w-full h-full cursor-pointer"
                      >
                        X
                      </button>
                    </div>
                    <div className="p-5 flex items-center justify-evenly w-full h-full">
                      {/* create own forms */}
                      <div className="flex flex-col gap-3 items-center w-full h-full font-vagrounded ">
                        {isLoading ? (
                          <span className="relative w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease flex justify-center items-center ">
                            <FaSpinner className="text-5xl text-(--purple) animate-spin" />
                          </span>
                        ) : (
                          <span className="relative w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 gap-5 duration-400 ease flex flex-col justify-center items-center ">
                            {/* button ng form */}
                            <button
                              className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"
                              onClick={MakeForm}
                            ></button>
                            <IoDocumentText className="w-3/5 h-auto fill-gray-700" />
                            <span className="text-lg font-vagrounded font-bold">
                              Create your own
                            </span>
                          </span>
                        )}

                      </div>

                      {/* generate with ai */}
                      <div className="flex flex-col gap-3 items-center w-full h-full font-vagrounded relative">
                        {!showAIInput ? (
                          <div
                            className="flex flex-col gap-3 items-center w-full h-full cursor-pointer"
                            onClick={() => setShowAIInput(true)}
                          >
                            <span className="relative w-11/12 h-4/5 bg-white/20 gap-5 shadow-md/20 hover:scale-101 duration-400 ease flex flex-col justify-center items-center">
                              <IoSparkles className="w-3/5 h-auto fill-gray-700" />
                              <span className="text-lg font-vagrounded font-bold">
                                Generate with AI
                              </span>
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 items-center justify-center w-full h-11/12 animate-in fade-in zoom-in duration-200">
                            <textarea
                              autoFocus
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              placeholder="Describe what you want to make ...."
                              className="w-11/12 h-full p-3 rounded-lg bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm resize-none shadow-inner"
                            />

                            <div className="flex gap-2 w-11/12">
                              <button
                                onClick={() => setShowAIInput(false)}
                                className="flex-1 py-1 rounded bg-gray-200 hover:bg-gray-300 text-md text-gray-600 transition-colors"
                              >
                                Back
                              </button>
                              <button
                                onClick={MakeAIForm}
                                disabled={isLoading || !aiPrompt.trim()}
                                className="flex-1 py-1 rounded bg-(--purple) text-black text-md disabled:opacity-50"
                              >
                                {isLoading ? "..." : "Generate"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 items-center w-full h-full font-vagrounded">
                        <span className="relative flex  items-center gap-5 justify-center w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 flex-col duration-400 ease">
                          {/* button ng form */}
                          <button className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"></button>
                          <IoGrid className="w-3/5 h-auto fill-gray-700" />
                          <span className="text-lg font-vagrounded font-bold">
                            Use a template
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </nav>
      )}

      {isTabletOrMobile && (
        <nav className="absolute w-full z-50">
          <div className="flex items-center justify-between p-4 ">
            <Link to={`/`}>
              <h1 className="font-zendots text-white text-[16px] px-2">SnapQ</h1>
            </Link>
            <div className="font-vagrounded w-1/6 z-10  flex align-center justify-end">
              {isAuthenticated ? (
                <div className="bg-white h-12 w-12 rounded-full flex justify-center items-center">
                  <img
                    src={user.avatar}
                    onClick={() => setShowAccountModal(true)}
                    className="h-10 w-10 cursor-pointer rounded-full"
                  />
                </div>
              ) : (
              <div class="font-vagrounded min-w-fit z-10 flex items-center justify-end">
  <Link className="h-full" to={`login`}>
    <button 
      className="flex items-center justify-center px-8 py-3 whitespace-nowrap ring ring-white text-[14px] font-bold rounded-3xl drop-shadow-md text-white bg-black hover:bg-[#1E1E1E] cursor-pointer"
    >
      Get Started
    </button>
  </Link>
</div>
              )}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
export default NavBar;
