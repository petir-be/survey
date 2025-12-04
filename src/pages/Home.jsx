import React, { useContext, useState } from "react";
import "../global.css";
import DotShader from "../components/DotShader";
import home1 from "/src/assets/2.svg";
import HomeBox from "../components/HomeBox";
import aboutus from "../assets/hugeicons_ai-dna.svg";
import FAQ from "../components/FAQ";
import { motion, AnimatePresence } from "framer-motion";
import ThreeDModel from "../components/ThreeDmodel";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
function Home() {
  const [showModal, setShowModal] = useState(false);

  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 700px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 699px)" });
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function MakeForm() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Form/createform`,
        {
          userId: user.id,
          title: "Untitled",
        },
        {
          withCredentials: true,
        }
      );
      if (res.data && res.data.surveyId) {
        navigate(`/newform/${res.data.surveyId}`);
      }
      setForm(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function MakeAIForm() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Form/Ai`,
        {
          userId: user.id,
          title: "Advance Coding in C#",
        },
        {
          withCredentials: true,
        }
      );
      if (res.data && res.data.surveyId) {
        navigate(`/newform/${res.data.surveyId}`);
      }
      setForm(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isDesktopOrLaptop && (
        <>
          {/* para matanggal lang error */}
          {motion}

          <div className="flex items-center justify-center flex-1 min-h-full bg-[var(--white)] z-10">
            <div className="relative w-2/7 h-dvh pt-25">
              <div className="m-12 flex flex-col">
                <span className="text-[42px] font-vagrounded font-semibold">
                  Build Your Form{" "}
                </span>
                <span className="text-[42px] font-vagrounded font-black">
                  {" "}
                  INSTANTLY!
                </span>
                <span className="font-regular">
                  Drag, Drop and Build Forms in Seconds.
                </span>
              </div>
              <button
                className="m-12 cursor-pointer text-4xl"
                onClick={() => setShowModal(true)}
              >
                +
              </button>
            </div>
            <div className="w-3/7 relative h-dvh overflow-hidden pt-15 border-2 border-[var(--dirty-white)] bg-[var(--white)] z-10">
              <div className="absolute z-1 w-full h-full flex justify-center items-center">
                <ThreeDModel
                  url="/models/free__rubiks_cube_3d.glb"
                  scale={0.2} // <<< CHANGE SIZE HERE
                />
              </div>
              <div className="absolute top-0 left-0 h-full w-full">
                <DotShader className="z-0" />
                <span className="home-circle mixed-blend-multiply -top-40 left-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleLtR"></span>
                {/*top left*/}
                <span className="home-circle mixed-blend-multiply -top-38 right-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleRtL"></span>
                {/*top right*/}
                <span className="home-circle mixed-blend-multiply -bottom-32 left-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleLtR"></span>
                {/*bottom left*/}
                <span className="home-circle mixed-blend-multiply -bottom-38 right-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleRtL"></span>
                {/*bottom right*/}
              </div>
            </div>
            <div className=" justify-center flex flex-col gap-5 w-2/7 h-dvh pt-25 ">
              {/* Redirect to login page if dont have acc log */}
              <button className="text-left" onClick={() => setShowModal(true)}>
                <HomeBox title="Create Forms" icon={aboutus} />
              </button>
              {/* Contains of functionality of the system */}
              <Link to={`Workspaces`} className="contents">
                <HomeBox title="My Workspaces" icon={aboutus} />
              </Link>

              {/* Higlights the website and devs*/}
              <HomeBox title="Features" icon={aboutus} />

              <div className="flex justify-center">
                <FAQ />
              </div>
            </div>
            <AnimatePresence>
              {showModal && (
                <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
                >
                  <span
                    className="absolute w-full h-full bg-transparent"
                    onClick={() => setShowModal(false)}
                  ></span>

                  <div className="p-10 w-2/3 h-2/3 bg-(--white) ring ring-white rounded-lg fixed z-50">
                    <h1 className="font-vagrounded text-xl">
                      Start a new Form
                    </h1>
                    <div className="absolute top-0 right-0 w-15 h-15 flex items-center justify-center">
                      <button
                        onClick={() => setShowModal(false)}
                        className="w-full h-full cursor-pointer"
                      >
                        X
                      </button>
                    </div>
                    <div className="p-5 flex items-center justify-evenly w-full h-full">
                      {/* create own forms */}
                      <div
                        className="flex flex-col gap-3 items-center w-full h-full font-vagrounded "
                        onClick={MakeForm}
                      >
                        <span className="relative w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease">
                          {/* button ng form */}
                          <button
                            className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"
                            onClick={MakeForm}
                          ></button>

                          {/* circle and rectangle */}
                          <span className="inset-shadow-sm/40 w-5 h-5 absolute top-8 left-10 rounded-full"></span>
                          <span className="inset-shadow-sm/40 w-5 h-5 absolute top-15 left-10 rounded-full"></span>
                          <span className="w-5 h-5 inset-shadow-sm/40 absolute top-22 left-10 rounded-full"></span>

                          <span className="w-7/12 h-3 inset-shadow-sm/40 absolute top-9 left-17"></span>
                          <span className="w-4/12 h-3 inset-shadow-sm/40 absolute top-16 left-17"></span>
                          <span className="w-2/12 h-3 inset-shadow-sm/40 absolute top-23 left-17"></span>

                          {/* plus circle */}
                          <span className="w-15 h-15 rounded-full inset-shadow-sm/40 absolute top-50 left-15 flex justify-center items-center">
                            <span className="flex justify-center items-center w-11 h-11 rounded-full shadow-sm/40">
                              <span className="w-8 h-2 inset-shadow-sm/40 rounded-lg flex justify-center items-center">
                                {/* ayaw maalis pota */}
                                <span className="mix-blend-lighten w-2 h-2 bg-white/30"></span>
                              </span>
                              <span className="fixed w-2 h-8 inset-shadow-sm/40 rounded-lg flex justify-center items-center">
                                <span className="mix-blend-lighten w-2 h-2 bg-white/30"></span>
                              </span>
                            </span>
                          </span>

                          <span className="absolute -bottom-4 right-12 shadow-[2px_0_5px_rgba(0,0,0,0.2)] z-1 w-2 h-34 rotate-45  "></span>
                          <div
                            className="absolute bottom-0 z-2 right-0 w-25 h-25 bg-linear-150 from-[#F9F9F9] to-[#CCCDD9]"
                            style={{
                              clipPath: "polygon(0 0, 100% 0, 0 100%)",
                              filter:
                                "drop-shadow(2px 2px 4px rgba(0, 0, 0, 1))",
                            }}
                          />
                          <div
                            className="font-vagrounded font-normal absolute z-0 -bottom-2 -right-2 w-28 h-29"
                            style={{
                              clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                              background: "#DFE0F0",
                              // background:'#000000'
                            }}
                          />
                        </span>
                        Create you own forms
                      </div>

                      {/* generate with ai */}
                      <div
                        className="flex flex-col gap-3 items-center w-full h-full font-vagrounded"
                        onClick={MakeAIForm}
                      >
                        <span className="relative w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease"></span>
                        Generate with AI
                      </div>

                      {/* Use a template */}
                      <div className="flex flex-col gap-3 items-center w-full h-full font-vagrounded">
                        <span className="relative flex  items-center justify-center w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease">
                          {/* button ng form */}
                          <button className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"></button>

                          <div className=" gap-3 h-1/2 w-1/2 flex flex-col">
                            <span className="w-full h-[60%] inset-shadow-sm/40 rounded-xl"></span>
                            <div className="flex flex-row w-full h-full gap-3 justify-between">
                              <span className="h-full w-1/2 rounded-xl inset-shadow-sm/30"></span>
                              <div className="flex flex-col w-1/2 h-full items-center justify-between ">
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                              </div>
                            </div>
                          </div>
                        </span>
                        Use a template
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
      {isTabletOrMobile && (
        <>
          {/* para matanggal lang error */}
          {motion}

          <div className="flex flex-col items-center justify-center flex-1 min-h-full bg-[var(--white)] z-10">
            <div className="mt-30 flex flex-col justify-center items-center whitespace-nowrap mb-5">
              <span className=" text-[24px] font-vagrounded font-semibold">
                Build Your Form{" "}
              </span>
              <span className="text-[24px] font-vagrounded font-black">
                {" "}
                INSTANTLY!
              </span>
              <span className="text-[12px]">
                Drag, Drop and Build Forms in Seconds.
              </span>
            </div>

            <div className="w-7/7 relative h-[360px] overflow-hidden pt-15 border-2 border-[var(--dirty-white)] bg-[var(--white)] z-10">
              <div className="absolute z-1 w-full h-full flex justify-center items-center">
                <ThreeDModel
                  url="/models/free__rubiks_cube_3d.glb"
                  scale={0.2} // <<< CHANGE SIZE HERE
                />
              </div>
              <div className="absolute top-0 left-0 h-full w-full">
                <DotShader className="z-0" />
                <span className="home-circle mixed-blend-multiply -top-40 left-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleLtR"></span>
                {/*top left*/}
                <span className="home-circle mixed-blend-multiply -top-38 right-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleRtL"></span>
                {/*top right*/}
                <span className="home-circle mixed-blend-multiply -bottom-32 left-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleLtR"></span>
                {/*bottom left*/}
                <span className="home-circle mixed-blend-multiply -bottom-38 right-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleRtL"></span>
                {/*bottom right*/}
              </div>
            </div>
            <div className=" justify-center flex flex-col gap-5 w-5/6 h-dvh pt-15 ">
              {/* Redirect to login page if dont have acc log */}
              <button className="text-left" onClick={() => setShowModal(true)}>
                <HomeBox title="Create Forms" icon={aboutus} />
              </button>

              {/* Contains of functionality of the system */}
              <HomeBox title="My Workspaces" icon={aboutus} />

              {/* Higlights the website and devs*/}
              <HomeBox title="Features" icon={aboutus} />

              <div className="flex justify-center">
                <FAQ />
              </div>
            </div>
            <span className="mt-10 bottom font-zendots font-semibold text-[12px]">
              {" "}
              by C-men
            </span>
            <AnimatePresence>
              {showModal && (
                <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
                >
                  <span
                    className="absolute w-full h-full bg-transparent"
                    onClick={() => setShowModal(false)}
                  ></span>

                  <div className="p-10 w-2/3 h-1/3 bg-(--white) ring ring-white rounded-lg fixed z-50">
                    <h1 className="font-vagrounded text-xl">
                      Start a new Form
                    </h1>
                    <div className="absolute top-0 right-0 w-15 h-15 flex items-center justify-center">
                      <button
                        onClick={() => setShowModal(false)}
                        className="w-full h-full cursor-pointer"
                      >
                        X
                      </button>
                    </div>
                    <div className="p-5 flex items-center justify-evenly w-full h-full">
                      {/* create own forms */}
                      <div className="flex flex-col gap-3 items-center w-full h-full font-vagrounded ">
                        <span className="relative w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease">
                          {/* button ng form */}
                          <button className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"></button>

                          {/* circle and rectangle */}
                          <span className="inset-shadow-sm/40 w-5 h-5 absolute top-8 left-10 rounded-full"></span>
                          <span className="inset-shadow-sm/40 w-5 h-5 absolute top-15 left-10 rounded-full"></span>
                          <span className="w-5 h-5 inset-shadow-sm/40 absolute top-22 left-10 rounded-full"></span>

                          <span className="w-7/12 h-3 inset-shadow-sm/40 absolute top-9 left-17"></span>
                          <span className="w-4/12 h-3 inset-shadow-sm/40 absolute top-16 left-17"></span>
                          <span className="w-2/12 h-3 inset-shadow-sm/40 absolute top-23 left-17"></span>

                          {/* plus circle */}
                          <span className="w-15 h-15 rounded-full inset-shadow-sm/40 absolute top-50 left-15 flex justify-center items-center">
                            <span className="flex justify-center items-center w-11 h-11 rounded-full shadow-sm/40">
                              <span className="w-8 h-2 inset-shadow-sm/40 rounded-lg flex justify-center items-center">
                                {/* ayaw maalis pota */}
                                <span className="mix-blend-lighten w-2 h-2 bg-white/30"></span>
                              </span>
                              <span className="fixed w-2 h-8 inset-shadow-sm/40 rounded-lg flex justify-center items-center">
                                <span className="mix-blend-lighten w-2 h-2 bg-white/30"></span>
                              </span>
                            </span>
                          </span>

                          <span className="absolute -bottom-4 right-12 shadow-[2px_0_5px_rgba(0,0,0,0.2)] z-1 w-2 h-34 rotate-45  "></span>
                          <div
                            className="absolute bottom-0 z-2 right-0 w-25 h-25 bg-linear-150 from-[#F9F9F9] to-[#CCCDD9]"
                            style={{
                              clipPath: "polygon(0 0, 100% 0, 0 100%)",
                              filter:
                                "drop-shadow(2px 2px 4px rgba(0, 0, 0, 1))",
                            }}
                          />
                          <div
                            className="font-vagrounded font-normal absolute z-0 -bottom-2 -right-2 w-28 h-29"
                            style={{
                              clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                              background: "#DFE0F0",
                              // background:'#000000'
                            }}
                          />
                        </span>
                        Create you own forms
                      </div>

                      {/* generate with ai */}
                      <div className="flex flex-col gap-3 items-center w-full h-full font-vagrounded">
                        <span className="relative w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease"></span>
                        Generate with AI
                      </div>

                      {/* Use a template */}
                      <div className="flex flex-col gap-3 items-center w-full h-full font-vagrounded">
                        <span className="relative flex  items-center justify-center w-11/12 h-4/5 bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease">
                          {/* button ng form */}
                          <button className="h-full w-full bg-transparent absolute top-0 left-0 z-50 cursor-pointer"></button>

                          <div className=" gap-3 h-1/2 w-1/2 flex flex-col">
                            <span className="w-full h-[60%] inset-shadow-sm/40 rounded-xl"></span>
                            <div className="flex flex-row w-full h-full gap-3 justify-between">
                              <span className="h-full w-1/2 rounded-xl inset-shadow-sm/30"></span>
                              <div className="flex flex-col w-1/2 h-full items-center justify-between ">
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                                <span className="inset-shadow-sm/40 rounded-xl h-5 w-full"></span>
                              </div>
                            </div>
                          </div>
                        </span>
                        Use a template
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </>
  );
}
export default Home;
