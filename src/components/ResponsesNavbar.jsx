import React from "react";
import { Link } from "react-router";
import { FaBarsProgress, FaHouse } from "react-icons/fa6";
import { FaList } from "react-icons/fa";

function ResponsesNavbar({ formName, id }) {
  return (
    <>
      <nav className="absolute w-full z-10">
        <div className="flex border-2 border-(--dirty-white) justify-between py-8 px-10 ">
          <Link to={`/newform/${id}`}>
            <h2 className="font-vagrounded text-[24px] px-2 flex items-center justify-center gap-12">
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
