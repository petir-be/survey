import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { FaHome, FaUserCircle } from "react-icons/fa";

function Preview() {

    const [Pages, setPages] = useState();
    const [error, setError] = useState(null);
    const { id } = useParams();

  const [titleValue, setTitleValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const spanRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current && containerRef.current) {
      const maxWidth = containerRef.current.offsetWidth;
      const newWidth = Math.min(spanRef.current.offsetWidth + 25, maxWidth);
      inputRef.current.style.width = `${newWidth}px`;
    }
  }, [titleValue]);

  useEffect(() => {
    async function fetchFormData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/Form/${id}`
        );
        setPages(
          Array.isArray(res.data.formData)
            ? res.data.formData
            : [{ id: 1, questions: [] }]
        );

        setTitleValue(res.data.title);
        console.log(res.data.formData);
      } catch (err) {
        console.log(err);

        if (err.response) {
          if (err.response.status === 404) {
            setError("Form not found");
          } else if (err.response.status === 403) {
            setError("Access forbidden. You do not have permission.");
          } else {
            setError("An unexpected error occurred.");
          }
        } else {
          setError("Network error or server is unreachable.");
        }
      }
    }
    if (id) {
      fetchFormData();
    }
  }, [id]);

  return (
    <div className="h-dvh w-full bg-(--white) flex flex-col overflow-hidden">
      <header className="flex items-center justify-between bg-(--white) pt-8 pb-8 px-10 pr-12 relative z-50 border-b-2 border-(--dirty-white)">
        <div className="inline-flex items-center gap-7 bg-(--white) flex-1 min-w-0">
          <Link to={"/"}>
            <p className="cursor-pointer text-3xl flex-shrink-0">
              <FaHome />
            </p>
          </Link>
          <div
            ref={containerRef}
            className="relative inline-flex items-center z-50 bg-(--white) max-w-1/3 flex-1 min-w-0"
          >
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
              className={`text-(--black) placeholder:text-gray-600 text-xl py-1 px-2 rounded-lg transition-all relative duration-200 focus:outline-none focus:ring ring-black ${
                !isFocused && titleValue ? "truncate" : ""
              }`}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{ width: "180px" }}
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-4 flex-shrink-0">
          <select
            name=""
            id=""
            className="w-30 px-2 py-1.5  rounded-xl bg-(--white) ring ring-(--purple) inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-violet-200 transition-color duration-200 ease-out"
          >
            <option value="">aa</option>
            <option value="">aa</option>
            <option value="">aa</option>
          </select>
          <button className="px-10 py-1.5 rounded-xl bg-(--white) ring ring-(--purple) inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-violet-200 transition-color duration-200 ease-out">
            Exit Preview
          </button>
        </div>
      </header>
    </div>
  );
}

export default Preview;
