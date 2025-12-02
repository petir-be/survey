import React from "react";  
import { Link } from "react-router";
import { FaHouse } from "react-icons/fa6";

function ResponsesNavbar({formName, id}) {
  return (
    <>
      <nav className="absolute w-full z-10">
        <div className="flex border-2 border-(--dirty-white) justify-between py-8 px-10 ">
          <Link to={`/newform/${id}`}>
            <h2 className="font-zendots text-[24px] px-2 flex items-center justify-center gap-12">
                <FaHouse />
                {formName}
            </h2>
          </Link>
        </div>
      </nav>
    </>
  );
}
export default ResponsesNavbar;
