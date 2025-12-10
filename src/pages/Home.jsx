import React, { useContext, useState } from "react";
import "../global.css";
import DotShader from "../components/DotShader";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// You also need to import the specific icon object from the icons package
import { faWpforms } from "@fortawesome/free-brands-svg-icons";
import { GiArtificialIntelligence } from "react-icons/gi";import { HiTemplate } from "react-icons/hi";
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
            <div className="w-3/7 relative h-dvh overflow-hidden pt-15 border-2  bg-(--white) z-10">
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
  
                  <div className=" max-w-5xl justify-center items-center p-5 bg-(--white) ring ring-white rounded-lg fixed z-50">
                    
                    <div className="py-5 h-full w-full items-center">
                 
                   <div className="px-5 flex items-center justify-between ">
                   <h1 className="font-vagrounded text-[20px]">
                      Start a new form
                    </h1>
             
                      <button
                        onClick={() => setShowModal(false)}
                        className=" text-[32px] cursor-pointer"
                      >
                        &times;
                      </button>
                    
                    </div>



                    <div className="px-[20px] gap-10 py-5 text-center px-[2px] gap-2 flex items-center justify-between w-full h-full">
                      {/* create own forms */}
                      <div className="cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 ease-in-out
                      border border-1 border-gray-300 items-center justify-center  text-[16px]  
                      flex flex-col gap-3 items-center w-full h-full font-vagrounded ">
                      
                
 
                       <div className="px-[50px] py-[35px]">
<FontAwesomeIcon
  icon={faWpforms}
  className="text-[96px] text-white mb-2" />
                     
                     

                         
                 
                        Create own form
                      </div>
</div>
                      {/* generate with ai */}
                       <div className="cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 ease-in-out
                      border border-1 border-gray-300 items-center justify-center  text-[16px]  
                      flex flex-col gap-3 items-center w-full h-full font-vagrounded ">
                       
                       <div className="px-[50px] py-[35px]">
                       <GiArtificialIntelligence  className="text-[96px] text-white mb-2"/>
                        Generate with AI
                      </div>
</div>
                      {/* Use a template */}
                    <div className="cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 ease-in-out
                      border border-1 border-gray-300 items-center justify-center  text-[16px]  
                      flex flex-col gap-3 items-center w-full h-full font-vagrounded ">
                       
                       <div className="px-[50px] py-[35px]">
                        <HiTemplate className="text-[96px] text-white mb-2"/>
                        Use a template</div>
                      </div>
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
                    <div className="py-5 text-center px-[2px] gap-2 flex items-center justify-between w-full h-full">
                      {/* create own forms */}
                      <div className="hover:shadow-sm border border-1 border-gray-300 items-center justify-center  text-[8px]  flex flex-col gap-3 items-center w-full h-full font-vagrounded ">
                      
                

<FontAwesomeIcon
  icon={faWpforms}
  className="text-[48px] text-white" />
                     
                     

                         
                 
                        Create own form
                      </div>

                      {/* generate with ai */}
                      <div className="border border-1 border-gray-300 items-center justify-center text-[8px] flex flex-col gap-3 items-center w-full h-full font-vagrounded">
                       <GiArtificialIntelligence  className="text-[48px] text-white"/>
                        Generate with AI
                      </div>

                      {/* Use a template */}
                      <div className="  border border-1 border-gray-300 items-center justify-center text-[8px] flex flex-col gap-3 items-center w-full h-full font-vagrounded">
                        
                        <HiTemplate className="text-[48px] text-white"/>
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
