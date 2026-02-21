import React, {  useContext,useState } from "react";
import { IoChevronBack} from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../Context/authContext";




function Kabadingan() {
  // State to track the currently active item

  const navItems = [
    "Getting started with CMEN",
    "Our Survey is Built Different",
    "Best Practices",
  ];
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
  return (
    <>
   
      <div className="flex flex-col mt-[40px]  mx-[40px]">
        <Link to={"/"}>
         <button className="">
 <IoChevronBack size={36} color="white" className="mb-[40px]"/>
    </button>
    </Link>
    <div className="flex flex-col mx-[80px]">
        <div className="flex justify-between items-center ">
          <div className="flex flex-col  justify-center text-white">
            <span className="text-[40px] font-semibold">CMEN FAQ</span>
            <p className="text-[16px] max-w-[500px]  z-100">
              {" "}
              If you're new to C-MEN or looking for creating a surveys for just
              a minutes, this guide will help you learn more about the platform
              and its features.
            </p>
            <div className="flex  flex-col mt-[40px]  gap-2 justify-center">
              <span className="text-[12px]">Already have a CMEN account?</span>
              <button onClick={MakeForm} className="text-left text-[12px] font-semibold">
                Create forms Now
              </button>
            </div>
          </div>
          <span className="text-[150px] items-center"></span>
          <div className="flex flex-col"></div>
        </div>

   
        <div className="flex mt-[150px]">
          <nav className="relative pl-2">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300"></div>
            <ul>
              {navItems.map((item) => (
                <li key={item} className="mb-4">
                  <button
                    onClick={() => setActiveItem(item)}
                    // Apply conditional styling for the active state
                    className={`
                      text-left w-full py-1 px-4 duration-200  ease-in-out
                      ${
                        activeItem === item
                        ? "text-white font-semibold border-l-4 border-black" // Active state: Black text, bold, 4px left border
                      : "text-gray-500 hover:text-gray-700 hover:border-l-4 hover:border-gray-400 " // Inactive state: Gray text, hover effect
                    }
                    `}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div></div>
    </>
  );
}
export default Kabadingan;
