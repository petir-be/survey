import React, { useContext, useState } from "react";
import "../global.css";
import { FaArrowUp } from "react-icons/fa6";
import DotShader from "../components/DotShader";
import HomeBox from "../components/HomeBox";
import toast, { Toaster } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import FAQ from "../components/FAQ";
import { motion, AnimatePresence } from "framer-motion";
import ThreeDModel from "../components/ThreeDmodel";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// You also need to import the specific icon object from the icons package
import { HiTemplate } from "react-icons/hi";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoDocumentText } from "react-icons/io5";
import { IoSparkles } from "react-icons/io5";
import { IoGrid } from "react-icons/io5";
import { IoFolderOpen } from "react-icons/io5";
import Kabadingan from "./Kabadingan";
import { FaThList } from "react-icons/fa";
function Home() {
  const [showModal, setShowModal] = useState(false);

  // 2. Define the options data
  const options = [
    { value: "Owned by Anyone", label: "Owned by Anyone" },
    { value: "Owned by Me", label: "Owned by Me" },
    { value: "Owned by Others", label: "Owned by Others" },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const handleChange = (selectedOptionValue) => {
    setSelectedOption(selectedOptionValue);
    setInputValue("");
  };
  const [inputValue, setInputValue] = useState("");
  const MAX_LENGTH = 16;
  const handleInputChange = (newValue, actionMeta) => {
    // Only apply the limit when the user is typing/entering text
    if (actionMeta.action === "input-change") {
      // Limit the value to 6 characters
      if (newValue.length <= MAX_LENGTH) {
        setInputValue(newValue);
      }
      // If over the limit, the state remains the previous valid value
    } else {
      // Handle cases like 'menu-close' or 'input-blur' where you might reset the input value state if needed
      // setInputValue('');
    }
  };

  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 700px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 699px)" });
  const { user } = useContext(AuthContext);
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
      <Toaster position="top-right" />
      {isDesktopOrLaptop && (
        <>
          {/* para matanggal lang error */}
          {motion}
          <div className="flex items-center justify-center flex-1 min-h-full bg-(--white) z-10">
            <div className="relative w-2/7 h-dvh pt-25">
              <div className="m-12 flex flex-col">
                <span className="text-[42px] font-vagrounded font-semibold">
                  Build Your Form{" "}
                </span>
                <span className="text-[42px] font-vagrounded font-black">
                  {" "}
                  INSTANTLY!
                </span>
                <span className="font-regular italic">
                  Drag, Drop and Build Forms in Seconds.
                </span>
              </div>

              <div className="flex justify-between px-11 items-center w-full ">
                <span className="font-semibold text-[16px]">Recent Forms</span>

                <Select
                  className=" cursor-pointer font-semibold text-[16px]"
                  classNamePrefix="react-select"
                  options={options}
                  value={selectedOption}
                  onChange={handleChange}
                  isClearable // Allows clearing the selection
                  isSearchable // Enables search functionality
                  placeholder="Owned by Anyone"
                  inputValue={inputValue}
                  onInputChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-3/7 relative h-dvh overflow-hidden pt-15 border-2 border-(--dirty-white) bg-(--white) z-10">
              <div className="absolute z-1 w-full h-full flex justify-center items-center">
                <ThreeDModel
                  url="/models/free__rubiks_cube_3d.glb"
                  scale={0.2} // <<< CHANGE SIZE HERE
                />
              </div>
              <div className="absolute top-0 left-0 h-full w-full">
                <DotShader className="z-0" />
                <span className="home-circle mixed-blend-multiply -top-40 left-1 w-45 h-45 bg-(--purple) animate-moveCircleLtR"></span>
                {/*top left*/}
                <span className="home-circle mixed-blend-multiply -top-38 right-1 w-30 h-30 bg-(--pink) animate-moveCircleRtL"></span>
                {/*top right*/}
                <span className="home-circle mixed-blend-multiply -bottom-32 left-1 w-30 h-30 bg-(--pink) animate-moveCircleLtR"></span>
                {/*bottom left*/}
                <span className="home-circle mixed-blend-multiply -bottom-38 right-1 w-45 h-45 bg-(--purple) animate-moveCircleRtL"></span>
                {/*bottom right*/}
              </div>
            </div>

            {/* CREATE FORMS. MY WORKSPACES. FEATURES */}
            <div className=" justify-center flex flex-col gap-5 w-2/7 h-dvh pt-25 px-10">
              {/* Redirect to login page if dont have acc log */}
              <button className="text-left" onClick={() => setShowModal(true)}>
                <div className=" shadow-md justify-center  hover:bg-gray-200 group px-5 h-30 relative flex flex-col border-2 border-[var(--dirty-white)] duration-200 hover:border-purple-500 ">
                  <div className="absolute flex items-center justify-center top-0 right-0 w-9 h-9 bg-[var(--dirty-white)]">
                    <div className="relative w-full h-full font-bold cursor-pointer flex items-center justify-center overflow-hidden">
                      <FaArrowUp className="rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                      <FaArrowUp
                        className="absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:-translate-y-0 
                         transition-all duration-400 ease-out fill-orange-900"
                      />
                    </div>
                  </div>
                  <IoDocumentText className="text-white mb-2 text-[24px]" />
                  <span className="vagrounded font-semibold text-[18px] text-black mb-[2px]">
                    Create Forms
                  </span>
                  <span className="vagrounded font-normal text-[12px] text-black">
                    Start with a blank template and more
                  </span>
                </div>
              </button>
              {/* Contains of functionality of the system */}
              <Link to={`Workspaces`} className="contents">
                <div className="  justify-center  hover:bg-gray-200 group px-5 h-30 relative flex flex-col border-2 border-[var(--dirty-white)]  duration-200 hover:border-purple-500 ">
                  <div className="absolute flex items-center justify-center top-0 right-0 w-9 h-9 bg-[var(--dirty-white)]">
                    <button className="relative w-full h-full font-bold cursor-pointer flex items-center justify-center overflow-hidden">
                      <FaArrowUp className="rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                      <FaArrowUp
                        className="absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:-translate-y-0 
                         transition-all duration-400 ease-out fill-orange-800"
                      />
                    </button>
                  </div>

                  <IoFolderOpen className="text-white mb-2 text-[24px]" />
                  <span className="vagrounded font-semibold text-[18px] text-black mb-[2px]">
                    My Workspaces
                  </span>
                  <span className="vagrounded font-normal text-[12px] text-black">
                    Manage Forms and Responses
                  </span>
                </div>
              </Link>

              <div className="flex items-center text-center justify-center">
                <Link to={"faq"}>
                  <FAQ className="items-center !text-center" />
                </Link>
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
          </div>
        </>
      )}

      {/* --------------------------------MOBILE VIEW-------------------------------- */}
      {isTabletOrMobile && (
        <>
          {/* para matanggal lang error */}
          {motion}

          <div className="flex flex-col items-center justify-center flex-1 min-h-full bg-(--white) z-10">
            <div className="mt-30 flex flex-col justify-center items-center whitespace-nowrap mb-5">
              <span className=" text-[24px] font-vagrounded font-semibold">
                Build Your Form{" "}
              </span>
              <span className="text-[24px] font-vagrounded font-black">
                {" "}
                INSTANTLY!
              </span>
              <span className="text-[12px]">
                Drag, Drop and Build Forms in Seconds.
              </span>
            </div>

            <div className="w-7/7 relative h-[360px] overflow-hidden pt-15 border-2 border-(--dirty-white) bg-(--white) z-10">
              <div className="absolute z-1 w-full h-full flex justify-center items-center">
                <ThreeDModel
                  url="/models/free__rubiks_cube_3d.glb"
                  scale={0.2} // <<< CHANGE SIZE HERE
                />
              </div>

              <div className="absolute top-0 left-0 h-full w-full">
                <DotShader className="z-0" />
                <span className="home-circle mixed-blend-multiply -top-40 left-1 w-45 h-45 bg-(--purple) animate-moveCircleLtR"></span>
                {/*top left*/}
                <span className="home-circle mixed-blend-multiply -top-38 right-1 w-30 h-30 bg-(--pink) animate-moveCircleRtL"></span>
                {/*top right*/}
                <span className="home-circle mixed-blend-multiply -bottom-32 left-1 w-30 h-30 bg-(--pink) animate-moveCircleLtR"></span>
                {/*bottom left*/}
                <span className="home-circle mixed-blend-multiply -bottom-38 right-1 w-45 h-45 bg-(--purple) animate-moveCircleRtL"></span>
                {/*bottom right*/}
              </div>
            </div>

            <div className="w-full px-8 ">
              <div className="flex justify-between items-center ">
                <span className="mt-12 cursor-pointer font-semibold text-[12px]">
                  Recent Forms
                </span>

                <Select
                  className="mt-12 cursor-pointer font-semibold text-[12px]"
                  classNamePrefix="react-select"
                  options={options}
                  value={selectedOption}
                  onChange={handleChange}
                  isClearable // Allows clearing the selection
                  isSearchable // Enables search functionality
                  placeholder="Owned by Anyone"
                  inputValue={inputValue}
                  onInputChange={handleInputChange}
                />
              </div>
            </div>
            <div className=" justify-center flex flex-col gap-5 w-5/6 h-full pt-15 ">
              {/* Redirect to login page if dont have acc log */}
              <button className="text-left" onClick={() => setShowModal(true)}>
                <div className=" shadow-md justify-center  hover:bg-gray-200 group px-5 h-30 relative flex flex-col border-2 border-[var(--dirty-white)] duration-200 hover:border-purple-500 ">
                  <div className="absolute flex items-center justify-center top-0 right-0 w-9 h-9 bg-[var(--dirty-white)]">
                    <div className="relative w-full h-full font-bold cursor-pointer flex items-center justify-center overflow-hidden">
                      <FaArrowUp className="rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                      <FaArrowUp
                        className="absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:-translate-y-0 
                         transition-all duration-400 ease-out fill-orange-900"
                      />
                    </div>
                  </div>
                  <IoDocumentText className="text-white mb-2 text-[24px]" />
                  <span className="vagrounded font-semibold text-[18px] text-black mb-[2px]">
                    Create Forms
                  </span>
                  <span className="vagrounded font-normal text-[12px] text-black">
                    Start with a blank template and more
                  </span>
                </div>
              </button>
              {/* Contains of functionality of the system */}
              <Link to={`Workspaces`} className="contents">
                <div className="  justify-center  hover:bg-gray-200 group px-5 h-30 relative flex flex-col border-2 border-[var(--dirty-white)]  duration-200 hover:border-purple-500 ">
                  <div className="absolute flex items-center justify-center top-0 right-0 w-9 h-9 bg-[var(--dirty-white)]">
                    <button className="relative w-full h-full font-bold cursor-pointer flex items-center justify-center overflow-hidden">
                      <FaArrowUp className="rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                      <FaArrowUp
                        className="absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:-translate-y-0 
                         transition-all duration-400 ease-out fill-orange-800"
                      />
                    </button>
                  </div>

                  <IoFolderOpen className="text-white mb-2 text-[24px]" />
                  <span className="vagrounded font-semibold text-[18px] text-black mb-[2px]">
                    My Workspaces
                  </span>
                  <span className="vagrounded font-normal text-[12px] text-black">
                    Manage Forms and Responses
                  </span>
                </div>
              </Link>

              <div className=" cursor-pointer justify-center  hover:bg-gray-200 group px-5 h-30 relative flex flex-col border-2 border-[var(--dirty-white)]  duration-200 hover:border-purple-500 ">
                <div className="absolute flex items-center justify-center top-0 right-0 w-9 h-9 bg-[var(--dirty-white)]">
                  <button className="relative w-full h-full font-bold cursor-pointer flex items-center justify-center overflow-hidden">
                    <FaArrowUp className="rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                    <FaArrowUp
                      className="absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:-translate-y-0 
                         transition-all duration-400 ease-out fill-orange-800"
                    />
                  </button>
                </div>
                <FaThList className="text-white mb-2 text-[24px]" />

                <span className="vagrounded font-semibold text-[18px] text-black mb-[2px]">
                  Features
                </span>
                <span className="vagrounded font-normal text-[12px] text-black">
                  Explore Tools and Automation
                </span>
              </div>

              <div className="flex items-center text-center justify-center">
                <Link to={"faq"}>
                  <FAQ className="items-center !text-center" />
                </Link>
              </div>
            </div>
            <span className="mt-10 bottom font-zendots font-semibold text-[12px]">
              {" "}
              by C-men
            </span>
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

                  <div className="p-5 w-2/3 h-1/3 bg-(--white) ring ring-white rounded-lg fixed z-50">
                    <h1 className="font-vagrounded text-xs">
                      Start a new Form
                    </h1>
                    <div className="absolute text-xs top-0 right-0 w-15 h-15 flex items-center justify-center">
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
                            <IoDocumentText className="w-1/2 h-auto fill-gray-700" />
                            <span className="text-[9px] font-vagrounded font-bold">
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
                              <IoSparkles className="w-1/2 h-auto fill-gray-700" />
                              <span className="text-[9px] font-vagrounded font-bold">
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
                              className="w-11/12 h-full p-3 rounded-lg bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 text-[9px] resize-none shadow-inner"
                            />

                            <div className="flex gap-2 w-11/12">
                              <button
                                onClick={() => setShowAIInput(false)}
                                className="flex-1 py-1 rounded bg-gray-200 hover:bg-gray-300 text-[9px] text-gray-600 transition-colors"
                              >
                                Back
                              </button>
                              <button
                                onClick={MakeAIForm}
                                disabled={isLoading || !aiPrompt.trim()}
                                className="flex-1 py-1 rounded bg-(--purple) text-black text-[9px] disabled:opacity-50"
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
                          <IoGrid className="w-1/2 h-auto fill-gray-700" />
                          <span className="text-[9px] font-vagrounded font-bold">
                            Use a template
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </>
  );
}
export default Home;
