import React, { useContext, useState, useEffect } from "react";
import "../global.css";
import { FaArrowUp, FaSpinner, } from "react-icons/fa6";

import Navbar from "../components/Navbar.jsx";
import toast, { Toaster } from "react-hot-toast";

import FAQ from "../components/FAQ";
import { motion, AnimatePresence } from "framer-motion";

import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../Context/authContext";

import { IoDocumentText, IoSparkles, IoGrid, IoFolderOpen } from "react-icons/io5";
import Footer from "../components/Footer";


function Home() {




  const [fadeState, setFadeState] = useState("fade-in");
  const [fadeText, setFadeText] = useState('');


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
      setInputValue('');
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
const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  // -------------------------

  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const textOptions = [
      'A questionnaire about quantum physics.',
      'A survey using only 5-point Likert scales.',
      'A questionnaire regarding behavioral psychology.',
      'A thesis survey about renewable energy adoption.',
    ];

   {/* let index = 0;
    setFadeText(textOptions[index]);

    const interval = setInterval(() => {
      setFadeState("fade-out");
      setTimeout(() => {
        index = (index + 1) % textOptions.length;
        setFadeText(textOptions[index]);
        setFadeState("fade-in");
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
   */}
   const i = loopNum % textOptions.length;
    const fullText = textOptions[i];

    const handleType = () => {
      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      // Default speed (typing)
      let speed = 50;

      if (isDeleting) {
        speed = 20; // Deleting is faster
      }

      if (!isDeleting && text === fullText) {
        // Finished typing the sentence, pause before deleting
        speed = 2000;
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        // Finished deleting, move to next sentence
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        speed = 500;
      }

      setTypingSpeed(speed);
    };

    const timer = setTimeout(handleType, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);


  return (
    <>
      <Toaster position="top-right" />

      {isDesktopOrLaptop && (


        <><Navbar />
          {/* para matanggal lang error */}
          {motion}

          <div className="flex flex-col items-center justify-center min-h-screen  z-10">

            <div className=" justify-center items-center ">
              {/*    <div className="relative flex  px-10  justify-between items-center  ">
                <span className="text-white font-semibold text-[16px]">Recent Forms</span>

                <Select
                  className=" text-white cursor-pointer font-semibold text-[16px]"
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
              </div> */}
             
              <div className="m-12 flex items-center justify-center flex-col">
                <span className="text-[42px] text-white font-vagrounded font-semibold">
                  Build Your Form Instantly!
                </span>

                <span className="text-white font-regular italic">
                  Drag, Drop and Build Forms in Seconds.
                </span>

              </div>

              <div className='flex relative w-full items-center justify-center'>
                <div className='absolute left-6 '>
                  <IoSparkles size={14} color='#707070' />

                </div>
             {/*   {!searchQuery &&
                  <div
                    className={`absolute left-10 top-1/2 transform -translate-y-1/2 
                        text-white/50 pointer-events-none z-10 transition-opacity duration-500 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}
                    style={{ whiteSpace: "nowrap" }}
                    dangerouslySetInnerHTML={{ __html: fadeText }}
                  />}
             */
             }
         {!searchQuery && (
                  <div className="absolute left-12 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none z-10 flex items-center">
                    <span style={{ whiteSpace: "nowrap" }}>{text}</span>
                    <span className="ml-1 w-[2px] h-[14px] bg-white/50 animate-pulse"></span>
                  </div>
                )}
                <input
                  type="text"
                  placeholder=""
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={` w-[600px] text-white text-[12px]  py-4 pr-26 pl-10 bg-black outline rounded-xl 
          hover:bg-[#1E1E1E] transition-all ${isFocused ? 'outline-[2px] outline-green-700 bg-[#1E1E1E]' : 'outline-[#707070] '}`}
                />
                <div className='absolute right-4 '>
                  <button className="text-white text-[14px] outline-1 hover:bg-[#1E1E1E] py-2 px-4 rounded-[8px] cursor-pointer">Generate</button>

                </div>
             
</div>

              { /*  <div className="w-3/7 relative h-dvh overflow-hidden pt-15  z-10">*/}
              { /* <div className="absolute z-1 w-full h-full flex justify-center items-center">
                <ThreeDModel
                  url="/models/free__rubiks_cube_3d.glb"
                  scale={0.2} // <<< CHANGE SIZE HERE
                />
              </div> */}
              { /* <div className="absolute top-0 left-0 h-full w-full">/}
              { /*   <DotShader className="z-0" />*/}
              { /*   <span className="home-circle mixed-blend-multiply -top-40 left-1 w-45 h-45 bg-(--purple) animate-moveCircleLtR"></span>/}
                {/*top left*/}
              { /*   <span className="home-circle mixed-blend-multiply -top-38 right-1 w-30 h-30 bg-(--pink) animate-moveCircleRtL"></span>
                {/*top right*/}
              { /*   <span className="home-circle mixed-blend-multiply -bottom-32 left-1 w-30 h-30 bg-(--pink) animate-moveCircleLtR"></span>
                {/*bottom left*/}
              { /*  <span className="home-circle mixed-blend-multiply -bottom-38 right-1 w-45 h-45 bg-(--purple) animate-moveCircleRtL"></span>
                {/*bottom right*/}
              { /*  </div> /}
           { /*  </div>*/}

              {/* CREATE FORMS. MY WORKSPACES. FEATURES */}


            </div>
            <div className=" fixed bottom-0 right-0 p-10 ">
              <Link to={"faq"}>
                <FAQ className="items-center !text-center" />
              </Link>
            </div>
            <Footer />


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

          <div className="fixed inset-0 flex flex-col items-center pt-15 px-4 overflow-hidden z-10">
            <div className="m-12 flex  text-center items-center justify-center flex-col">
                    <div className=" flex  items-center  gap-15 mb-10 ">
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
              <span className="text-[42px] text-white font-vagrounded font-semibold">
                Build Your Form Instantly!
              </span>

              <span className="text-white font-regular italic">
                Drag, Drop and Build Forms in Seconds.
              </span>


            </div>

 <div className='flex relative w-full items-center'>
                <div className='absolute left-4 '>
                  <IoSparkles size={14} color='#707070' />

                </div>
             {/*   {!searchQuery &&
                  <div
                    className={`absolute left-10 top-1/2 transform -translate-y-1/2 
                        text-white/50 pointer-events-none z-10 transition-opacity duration-500 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}
                    style={{ whiteSpace: "nowrap" }}
                    dangerouslySetInnerHTML={{ __html: fadeText }}
                  />}
             */
             }
         {!searchQuery && (
                  <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none z-10 flex items-center">
                    <span style={{ whiteSpace: "nowrap", fontSize:'10px'} }>{text}</span>
                    <span className="ml-1 w-[2px] h-[14px] bg-white/50 animate-pulse"></span>
                  </div>
                )}
              <input
  type="text"
  placeholder=""
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  // Changed w-[500px] to w-full max-w-[500px]
  className={`w-full max-w-[500px] text-white text-[12px] py-4 pr-24 pl-10 bg-black outline rounded-xl 
  hover:bg-[#1E1E1E] transition-all ${isFocused ? 'outline-[2px] outline-green-700 bg-[#1E1E1E]' : 'outline-[#707070]'}`}
/>
                <div className='absolute right-2 '> 
                  <button value={aiPrompt}
       onChange={(e) => setAiPrompt(e.target.value)} className="text-white text-[14px] outline-1 hover:bg-[#1E1E1E] py-2 px-4 rounded-[12px] cursor-pointer">
                    Generate</button>

                </div>
              </div>

            <div className=" justify-center flex flex-col gap-5   ">
              {/* Redirect to login page if dont have acc log */}
              <div className="flex fixed pb-6  bottom-0 right-8">
                <Link to={"faq"}>
                  <FAQ />
                </Link>
              </div>
            </div>

            <div className="absolute bottom-20 w-full">
              <Footer />
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
