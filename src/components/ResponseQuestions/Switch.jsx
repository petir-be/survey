import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

function Switch({ question, onChange, value = false }) {


  const [error, setError] = useState("");
  const [toggle, setToggle] = useState(false);

  useEffect(() =>{
    setToggle(value);
  },[value])

  const toggleQuestion = () => {
    setToggle((prev) => !prev);
    onChange(!toggle);
  };


  return (
    <div className="my-6">
      <p className="text-lg mb-1 font-medium">
        {question.question || "Enter your email address"}
      </p>

      <div className="space-y-2 group relative">
        <div className="flex flex-col items-start focus:outline-none ">
          {question.caption && (
            <div className="mb-3"><p className="text-gray-600">{question.caption}</p></div>
          )}
          
          <button
            onClick={toggleQuestion}
            style={{
              width: 70,
              height: 34,
              backgroundColor: toggle ? "#9911ff" : "#ccc",
              borderRadius: 30,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: toggle ? "flex-end" : "flex-start",
              padding: 3,
              transition: "background-color 0.2s ease",
            }}
          >
            <motion.div
              layout
              style={{
                width: 25,
                height: 25,
                backgroundColor: "white",
                borderRadius: "50%",
                boxShadow: "0 0 3px rgba(0,0,0,0.2)",
              }}
              transition={{
                type: "spring",
                duration: 0.25,
                bounce: 0.2,
              }}
            />
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-sm font-vagrounded">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Switch;
