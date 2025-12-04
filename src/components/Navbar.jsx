import React from "react";
import { useMediaQuery } from 'react-responsive';



function NavBar() {

  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 700px)' });
      const isTabletOrMobile = useMediaQuery({ query: '(max-width: 699px)' });
  
  return (
    <>
    {isDesktopOrLaptop &&
      <nav className="absolute w-full z-10">
        <div className="flex border-2 border-(--dirty-white) justify-between py-8 px-10 ">
          <h1 className="font-zendots text-[24px] px-2">C-MEN</h1>
          <div className="font-vagrounded w-1/6 z-10  flex align-center justify-center">
            <button className="ring ring-white text-[14px] font-vagrounded font-bold w-full h-full rounded-3xl
             drop-shadow-md/20 bg-(--white) cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </nav>
      }


      {isTabletOrMobile && 
        <nav className="absolute w-full z-10">
        <div className="flex border-2 border-(--dirty-white) justify-between py-8 px-5 items-center  ">
          <h1 className="font-zendots text-[14px] px-2">C-MEN</h1>
          <div className="font-vagrounded w-1/2  z-10  flex text-center items-center whitespace-nowrap justify-center">
            <button className=" py-[2px] ring ring-white text-[14px] font-vagrounded font-bold w-full h-full rounded-[6px]
             drop-shadow-md/20 bg-(--white) cursor-pointer ">
              
              Get Started
            </button>
          </div>
        </div>
      </nav>
      }
    </>
  );
}
export default NavBar;
