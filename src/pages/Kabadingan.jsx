import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../Context/authContext";
import { useMutation } from "@tanstack/react-query";

function Kabadingan() {
  // State to track the currently active item
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1301px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1300px)" });

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

  // Track the active index. Set to 1 by default to match your screenshot's open state.
  const [activeIndex, setActiveIndex] = useState(1);

  const toggleAccordion = (index) => {
    // If clicking the already open item, close it. Otherwise, open the clicked item.
    setActiveIndex(activeIndex === index ? null : index);
  };
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const createFormMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        toast.error("Please log in to create a form.");
        throw new Error("User not logged in");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Form/createform`,
        { userId: user.id, title: "Untitled" },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.surveyId) {
        navigate(`/newform/${data.surveyId}`);
      }
    },
    onError: (error) => {
      if (error.message === "User not logged in") {
        navigate("/login");
      } else {
        console.error(error);
        toast.error("Failed to create blank form.");
      }
    }
  });

  const MakeForm = () => {
    createFormMutation.mutate();
  };

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
                      className="w-full outline-none text-gray-600 placeholder-gray-400 text-lg"
                    />
                  </div>
                </div>

                {/* Accordion List */}
                <div className="border-t border-gray-300">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-300">
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex items-center py-4 text-left focus:outline-none hover:text-gray-600 transition-colors"
                      >
                        {/* Chevron Icon */}
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

                      {/* Expandable Content */}
                      {activeIndex === index && (
                        <div className="pb-5 pl-8 pr-4 text-[14px] leading-relaxed text-white whitespace-pre-line">
                          {/* Split by single newline instead of double */}
                          {item.content.split("\n").map((line, lIndex) => (
                            <p key={lIndex} className={lIndex > 0 ? "mt-1" : ""}>
                              {line}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
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
                    /* This path creates the "S" curve swoop from the image */
                    d="M65,2 C 70,10 110,40 10,50"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    /* The arrowhead pointing down-left toward the icon */
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
                    <button onClick={MakeForm} className="text-left text-[12px] font-semibold">
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
                      className="w-full outline-none text-gray-600 placeholder-gray-400 text-lg"
                    />
                  </div>
                </div>

                {/* Accordion List */}
                <div className="border-t border-gray-300">
                  {faqItems.map((item, index) => (
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
                  ))}
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
        </>
      }
    </>
  );
}
export default Kabadingan;
