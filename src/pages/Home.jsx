import React, { useContext, useState } from "react";
import "../global.css";
import DotShader from "../components/DotShader";
import home1 from "/src/assets/2.svg";
import HomeBox from "../components/HomeBox";
import { FaSpinner } from "react-icons/fa";
import aboutus from "../assets/hugeicons_ai-dna.svg";
import FAQ from "../components/FAQ";
import { motion, AnimatePresence } from "framer-motion";
import ThreeDModel from "../components/ThreeDmodel";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
import Select from 'react-select';
function Home() {
  const [showModal, setShowModal] = useState(false);

    

  // 2. Define the options data
  const options = [
    { value: 'Owned by Anyone', label: 'Owned by Anyone' },
    { value: 'Owned by Me', label: 'Owned by Me' },
    { value: 'Owned by Others', label: 'Owned by Others' }
  ];
const [selectedOption, setSelectedOption] = useState(options[0]);
  const handleChange = (selectedOptionValue) => {
    setSelectedOption(selectedOptionValue);
      setInputValue(''); 
  };
 const [inputValue, setInputValue] = useState('');
  const MAX_LENGTH = 16;
 const handleInputChange = (newValue, actionMeta) => {
    // Only apply the limit when the user is typing/entering text
    if (actionMeta.action === 'input-change') {
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
        }
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
        }
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
      {isDesktopOrLaptop && (
        <>
          {/* para matanggal lang error */}
          {motion}

          <div className="flex items-center justify-center flex-1 min-h-full bg-[var(--white)] z-10">
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
             
              <div className="flex justify-between items-center ">
              <span
                className="m-12  font-semibold text-[16px]"
                
              >
                Recent Forms
              </span>

              <Select
                  className="mr-12 cursor-pointer font-semibold text-[16px]"
                    classNamePrefix="react-select"
      options={options}
      value={selectedOption}
      onChange={handleChange}
      isClearable // Allows clearing the selection
      isSearchable // Enables search functionality
      placeholder='Owned by Anyone'
   inputValue={inputValue}
      onInputChange={handleInputChange}
    />
              </div>
            </div>
            <div className="w-3/7 relative h-dvh overflow-hidden pt-15 border-2 border-[var(--dirty-white)] bg-[var(--white)] z-10">
              <div className="absolute z-1 w-full h-full flex justify-center items-center">
                <ThreeDModel
                  url="/models/free__rubiks_cube_3d.glb"
                  scale={0.2} // <<< CHANGE SIZE HERE
                />
              </div>
              <div className="absolute top-0 left-0 h-full w-full">
                <DotShader className="z-0" />
                <span className="home-circle mixed-blend-multiply -top-40 left-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleLtR"></span>
                {/*top left*/}
                <span className="home-circle mixed-blend-multiply -top-38 right-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleRtL"></span>
                {/*top right*/}
                <span className="home-circle mixed-blend-multiply -bottom-32 left-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleLtR"></span>
                {/*bottom left*/}
                <span className="home-circle mixed-blend-multiply -bottom-38 right-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleRtL"></span>
                {/*bottom right*/}
              </div>
            </div>
            <div className=" justify-center flex flex-col gap-5 w-2/7 h-dvh pt-25 px-10">
              {/* Redirect to login page if dont have acc log */}
              <button className="text-left" onClick={() => setShowModal(true)}>
                <HomeBox title="Create Forms" icon={aboutus} />
              </button>
              {/* Contains of functionality of the system */}
              <Link to={`Workspaces`} className="contents">
                <HomeBox title="My Workspaces" icon={aboutus} />
              </Link>

              {/* Higlights the website and devs*/}
              <HomeBox title="Features" icon={aboutus} />

              <div className="flex justify-center">
                <FAQ />
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
                      <div
                        className="flex flex-col gap-3 items-center w-full h-full font-vagrounded "
                        onClick={MakeForm}
                      >
                        {isLoading ? (
                          <span className="relative w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease flex justify-center items-center ">
                            {/* button ng form */}
                            <button
                              className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"
                              onClick={MakeForm}
                            ></button>

                            <FaSpinner className="text-5xl text-(--purple) animate-spin" />

                            <span className="absolute -bottom-4 right-12 shadow-[2px_0_5px_rgba(0,0,0,0.2)] z-1 w-2 h-34 rotate-45  "></span>
                            <div
                              className="absolute bottom-0 z-2 right-0 w-25 h-25 bg-linear-150 from-[#F9F9F9] to-[#CCCDD9]"
                              style={{
                                clipPath: "polygon(0 0, 100% 0, 0 100%)",
                                filter:
                                  "drop-shadow(2px 2px 4px rgba(0, 0, 0, 1))",
                              }}
                            />
                            <div
                              className="font-vagrounded font-normal absolute z-0 -bottom-2 -right-2 w-28 h-29"
                              style={{
                                clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                                background: "#DFE0F0",
                              }}
                            />
                          </span>
                        ) : (
                          <span className="relative w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease">
                            {/* button ng form */}
                            <button
                              className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"
                              onClick={MakeForm}
                            ></button>

                            {/* circle and rectangle */}
                            <span className="inset-shadow-sm/40 w-5 h-5 absolute top-8 left-10 rounded-full"></span>
                            <span className="inset-shadow-sm/40 w-5 h-5 absolute top-15 left-10 rounded-full"></span>
                            <span className="w-5 h-5 inset-shadow-sm/40 absolute top-22 left-10 rounded-full"></span>

                            <span className="w-7/12 h-3 inset-shadow-sm/40 absolute top-9 left-17"></span>
                            <span className="w-4/12 h-3 inset-shadow-sm/40 absolute top-16 left-17"></span>
                            <span className="w-2/12 h-3 inset-shadow-sm/40 absolute top-23 left-17"></span>

                            {/* plus circle */}
                            <span className="w-15 h-15 rounded-full inset-shadow-sm/40 absolute top-50 left-15 flex justify-center items-center">
                              <span className="flex justify-center items-center w-11 h-11 rounded-full shadow-sm/40">
                                <span className="w-8 h-2 inset-shadow-sm/40 rounded-lg flex justify-center items-center">
                                  {/* ayaw maalis pota */}
                                  <span className="mix-blend-lighten w-2 h-2 bg-white/30"></span>
                                </span>
                                <span className="fixed w-2 h-8 inset-shadow-sm/40 rounded-lg flex justify-center items-center">
                                  <span className="mix-blend-lighten w-2 h-2 bg-white/30"></span>
                                </span>
                              </span>
                            </span>

                            <span className="absolute -bottom-4 right-12 shadow-[2px_0_5px_rgba(0,0,0,0.2)] z-1 w-2 h-34 rotate-45  "></span>
                            <div
                              className="absolute bottom-0 z-2 right-0 w-25 h-25 bg-linear-150 from-[#F9F9F9] to-[#CCCDD9]"
                              style={{
                                clipPath: "polygon(0 0, 100% 0, 0 100%)",
                                filter:
                                  "drop-shadow(2px 2px 4px rgba(0, 0, 0, 1))",
                              }}
                            />
                            <div
                              className="font-vagrounded font-normal absolute z-0 -bottom-2 -right-2 w-28 h-29"
                              style={{
                                clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                                background: "#DFE0F0",
                              }}
                            />
                          </span>
                        )}
                        Create you own forms
                      </div>

                      {/* generate with ai */}
                      <div className="flex flex-col gap-3 items-center w-full h-full font-vagrounded relative">
                        {!showAIInput ? (
                          <div
                            className="flex flex-col gap-3 items-center w-full h-full cursor-pointer"
                            onClick={() => setShowAIInput(true)}
                          >
                            <span className="relative w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease flex justify-center items-center">
                              <span className="text-4xl"></span>
                            </span>
                            Generate with AI
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 items-center justify-center w-full h-full animate-in fade-in zoom-in duration-200">
                            <textarea
                              autoFocus
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              placeholder="Describe what you want to make ...."
                              className="w-11/12 h-3/5 p-3 rounded-lg bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm resize-none shadow-inner"
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
                                className="flex-1 py-1 rounded bg-[var(--purple)] text-black text-md disabled:opacity-50"
                              >
                                {isLoading ? "..." : "Generate"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Use a template */}
                      <div className="flex flex-col gap-3 items-center w-full h-full font-vagrounded">
                        <span className="relative flex  items-center justify-center w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease">
                          {/* button ng form */}
                          <button className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"></button>

                          <div className=" gap-3 h-1/2 w-1/2 flex flex-col">
                            <span className="w-full h-[60%] inset-shadow-sm/40 rounded-xl"></span>
                            <div className="flex flex-row w-full h-full gap-3 justify-between">
                              <span className="h-full w-1/2 rounded-xl inset-shadow-sm/30"></span>
                              <div className="flex flex-col w-1/2 h-full items-center justify-between ">
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                              </div>
                            </div>
                          </div>
                        </span>
                        Use a template
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
      {isTabletOrMobile && (
        <>
          {/* para matanggal lang error */}
          {motion}

          <div className="flex flex-col items-center justify-center flex-1 min-h-full bg-[var(--white)] z-10">
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
            

            <div className="w-7/7 relative h-[360px] overflow-hidden pt-15 border-2 border-[var(--dirty-white)] bg-[var(--white)] z-10">
              <div className="absolute z-1 w-full h-full flex justify-center items-center">
                <ThreeDModel
                  url="/models/free__rubiks_cube_3d.glb"
                  scale={0.2} // <<< CHANGE SIZE HERE
                />
              </div>

              
              <div className="absolute top-0 left-0 h-full w-full">
                <DotShader className="z-0" />
                <span className="home-circle mixed-blend-multiply -top-40 left-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleLtR"></span>
                {/*top left*/}
                <span className="home-circle mixed-blend-multiply -top-38 right-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleRtL"></span>
                {/*top right*/}
                <span className="home-circle mixed-blend-multiply -bottom-32 left-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleLtR"></span>
                {/*bottom left*/}
                <span className="home-circle mixed-blend-multiply -bottom-38 right-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleRtL"></span>
                {/*bottom right*/}
              </div>
            </div>

<div className="w-full px-8 ">
             <div className="flex justify-between items-center ">
              <span
                className="mt-12 cursor-pointer font-semibold text-[12px]"
          
              >
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
      placeholder='Owned by Anyone'
   inputValue={inputValue}
      onInputChange={handleInputChange}
    />
              </div>
            </div>
            <div className=" justify-center flex flex-col gap-5 w-5/6 h-full pt-15 ">
              {/* Redirect to login page if dont have acc log */}
              <button className="text-left" onClick={() => setShowModal(true)}>
                <HomeBox title="Create Forms" icon={aboutus} />
              </button>

              {/* Contains of functionality of the system */}
              <HomeBox title="My Workspaces" icon={aboutus} />

              {/* Higlights the website and devs*/}
              <HomeBox title="Features" icon={aboutus} />

              <div className="flex justify-center">
                <FAQ />
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

                  <div className="items-center p-5 w-2/3 h-1/3 bg-(--white) ring ring-white rounded-lg fixed z-50">
                    <h1 className="font-vagrounded text-[12px]">
                      Start a new Form
                    </h1>
                    <div className="items-center text-[12px] absolute top-0 right-0 w-15 h-15 flex items-center justify-center">
                      <button
                        onClick={() => setShowModal(false)}
                        className="w-full h-full cursor-pointer"
                      >
                        X
                      </button>
                    </div>
                    <div className=" text-center px-[2px] gap-2 flex items-center justify-between w-full h-full">
                      {/* create own forms */}
                      <div className="items-center justify-center  text-[8px]  flex flex-col gap-3 items-center w-full h-full font-vagrounded ">
                        <span className="relative w-full h-[80px] bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease">
                          {/* button ng form */}
                          <button className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"></button>

                          {/* circle and rectangle */}
                          <span className="inset-shadow-sm/40 w-1 h-1 absolute top-3 left-2 rounded-full"></span>
                          <span className="inset-shadow-sm/40 w-1 h-1 absolute top-6 left-2 rounded-full"></span>
                          <span className="inset-shadow-sm/40 w-1 h-1 absolute top-9 left-2 rounded-full"></span>

                          <span className="w-7/12 h-1 inset-shadow-sm/40 absolute top-3 left-4"></span>
                          <span className="w-4/12 h-1 inset-shadow-sm/40 absolute top-6 left-4"></span>
                          <span className="w-2/12 h-1 inset-shadow-sm/40 absolute top-9 left-4"></span>

                            {/* plus circle */}

                         {/* outer circle */}
                          <span className="w-4 h-4 rounded-full inset-shadow-sm/40 absolute top-14 left-4 flex justify-center items-center">
                                   
                                   {/* inner circle */}
                            <span className="w-3 h-3 flex justify-center items-center  rounded-full shadow-sm/40">
                             
                             
                              {/* horizontal cross */}
                              <span className="w-3 h-1 inset-shadow-sm/40 rounded-lg flex justify-center items-center">
                              
                                {/* ayaw maalis pota */}
                                <span className="mix-blend-lighten w-1 h-1 bg-white/30"></span>
                              </span>
                               {/* vertical cross */}
                              <span className="fixed w-1 h-3 inset-shadow-sm/40 rounded-lg flex justify-center items-center">
                                <span className="mix-blend-lighten w-2 h-2 bg-white/30"></span>
                              </span>
                            </span>
                          </span>

                          <span className="w-1 h-6 absolute -bottom-1 right-3 shadow-[2px_0_5px_rgba(0,0,0,0.2)] z-1  rotate-45  "></span>
                          <div
                            className="absolute bottom-0 z-2 right-0 w-5 h-5 bg-linear-150 from-[#F9F9F9] to-[#CCCDD9]"
                            style={{
                              clipPath: "polygon(0 0, 100% 0, 0 100%)",
                              filter:
                                "drop-shadow(2px 2px 4px rgba(0, 0, 0, 1))",
                            }}
                          />
                          <div
                            className="font-vagrounded font-normal absolute z-0 -bottom-1 -right-1 w-6 h-6"
                            style={{
                              clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                              background: "#DFE0F0",
                              // background:'#000000'
                            }}
                          />
                        </span>
                        Create own form
                      </div>

                      {/* generate with ai */}
                      <div className="items-center justify-center text-[8px] flex flex-col gap-3 items-center w-full h-full font-vagrounded">
                        <span className=" relative w-full h-[80px] bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease"></span>
                        Generate with AI
                      </div>

                      {/* Use a template */}
                      <div className="items-center justify-center text-[8px] flex flex-col gap-3 items-center w-full h-full font-vagrounded">
                        <span className="relative flex  items-center justify-center w-12/12 h-6/12 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease">
                          {/* button ng form */}
                          <button className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"></button>

                          <div className=" gap-3 h-1/2 w-1/2 flex flex-col">
                            <span className="w-full h-[60%] inset-shadow-sm/40 rounded-xl"></span>
                            <div className="flex flex-row w-full h-full gap-3 justify-between">
                              <span className="h-full w-1/2 rounded-xl inset-shadow-sm/30"></span>
                              <div className="flex flex-col w-1/2 h-full items-center justify-between ">
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                              </div>
                            </div>
                          </div>
                        </span>
                        Use a template
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
