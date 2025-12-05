import { FaMagnifyingGlass } from "react-icons/fa6";
import { CiBoxList } from "react-icons/ci";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BsPerson } from "react-icons/bs";
import { BiGridHorizontal } from "react-icons/bi";
import { FaRegFileAlt, FaTrash } from "react-icons/fa";
import HomeBox from "../components/HomeBox";
import { VscLoading } from "react-icons/vsc";
import moment from "moment";
import aboutus from "../assets/hugeicons_ai-dna.svg";
import DotShader from "../components/DotShader2";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Context/authContext";
import { AnimatePresence, motion } from "framer-motion";

function Workspaces() {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [createFormLoading, setCreateFormLoadin] = useState(false);
  const [formReply, setFormReply] = useState({});
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Initialize viewMode from localStorage (default to "list" if not found)
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "list";
  });

  const { user } = useContext(AuthContext);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // 2. Save to localStorage whenever viewMode changes
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  // 1. Fetch Forms
  useEffect(() => {
    async function GetForms() {
      setIsloading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/Form`,
          {
            withCredentials: true,
          }
        );

        const forms = res.data?.data || [];
        setFormData(forms);
      } catch (error) {
        const msg =
          error.response?.data || error.message || "An error occurred";
        toast.error(msg);
      } finally {
        setIsloading(false);
      }
    }

    GetForms();
  }, []);

  // 2. Create Form Logic
  async function MakeForm() {
    // Prevent creating if already loading
    if (isLoading || createFormLoading) return;

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
      toast.error("Failed to create form");
    } finally {
      setCreateFormLoadin(false);
    }
  }

  // 3. Logic: Handle Toggle Click
  const handleToggleClick = async (e, item) => {
    e.stopPropagation(); // Stop navigation
    const newStatus = !item.isPublished;
    const originalList = [...formData];

    // Optimistic Update
    setFormData((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, isPublished: newStatus } : f))
    );

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND}/api/Form/save/${item.id}`,
        { isPublished: newStatus },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to save status");
      setFormData(originalList); // Revert
    }
  };

  // 4. Logic: Handle Delete Click (Opens Modal)
  const handleDeleteClick = (e, id) => {
    e.stopPropagation(); // Stop navigation
    setItemToDelete(id);
    setShowDeleteModal(true);
  };


  async function confirmDelete() {
    if (!itemToDelete) return;

    const originalList = [...formData];
    setFormData((prev) => prev.filter((f) => f.id !== itemToDelete));
    setShowDeleteModal(false);

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND}/api/Form/delete/${itemToDelete}`,
        { withCredentials: true }
      );
      toast.success("Form deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete form");
      setFormData(originalList); // Revert
    } finally {
      setItemToDelete(null);
    }
  }
  const filteredForms = formData.filter((form) => {
    const title = form.title || "Untitled";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  return (
    <>
      <Toaster position="top-right" />
      <div className="relative w-full h-screen overflow-hidden">
        {/* SIDEBAR */}
        <div className="absolute top-0 left-0 w-[20%] h-full z-20 bg-[#DFE0F0] border-r border-gray-300 flex flex-col">
          <div
            className="flex border-b-2 border-gray-300 justify-between py-8 px-10 cursor-pointer"
            onClick={() => navigate(`/`)}
          >
            <h1 className="font-zendots text-[24px] px-2">C-MEN</h1>
          </div>

          <div className="px-10 mt-8 flex-1">
            <div className="relative w-full mb-10">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#DFE0F0] border border-gray-300 rounded-xl placeholder:text-gray-400 text-black outline-none focus:ring-2 focus:ring-[var(--purple)]"
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

            {/* UPDATED CREATE FORM BUTTON WITH LOADING STATE */}
            <div
              onClick={!createFormLoading ? MakeForm : undefined}
              className={`cursor-pointer relative transition-all ${
                createFormLoading ? "opacity-70 pointer-events-none" : ""
              }`}
            >
              
              <HomeBox
                title={createFormLoading ? "Creating..." : "Create Form"}
                icon={aboutus}
              />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="absolute top-0 right-0 w-[80%] h-full z-10 overflow-y-auto">
          <div className="px-12 py-8">
            <div className="flex justify-end mb-16">
              <div className="h-10 w-10 rounded-full border border-black flex items-center justify-center cursor-pointer hover:bg-gray-200 transition bg-transparent">
                <BsPerson className="text-2xl" />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-normal text-black tracking-wide">
                    My workspaces
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-black/5 transition">
                    Date Created
                  </button>
                  <div className="flex border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded transition-colors ${
                        viewMode === "list"
                          ? "bg-gray-400 text-white shadow-sm"
                          : "text-gray-500 hover:text-black"
                      }`}
                    >
                      <CiBoxList className="text-lg" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded transition-colors ${
                        viewMode === "grid"
                          ? "bg-gray-400 text-white shadow-sm"
                          : "text-gray-500 hover:text-black"
                      }`}
                    >
                      <BiGridHorizontal className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>

              {/* LIST / GRID CONTAINER */}
              <div
                className={`w-full mt-4 ${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "flex flex-col"
                }`}
              >
                {viewMode === "list" && (
                  <div className="grid grid-cols-12 text-xs font-semibold text-black uppercase tracking-wider mb-3 px-6">
                    <div className="col-span-5"></div>
                    <div className="col-span-2 text-center">Responses</div>
                    <div className="col-span-2 text-center">Published</div>
                    <div className="col-span-2 text-center">Last Modified</div>
                    <div className="col-span-1"></div>
                  </div>
                )}

                {isLoading && (
                  <div className="mt-5 w-full justify-center flex items-center col-span-full">
                    <VscLoading className="animate-spin text-3xl" />
                  </div>
                )}

                {filteredForms.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/newform/${item.id}`)}
                    className={`
                      group bg-[#DFE0F0] backdrop-blur-sm border border-black/30 hover:border-[var(--purple)] 
                      rounded-xl shadow-sm transition-all cursor-pointer relative
                      ${
                        viewMode === "list"
                          ? "p-4 grid grid-cols-12 items-center mt-3"
                          : "p-6 flex flex-col justify-between h-56"
                      }
                    `}
                  >
                    {viewMode === "list" ? (
                      // === LIST VIEW UI ===
                      <>
                        <div className="col-span-5 flex items-center gap-4">
                          <div className="w-8 h-8 rounded-md flex items-center justify-center text-white">
                            <FaRegFileAlt className="text-black text-xl" />
                          </div>
                          <span className="font-medium text-gray-800 truncate">
                            {item.title || "Untitled"}
                          </span>
                        </div>

                        <div className="col-span-2 text-center text-sm font-medium">
                          {item.responseCount || 0}
                        </div>

                        {/* Switch (Inline JSX) */}
                        <div className="col-span-2 flex justify-center">
                          <div
                            onClick={(e) => handleToggleClick(e, item)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 relative z-20 ${
                              item.isPublished ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                                item.isPublished
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="col-span-2 text-center text-sm text-gray-500">
                          {moment.utc(item.createdAt).local().fromNow()}
                        </div>

                        <div className="col-span-1 flex justify-end">
                          <button
                            onClick={(e) => handleDeleteClick(e, item.id)}
                            className="relative z-20 p-2 rounded-full hover:bg-red-100 transition-colors group/delete"
                          >
                            <FaTrash className="text-lg fill-gray-400 group-hover/delete:fill-red-500 transition-colors" />
                          </button>
                        </div>
                      </>
                    ) : (
                      // === GRID VIEW UI ===
                      <>
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                            <FaRegFileAlt className="text-black text-xl" />
                          </div>
                          {/* Trash Icon */}
                          <div className="absolute top-4 right-4 z-30">
                            <button
                              onClick={(e) => handleDeleteClick(e, item.id)}
                              className="p-2 rounded-full hover:bg-red-100 transition-colors group/delete"
                            >
                              <FaTrash className="text-lg fill-gray-400 group-hover/delete:fill-red-500 transition-colors" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-1">
                            {item.title || "Untitled"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {item.responseCount || 0} responses
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-black/10 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {moment.utc(item.createdAt).local().fromNow(true)}
                          </span>
                          {/* Switch (Inline JSX) */}
                          <div
                            onClick={(e) => handleToggleClick(e, item)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 relative z-20 ${
                              item.isPublished ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                                item.isPublished
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
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

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20"
          >
            <div
              className="absolute inset-0"
              onClick={() => setShowDeleteModal(false)}
            ></div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#DFE0F0] p-6 rounded-2xl shadow-xl w-[400px] z-10 font-vagrounded border-2 border-red-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Delete Form?
              </h2>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this form? This action cannot be
                undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md shadow-red-200 font-semibold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Workspaces;
