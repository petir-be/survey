import { FaMagnifyingGlass } from "react-icons/fa6";
import { CiBoxList } from "react-icons/ci";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BsPerson } from "react-icons/bs";
import { BiGridHorizontal } from "react-icons/bi";
import { FaRegFileAlt } from "react-icons/fa";
import HomeBox from "../components/HomeBox";
import { VscLoading } from "react-icons/vsc";

import aboutus from "../assets/hugeicons_ai-dna.svg";
import DotShader from "../components/DotShader2";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Context/authContext";
function Workspaces() {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [createFormLoading, setCreateFormLoadin] = useState(false);
  const [formReply, setFormReply] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    async function GetForms() {
      setIsloading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/Form`);

        const forms = res.data?.data || [];
        setFormData(forms);
      } catch (error) {
        const msg =
          error.response?.data || error.message || "An error occurred";
        toast.error(
          (t) => (
            <div className="flex justify-between items-center gap-2 font-vagrounded">
              <span>{msg}</span>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-white text-lg"
              >
                <IoMdClose />
              </button>
            </div>
          ),
          {
            duration: 5000,
            style: {
              minWidth: "250px",
              padding: "16px",
              color: "#fff",
              background: "#f56565",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#f56565",
            },
          }
        );
      } finally {
        setIsloading(false);
      }
    }

    GetForms();
  }, []);

  async function MakeForm() {
    if (isLoading) return;
    setCreateFormLoadin(true);
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
      setFormReply(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCreateFormLoadin(false);
    }
  }
  return (
    <>
      <Toaster position="top-right" />
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute top-0 left-0 w-[20%] h-full z-20 bg-[#DFE0F0] border-r border-gray-300 flex flex-col">
          <div
            className="flex border-b-2 border-gray-300 justify-between py-8 px-10"
            onClick={() => navigate(`/`)}
          >
            <h1 className="font-zendots text-[30px] px-2">C-MEN</h1>
          </div>

          <div className="px-10 mt-8 flex-1">
            <div className="relative w-full mb-10">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-300 rounded-xl placeholder:text-gray-400 text-black outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Search"
              />
            </div>

            <div className="mb-10">
              <p className="text-4xl leading-tight">
                <span className="font-bold font-vagrounded">Manage</span> Your{" "}
                <br />
                Forms <span className="font-bold font-vagrounded">Here!</span>
              </p>
              <p className="font-vagrounded text-gray-600 mt-4 text-lg">
                This is where you can view, edit, <br /> and organize all your
                created forms.
              </p>
            </div>

            <Link onClick={MakeForm}>
              <HomeBox title="Create Form" icon={aboutus} />
            </Link>
          </div>
        </div>

        {/* ================= MAIN CONTENT AREA ================= */}

        <div className="absolute top-0 right-0 w-[80%] h-full z-10 overflow-y-auto">
          <div className="px-12 py-8">
            {/* --- TOP HEADER: Avatar --- */}
            <div className="flex justify-end mb-16">
              <div className="h-10 w-10 rounded-full border border-black flex items-center justify-center cursor-pointer hover:bg-gray-200 transition bg-transparent">
                <BsPerson className="text-2xl" />
              </div>
            </div>

            {/* --- WORKSPACE CONTROLS --- */}
            <div className="flex flex-col gap-6">
              {/* Title Row */}
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-normal text-black tracking-wide">
                    My workspaces
                  </h2>
                  <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-4">
                  <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-black/5 transition">
                    Date Created
                  </button>
                  <div className="flex border border-gray-300 rounded-lg p-1">
                    <button className="p-1.5 rounded bg-gray-400 text-white shadow-sm">
                      <CiBoxList />
                    </button>
                    <button className="p-1.5 rounded text-gray-500 hover:text-black">
                      <BiGridHorizontal />
                    </button>
                  </div>
                </div>
              </div>

              {/* --- LIST TABLE --- */}
              <div className="w-full mt-4">
                {/* Table Headers */}
                <div className="grid grid-cols-12 text-xs font-semibold text-black uppercase tracking-wider mb-3 px-6">
                  <div className="col-span-5"></div>
                  <div className="col-span-2 text-center">Responses</div>
                  <div className="col-span-2 text-center">Published</div>
                  <div className="col-span-2 text-center">Last Modified</div>
                  <div className="col-span-1"></div>
                </div>
                {isLoading && (
                  <div className=" mt-5 w-full justify-center flex items-center ">
                    <VscLoading className="animate-spin text-3xl " />
                  </div>
                )}
                {formData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/newform/${item.id}`)}
                    className="group bg-[#DFE0F0] backdrop-blur-sm border border-black/30 hover:border-purple-400 rounded-xl p-4 grid grid-cols-12 items-center shadow-sm transition-all cursor-pointer mt-3 "
                  >
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-8 h-8  rounded-md flex items-center justify-center text-white">
                        <FaRegFileAlt />
                      </div>
                      <span className="font-medium text-gray-800">
                        {item.title}
                      </span>
                    </div>

                    <div className="col-span-2 text-center text-sm font-medium">
                      {item.responseCount}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <div
                        onClick={async (e) => {
                          e.stopPropagation();

                          const newStatus = !item.isPublished;

                          const originalList = [...formData];
                          const updatedList = formData.map((f) =>
                            f.id === item.id
                              ? { ...f, isPublished: newStatus }
                              : f
                          );
                          setFormData(updatedList);

                          try {
                            await axios.put(
                              `${import.meta.env.VITE_BACKEND}/api/Form/save/${
                                item.id
                              }`,
                              { isPublished: newStatus }
                            );
                          } catch (error) {
                            console.error("Failed to update status", error);
                            toast.error("Failed to save status");
                            setFormData(originalList);
                          }
                        }}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                          item.isPublished ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                            item.isPublished ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-sm text-gray-500">
                      {moment.utc(item.createdAt).local().fromNow()}
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <HiOutlineDotsHorizontal className="text-xl text-gray-500 cursor-pointer hover:text-black" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 h-full w-full pointer-events-none z-0">
          <DotShader className="z-0" />
          <span className="home-circle mixed-blend-multiply opacity-50 -top-40 left-[20%] w-64 h-64 bg-purple-300 blur-3xl animate-moveCircleLtR"></span>
          <span className="home-circle mixed-blend-multiply opacity-50 top-10 right-10 w-72 h-72 bg-pink-300 blur-3xl animate-moveCircleRtL"></span>
          <span className="home-circle mixed-blend-multiply opacity-50 -bottom-20 right-[20%] w-80 h-80 bg-purple-300 blur-3xl animate-moveCircleRtL"></span>
        </div>
      </div>
    </>
  );
}

export default Workspaces;
