import React, { useContext, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router";
import { AuthContext } from "../Context/authContext";
import AccountModal from "./AccountModal";

function NavBar() {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 700px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 699px)" });
  const [showAccountModal, setShowAccountModal] = useState(false);

  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <>
      <AccountModal
        isOpen={showAccountModal}
        close={() => setShowAccountModal(false)}
        title="Account Information"
      ></AccountModal>
      {isDesktopOrLaptop && (
        <nav className="absolute w-full z-10">
          <div className="flex justify-between py-8 px-10 ">
            <Link to={`/`}>
              <h1 className="font-zendots text-white text-[24px] px-2">SnapQ</h1>
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
                <Link className="w-full h-full" to={`login`}>
                  <button
                    className="ring ring-white text-[14px] font-vagrounded font-bold w-full h-full rounded-3xl
             drop-shadow-md/20 text-white bg-black hover:bg-[#1E1E1E]  cursor-pointer"
                  >
                    Get Started
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}

      {isTabletOrMobile && (
        <nav className="absolute w-full z-50">
          <div className="flex justify-between py-8 px-10 ">
            <Link to={`/`}>
              <h1 className="font-zendots text-white text-[24px] px-2">SnapQ</h1>
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
