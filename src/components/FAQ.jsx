import React from 'react';
import '../global.css';
import { motion } from "motion/react";

function FAQ() {
    return (
        <>
            <div
                style={{
                    width: 100,
                    height: 100,
                    position: "relative",
                    borderRadius: "50%",
                }}
            >
                <motion.div
                    className="absolute top-0 left-0 w-full h-full rounded-full"
                    style={{
                        background: `conic-gradient(
        from 0deg,
        rgba(52,152,219,0) 0deg,        /* bright head */
        rgba(52,152,219,0.3) 120deg,    /* fading tail */
        rgba(52,152,219,1) 360deg       /* fully faded */
      )`,
                        mask: "radial-gradient(transparent 60%, black 61%)", // creates a ring
                        WebkitMask: "radial-gradient(transparent 60%, black 61%)",
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
                        width: "90%",
                        height: "90%",
                        borderRadius: "50%",
                        background: "white",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                </div>
            </div>


        </>
    )

}
export default FAQ;