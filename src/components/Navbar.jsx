import React from "react";

function NavBar() {
  return (
    <>
      <nav className="absolute w-full z-10">
        <div className="flex border-2 border-(--dirty-white) justify-between py-8 px-10 ">
          <h1 className="font-zendots text-3xl px-2">C-MEN</h1>
          <div className="font-vagrounded w-1/6 z-10  flex align-center justify-center">
            <button className="ring ring-white text-lg font-vagrounded font-bold w-full h-full rounded-3xl drop-shadow-md/20 bg-(--white) cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
export default NavBar;
