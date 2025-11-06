import { Link } from "react-router";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import FormElement from "../components/FormElement";
import { BiSolidUserRectangle } from "react-icons/bi";
import Canvas from "../components/Canvas";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function Form() {
  const [elements, setElements] = useState([]);
  const handleDrop = (item) => {
    const newElement = {
      id: Date.now() + Math.random(),
      title: item.title,
      Icon: item.Icon,
    };
    setElements((prev) => [...prev, newElement]);
  };
  const types = [
    { Icon: BiSolidUserRectangle, title: "Contact" },
    { Icon: BiSolidUserRectangle, title: "Multiple Choice" },
    { Icon: BiSolidUserRectangle, title: "Long Text" },
    { Icon: BiSolidUserRectangle, title: "Checkbox" },
    { Icon: BiSolidUserRectangle, title: "hahaha" },
    { Icon: BiSolidUserRectangle, title: "hahaha" },
    { Icon: BiSolidUserRectangle, title: "hahaha" },
    { Icon: BiSolidUserRectangle, title: "hahaha" },
    { Icon: BiSolidUserRectangle, title: "Conthahahahahact" },
  ];

  const [titleValue, setTitleValue] = useState("");
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const newWidth = spanRef.current.offsetWidth + 25;
      inputRef.current.style.width = `${newWidth}px`;
    }
  }, [titleValue]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="h-dvh w-full bg-(--white) overflow-hidden">
          <header className="flex items-center justify-between z-20 bg-(--white) pt-8 pb-8 px-10 pr-12">
            <div className="inline-flex items-center gap-7 z-20 bg-(--white)">
              <Link to={"/"}>
                <p className="cursor-pointer text-3xl">
                  <FaHome />
                </p>
              </Link>
              <div className="relative inline-flex items-center z-20 bg-(--white)">
                <span
                  ref={spanRef}
                  className="invisible absolute whitespace-pre font-medium px-2 text-xl"
                >
                  {titleValue || "Untitled Form"}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Untitled Form"
                  className="text-(--black) placeholder:text-gray-600 text-xl py-1 px-2 rounded-lg transition-all relative duration-200 focus:outline-none focus:ring ring-black"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  style={{ width: "180px" }}
                />
              </div>
            </div>
            <div className="inline-flex items-center gap-4">
              <button className=" px-10 py-1.5 rounded-xl bg-(--white) ring ring-(--purple) inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-violet-200 transition-color duration-400 ease-out">
                Share
              </button>
              <button>
                <FaUserCircle className="text-3xl" />
              </button>
            </div>
          </header>

          {/* form mismo */}
          <div className="h-full w-full bg-(--white) flex">
            {/* leftside */}
            <div className="w-2/7 p-5  z-10 bg-(--white)  border-t-2 border-[var(--dirty-white)]">
              {/* searchbox nga */}

              <div className="grid grid-cols-3 w-full gap-4 p-4 m-auto">
                {types.map((type, index) => (
                  <FormElement
                    key={index}
                    icon={type.Icon}
                    title={type.title}
                  />
                ))}
              </div>
            </div>

            {/* mid */}
            <Canvas elements={elements} onDropElement={handleDrop} />

            {/* right side */}
            <div className="h-full w-2/7 z-10 bg-(--white)  border-t-2 border-[var(--dirty-white)]"></div>
          </div>
        </div>
      </DndProvider>
    </>
  );
}
export default Form;
