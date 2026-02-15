"use client";
import React, { useState, useRef, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';
function Footer() {
  const [displayText, setDisplayText] = useState("by CMN");
  const [fadeClass, setFadeClass] = useState("opacity-100");

  const names = [
    "J.A. Belila",
    "Jeano Cabanjen",
    "Kurt Ereño",
    "MC Ganir",
    "Syrick Layco"

  ];
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 700px)' });

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 699px)' });

  const timeoutRef = useRef(null);     // waiting 3s before starting cycle
  const intervalRef = useRef(null);    // cycling names
  const cycleStarted = useRef(false);  // whether cycle actually began
  const nameIndexRef = useRef(0);      // current name index

  // Mouse enter: start a 3s timer to begin cycling. Do NOT touch UI immediately.
  const handleMouseEnter = () => {
    // guard: if already started, don't start another timer
    if (cycleStarted.current || timeoutRef.current) return;

    timeoutRef.current = setTimeout(() => {
      cycleStarted.current = true;
      nameIndexRef.current = 0;

      // start immediate first change so user sees the first name after 3s
      setFadeClass("opacity-0");
      setTimeout(() => {
        setDisplayText(names[nameIndexRef.current]);
        setFadeClass("opacity-100");
        nameIndexRef.current = (nameIndexRef.current + 1) % names.length;
      }, 300); // allow fade-out to complete before switching

      // then continue cycling every 2s (including fade time)
      intervalRef.current = setInterval(() => {
        setFadeClass("opacity-0");
        setTimeout(() => {
          setDisplayText(names[nameIndexRef.current]);
          setFadeClass("opacity-100");
          nameIndexRef.current = (nameIndexRef.current + 1) % names.length;
        }, 300);
      }, 2000);
    }, 3000);
  };

  // Mouse leave: if cycle never started, cancel the 3s timer and do nothing.
  // If cycle started, stop it and fade back to default text.
  const handleMouseLeave = () => {
    // Cancel the pending 3s timer if it exists (no UI change in that case)
    if (timeoutRef.current && !cycleStarted.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      return; // early return — do NOT trigger any fade/reset
    }

    // If cycle already running, stop it and revert text with fade.
    if (cycleStarted.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      cycleStarted.current = false;

      // Fade out current name then restore original text
      setFadeClass("opacity-0");
      setTimeout(() => {
        setDisplayText("by CMN");
        setFadeClass("opacity-100");
      }, 300);
    }
  };

  // Cleanup on unmount to avoid timers leaking
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      {isDesktopOrLaptop &&
        <>
          <footer
            className="p-10 flex cursor-default fixed bottom-0 left-2 w-fit text-center 
       bg-header-gradient text-white font-zendots text-lg z-20"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <p className={`transition-opacity duration-300 ${fadeClass}`}>
              {displayText}
            </p>
          </footer>
        </>
      }
      {isTabletOrMobile &&
        <>
          <footer
            className="p-10 flex cursor-default fixed bottom-0 left-0 w-fit text-center 
       bg-header-gradient text-white font-zendots text-[md] z-20"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <p className={`transition-opacity duration-300 ${fadeClass}`}>
              {displayText}
            </p>
          </footer>
        </>
      }
    </>
  );
}

export default Footer;
