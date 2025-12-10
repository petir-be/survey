import React from "react";
import "../global.css";
import { motion } from "motion/react";

function FAQ() {
  return (
    <>
      <div
        style={{
          width: 150,
          height: 150,
          position: "relative",
          borderRadius: "50%",
        }}
      >
        {motion}
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full"
          style={{
            background: `conic-gradient(
        from 0deg,
        rgba(132, 95, 255,0) 0deg,        /* bright head */
        rgba(132, 95, 255,0.3) 120deg,    /* fading tail */
        rgba(132, 95, 255,1) 360deg       /* fully faded */
      )`,
            mask: "radial-gradient(transparent 65%, black 70%)", // creates a ring
            WebkitMask: "radial-gradient(transparent 69%, black 70%)",
          }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        />
        <div
          style={{
            width: "99%",
            height: "99%",
            borderRadius: "50%",
            background: "radial-gradient(circle, #845FFF22 40%, #ffffff 100%)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
          
            paddingLeft:"20%",
            fontFamily:"Arial",
            color:"#845FFF",
         
          }}
        >
          FAQ's
        </div>
      </div>
    </>
  );
}
export default FAQ;
