import React, { useContext, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../Context/authContext";
import { BiSolidMessageSquareMinus } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IoDocumentText, IoGrid, IoSparkles } from "react-icons/io5";
function Kabadingan() {
  // State to track the currently active item
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1301px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1300px)" });


  const navItems = [
    "Getting started with CMEN",
    "Our Survey is Built Different",
    "Best Practices",
  ];

  const faqItems = [
    {
      title: "How do I create my first survey ?",

      content: "Details about who should use the product go here.\n" +
        "1. Log in to your Ispecmn account.\n" +
        "2. Click Create Forms.\n" +
        "3. Choose a template or start from scratch.\n" +
        "4. Add question and customize.\n" +
        "5. For more quicker way to create a forms based on your specific topic. Generate forms in seconds with our AI.  "
    },
    {
      title: "What are the key features of Ispecmn ?",
      content:
        "Drag and drop question, Ai survey creation, easy sharing option, real-time analytics"
    },
    {
      title: "Can I customize the AI form's design ?",
      content: "Yes, you can customize the content, pages and layers.",
    },
    {
      title: "How do i share my survey ?",
      content: "Share via link, email invitation or embed on your website",
    }
  ];
  const [showModal, setShowModal] = useState(false);

  const [activeIndex, setActiveIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState("")
  const filteredFaqItems = faqItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [showAIInput, setShowAIInput] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const toggleAccordion = (index) => {
    // If clicking the already open item, close it. Otherwise, open the clicked item.
    setActiveIndex(activeIndex === index ? null : index);
  };
  const [activeItem, setActiveItem] = useState(navItems[0]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
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

  const createFormMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Form/createform`,
        { userId: user.id, title: "Untitled" },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.surveyId) navigate(`/newform/${data.surveyId}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create form");
    }
  });


  const createAiFormMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Form/Ai`,
        { userId: user.id, title: "", promt: aiPrompt },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.surveyId) navigate(`/newform/${data.surveyId}`);
      setShowAIInput(false);
      setAiPrompt("");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to generate AI form");
    }
  });
  return (
    <>
      {isDesktopOrLaptop &&
        <div className="flex flex-col mt-[40px]  mx-[40px]">

          <div className="flex items-baseline text-white gap-10">

            <Link to={"/"}>
              <button className="flex">
                <IoChevronBack size={36} color="white" className="mb-[40px]" />
              </button>
            </Link>

            <span className="text-[48px] font-bold">Frequently Asked Questions</span>
          </div>

          <div className="flex flex-col mx-[80px] mt-10">

            <div className="flex ">
              <div className="flex flex-1 flex-col  text-white">

                <p className="text-[16px] max-w-[500px]  z-100">
                  {" "}
                  If you're new to <span className="font-zendots">Ispecmn</span> or looking for creating a surveys for just
                  a minutes, this guide will help you learn more about the platform
                  and its features.
                </p>
                <div className="flex  flex-col mt-[40px]  gap-2">
                  <span className="text-[12px]">Already have a CMEN account?</span>
                  <button onClick={MakeForm} className="text-left text-[12px] font-semibold">
                    Create forms Now
                  </button>
                </div>
              </div>

              <div className=" flex flex-col flex-1 font-sans text-gray-800">

                {/* Search Input Area */}
                <div className="mb-6 relative">
                  <div className="flex items-center pb-2 border-b border-dotted border-gray-400">
                    {/* Search Icon */}
                    <svg
                      className="w-5 h-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      className="w-full outline-none text-white placeholder-gray-400 text-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Accordion List */}
                <div className="border-t border-gray-300">

                  {/*. MAP OVER FILTERED LIST */}
                  {filteredFaqItems.length > 0 ? (
                    filteredFaqItems.map((item, index) => (
                      <div key={index} className="border-b border-gray-300">
                        <button
                          onClick={() => toggleAccordion(index)}
                          className="w-full flex items-center py-4 text-left focus:outline-none hover:text-gray-600 transition-colors"
                        >
                          <svg
                            className={`w-4 h-4 mr-4 text-gray-500 transition-transform duration-200 ${activeIndex === index ? "transform rotate-180" : ""
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                          <span className="text-white font-medium text-[15px]">{item.title}</span>
                        </button>

                        {activeIndex === index && (
                          <div className="pb-5 pl-8 pr-4 text-[14px] leading-relaxed text-white whitespace-pre-line">
                            {item.content.split("\n").map((line, lIndex) => (
                              <p key={lIndex} className={lIndex > 0 ? "mt-1" : ""}>
                                {line}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    /* Show a message when no results match the search */
                    <div className="py-4 text-gray-400">No matching FAQs found.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="absolute flex flex-col mt-50">
              <div className=" w-fit flex flex-col mb-4">
                <span className="text-[16px] text-gray-400">
                  Can't find what you are looking for?
                </span>
                <span className="text-white text-[28px] font-semibold">
                  We would like to chat with you.
                </span>
              </div>

              {/* Decorative Arrow Container */}
              <div className="ml-16 -mt-2 ">
                <svg
                  width="100"
                  height="70"
                  viewBox="0 0 100 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white opacity-90"
                >
                  <path
                    /* the "S" curve swoop from the image */
                    d="M65,2 C 70,10 110,40 10,50"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    /*  arrowhead pointing down-left toward the icon */
                    d="M10,50 L26,56 M10,50 L24,40"

                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Chat Button */}
              <a href="https://www.mcganir.pro/" target="_blank"
                rel="noopener noreferrer">
                <button className=" block -mt-15 w-fit group transition-transform hover:scale-105  duration-600">
                  <div className="bg-green-500 hover:bg-green-600  rounded-full p-4 flex items-center justify-center shadow-lg">
                    <BiSolidMessageSquareMinus color="white" size={32} />
                  </div>
                </button>
              </a>
            </div>
          </div>

        </div>
      }
      {isTabletOrMobile &&
        <>
          <div className="flex flex-col mt-[20px]  mx-[20px]">

            <div className="flex items-center gap-5 text-white ">

              <Link to={"/"}>
                <button className="flex">
                  <IoChevronBack size={32} color="white" className="mb-[40px]" />
                </button>
              </Link>

              <span className="text-[28px] font-bold">Frequently Asked Questions</span>
            </div>

            <div className="flex flex-col mx-[40px] mt-10">

              <div className="flex ">
                <div className="flex flex-1 flex-col  text-white">

                  <p className="text-[16px] max-w-[500px]  z-100">
                    {" "}
                    If you're new to <span className="font-zendots">Ispecmn</span> or looking for creating a surveys for just
                    a minutes, this guide will help you learn more about the platform
                    and its features.
                  </p>
                  <div className="flex  flex-col mt-[40px]  gap-2">
                    <span className="text-[12px]">Already have a CMEN account?</span>
                    <button onClick={() => setShowModal(true)} className="text-left text-[12px] font-semibold">
                      Create forms Now
                    </button>
                  </div>
                </div>


              </div>

              <div className=" flex flex-col flex-1 font-sans text-gray-800 mt-20">

                {/* Search Input Area */}
                <div className="mb-6 relative">
                  <div className="flex items-center pb-2 border-b border-dotted border-gray-400">
                    {/* Search Icon */}
                    <svg
                      className="w-5 h-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      className="w-full outline-none text-white placeholder-gray-400 text-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Accordion List */}
                <div className="border-t border-gray-300">
                  {filteredFaqItems.length > 0 ? (
                    filteredFaqItems.map((item, index) => (

                      <div key={index} className="border-b border-gray-300">
                        <button
                          onClick={() => toggleAccordion(index)}
                          className="w-full flex items-center py-4 text-left focus:outline-none hover:text-gray-600 transition-colors"
                        >
                          {/* Chevron Icon */}
                          <svg
                            className={`w-4 h-4 mr-4 text-gray-500 transition-transform duration-400 ${activeIndex === index ? "transform rotate-90" : ""
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                          <span className="text-white font-medium text-[15px]">{item.title}</span>
                        </button>

                        {/* Expandable Content */}
                        {activeIndex === index && (
                          <div className=" pb-5 pl-8 pr-4 text-[14px] leading-relaxed text-white whitespace-pre-line">
                            {/* Split by single newline instead of double */}
                            {item.content.split("\n").map((line, lIndex) => (
                              <p key={lIndex} className={lIndex > 0 ? "mt-1" : ""}>
                                {line}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    /* Show a message when no results match the search */
                    <div className="py-4 text-gray-400">No matching FAQs found.</div>
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col my-20">
                <div className=" w-fit flex flex-col mb-4">
                  <span className="text-[12px] text-gray-400">
                    Can't find what you are looking for?
                  </span>
                  <span className="text-white text-[16px] font-semibold">
                    We would like to chat with you.
                  </span>
                </div>

                {/* Decorative Arrow Container */}
                <div className="ml-16 -mt-2 ">
                  <svg
                    width="100"
                    height="70"
                    viewBox="0 0 100 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white opacity-90"
                  >
                    <path
                      /* aroowTbody */
                      d="M65,2 C 70,10 110,40 10,50"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      /* arrowhead  */
                      d="M10,50 L26,56 M10,50 L24,40"

                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <a href="https://www.mcganir.pro/" target="_blank" rel="noopenner noreferrer">
                  {/* Chat Button */}
                  <button className=" block -mt-15 w-fit group transition-transform hover:scale-105  duration-600">
                    <div className="bg-green-500 hover:bg-green-600  rounded-full p-4 flex items-center justify-center shadow-lg">
                      <BiSolidMessageSquareMinus color="white" size={32} />
                    </div>
                  </button>
                </a>
              </div>
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
                className="flex fixed inset-0 p-4 !z-[9999]  items-center justify-center backdrop-blur-xs"
              >

                <div className="w-full max-w-5xl relative py-10 px-8 bg-black outline-1 outline-white rounded-lg fixed z-50">

                  {/* Header */}
                  <div className="flex w-full items-center justify-between mb-4">
                    <h1 className="font-vagrounded text-white text-md ">
                      Start a new Form
                    </h1>

                    <button
                      onClick={() => setShowModal(false)}
                      className=" text-white cursor-pointer"
                    >
                      X
                    </button>

                  </div>


                  <div className=" flex items-stretch justify-center gap-2 w-full min-h-[100px]">

                    {/* create own forms */}

                    <div className="relative flex-1 font-vagrounded ">
                      {createFormMutation.isPending ? (
                        <span className="w-full h-full bg-white/20 shadow-md/20 flex justify-center items-center rounded-[6px]">
                          <FaSpinner className="text-5xl text-(--green) animate-spin" />
                        </span>
                      ) : (
                        <button
                          onClick={() => createFormMutation.mutate()}
                          className="relative flex items-center gap-5 justify-center w-full h-full p-6 border-2 border-white rounded-[6px] shadow-md/20 hover:scale-101 flex-col duration-400 ease"
                        >
                          <IoDocumentText size={24} fill="white" />
                          <div className="h-10 flex items-start justify-center">
                            <span className="text-white text-[12px] font-vagrounded font-bold">
                              Blank form
                            </span>
                          </div>
                        </button>
                      )}
                    </div>
                    {/* generate with ai */}
                    <div className=" relative flex-1 font-vagrounded">
                      {!showAIInput ? (
                        <div
                          className="flex flex-col gap-3 items-center w-full h-full cursor-pointer"
                          onClick={() => setShowAIInput(true)}
                        >
                          <button className="relative flex p-6 items-center gap-5 justify-center w-full h-full border-2 border-white rounded-[6px] shadow-md/20 hover:scale-101 flex-col duration-400 ease">
                            <IoSparkles size={24} fill="white" />
                            <div className="h-10 flex items-start justify-center">
                              <span className="text-xs text-white font-vagrounded font-bold">
                                Generate with AI
                              </span>
                            </div>
                          </button>
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
                              onClick={createAiFormMutation}
                              disabled={isLoading || !aiPrompt.trim()}
                              className="flex-1 py-1 rounded bg-(--purple) text-black text-[9px] disabled:opacity-50"
                            >
                              {isLoading ? "..." : "Generate"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className=" relative flex-1 font-vagrounded">
                      <button className="relative p-4 flex  items-center gap-5 justify-center w-full h-full border-2 border-white rounded-[6px] shadow-md/20 hover:scale-101 flex-col duration-400 ease">
                        <IoGrid size={24} fill="white" />

                        <div className="h-10 flex items-start justify-center">
                          <span className="text-white text-xs font-vagrounded font-bold">
                            Use a template
                          </span></div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      }
    </>
  );
}
export default Kabadingan;
