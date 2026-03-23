import { FaMagnifyingGlass } from "react-icons/fa6";
import { CiBoxList } from "react-icons/ci";
import { BiGridHorizontal } from "react-icons/bi";
import { FaArrowUp, FaRegFileAlt, FaTrash, FaEllipsisV } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { AuthContext } from "../Context/authContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import AccountModal from "../components/AccountModal";
import { useMediaQuery } from "react-responsive";
import { IoDocumentText, IoGrid, IoSparkles } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavBar from "../components/Navbar";

function Workspaces() {


  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 821px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 700px) and (max-width: 820px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 699px)" });



  const navigate = useNavigate();
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAIInput, setShowAIInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountModal, setShowAccountModal] = useState(false);
  const queryClient = useQueryClient();

  const [isFocused, setIsFocused] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "list";
  });

  const { user } = useContext(AuthContext);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // 2. Save to localStorage whenever viewMode changes
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);


  const { data: formData = [], isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND}/api/Form`, {
        withCredentials: true,
      });
      return res.data?.data || [];
    },
  })


  const createFormMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Form/createform`,
        { userId: user.id, title: "Untitled" },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.surveyId) navigate(`/newform/${data.surveyId}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create form");
    }
  });


  const createAiFormMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Form/Ai`,
        { userId: user.id, title: "", promt: aiPrompt },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.surveyId) navigate(`/newform/${data.surveyId}`);
      setShowAIInput(false);
      setAiPrompt("");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to generate AI form");
    }
  });


  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }) => {
      await axios.put(
        `${import.meta.env.VITE_BACKEND}/api/Form/save/${id}`,
        { isPublished },
        { withCredentials: true }
      );
    },
    // Optimistic Update: Instantly flip the switch in the UI before the server responds
    onMutate: async ({ id, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: ["forms"] });
      const previousForms = queryClient.getQueryData(["forms"]);
      queryClient.setQueryData(["forms"], (old) =>
        old.map((f) => (f.id === id ? { ...f, isPublished } : f))
      );
      return { previousForms };
    },
    // If the API fails, roll back to the previous state
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["forms"], context.previousForms);
      toast.error("Failed to save status");
    },
    // Sync with the server once finished
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });

  const deleteFormMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${import.meta.env.VITE_BACKEND}/api/Form/delete/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Form deleted successfully");
      setShowDeleteModal(false);
      setItemToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["forms"] }); // Refresh the list!
    },
    onError: (error) => {
      console.error("Delete failed", error);
      toast.error("Failed to delete form");
    },
  });

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const filteredForms = formData.filter((form) => {
    const title = form.title || "Untitled";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <AccountModal
        isOpen={showAccountModal}
        close={() => setShowAccountModal(false)}
        title="Account Information"
      ></AccountModal>
      <Toaster position="top-right" />

      {isDesktopOrLaptop && (
        <>

          <div className="flex w-full h-screen overflow-hidden ">


            <div className="w-[260px] xl:w-[20%] shrink-0 h-full z-20 bg-black border-r border-gray-300 flex flex-col">
              <div

                className="flex border-b-2 border-gray-300 justify-between py-10 px-5 xl:px-10 cursor-pointer"
                onClick={() => navigate(`/`)}
              >
                <h1 className="font-zendots text-white text-[24px]">Ispecmn</h1>
              </div>

              <div className="px-5 xl:px-10 mt-8 flex-1">
                <div className="relative w-full mb-10">
                  <FaMagnifyingGlass size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full text-white placeholder-gray-400 text-[12px] py-4 pr-4 pl-10 bg-black outline rounded-xl hover:bg-[#1E1E1E] transition-all ${isFocused ? 'outline-[2px] outline-green-700 bg-[#1E1E1E]' : 'outline-[#707070]'}`}
                  />
                </div>

                <div className="mb-8">
                  {/* 4. Responsive text: Starts smaller (text-2xl) and scales up to 4xl on large screens */}
                  <p className="text-2xl lg:text-3xl xl:text-4xl text-white leading-tight">
                    <span className="font-bold font-vagrounded">Manage</span>{" "}
                    Your
                    Forms
                    <span className="font-bold font-vagrounded"> Here!</span>{" "}
                  </p>
                  <p className="font-vagrounded text-white mt-4 text-[12px] xl:text-[14px]">
                    This is where you can view, edit, and organize all your created forms.
                  </p>
                </div>

                {/* Create Forms Button... */}
                <button
                  className="text-left w-full"
                  onClick={() => setShowModal(true)}
                >
                  {/* Note: I added w-full to the button so it stretches nicely */}
                  <div className="justify-center w-full bg-black hover:bg-[#1E1E1E] group px-5 py-4 relative flex flex-col border-2 border-[var(--dirty-white)] duration-200 hover:border-green-700">
                    <div className="absolute flex items-center justify-center top-0 right-0 w-9 h-9 bg-[#C8C9DA]">
                      <div className="relative w-full h-full font-bold flex items-center justify-center overflow-hidden">
                        <FaArrowUp className="fill-black rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                        <FaArrowUp className="absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:-translate-y-0 transition-all duration-400 ease-out fill-green-700" />
                      </div>
                    </div>
                    <IoDocumentText className="text-white mb-2 text-[24px]" />
                    <span className="vagrounded font-semibold text-[15px] text-white mb-[2px]">
                      Create Forms
                    </span>
                    <span className="vagrounded font-normal text-[10px] text-white">
                      Start with a blank template and more
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 5. MAIN CONTENT: Uses flex-1 to automatically fill the rest of the screen */}
            <div className="flex-1 h-full z-10 overflow-y-auto">
              <div className="px-5 lg:px-10 py-8">
                <div className="flex justify-end mb-16">
                  <div className="bg-white h-12 w-12 rounded-full flex justify-center items-center">
                    <img
                      src={user?.avatar}
                      onClick={() => setShowAccountModal(true)}
                      className="h-10 w-10 cursor-pointer rounded-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-white tracking-wide">
                        My workspaces
                      </h2>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="px-4 py-1.5 bg-black border border-gray-400 rounded-lg text-sm
                       font-medium text-white hover:bg-black/5 transition">
                        Date Created
                      </button>
                      <div className="flex border border-gray-300 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode("list")}
                          className={`p-1.5 rounded transition-colors ${viewMode === "list"
                            ? "bg-gray-400 text-white shadow-sm"
                            : "text-gray-500 hover:text-black"
                            }`}
                        >
                          <CiBoxList className="text-lg" />
                        </button>
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`p-1.5 rounded transition-colors ${viewMode === "grid"
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
                    className={`w-full mt-4 ${viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                      : "flex flex-col"
                      }`}
                  >
                    {viewMode === "list" && (
                      <div className="grid grid-cols-12 text-xs font-semibold text-white uppercase tracking-wider mb-3 px-6">
                        <div className="col-span-5"></div>
                        <div className="col-span-2 text-center">Responses</div>
                        <div className="col-span-2 text-center">Published</div>
                        <div className="col-span-2 text-center">
                          Last Modified
                        </div>

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
                      group bg-white backdrop-blur-sm border border-black/30 hover:border-[var(--purple)] 
                      rounded-xl shadow-sm transition-all cursor-pointer relative
                      ${viewMode === "list"
                            ? "p-4 grid grid-cols-12 items-center mt-3"
                            : "p-6 flex flex-col justify-between h-56"
                          }
                    `}
                      >
                        {viewMode === "list" ? (
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
                              {/* We wrap the switch in a button to ensure it receives standard click events */}
                              <button
                                type="button" // Prevents default form submissions if it ever gets wrapped in a form
                                onClick={(e) => {
                                  e.preventDefault(); // Stop default button behavior
                                  e.stopPropagation(); // Stop the click from triggering the card's navigate()
                                  togglePublishMutation.mutate({ id: item.id, isPublished: !item.isPublished });
                                }}
                                // Add relative and z-50 to ensure it sits ABOVE the clickable card background
                                className={`relative z-50 w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${item.isPublished ? "bg-green-500" : "bg-gray-300"
                                  }`}
                              >
                                <div
                                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${item.isPublished ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                              </button>
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
                              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
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
                                {moment
                                  .utc(item.createdAt)
                                  .local()
                                  .fromNow(true)}
                              </span>
                              {/* Switch (Inline JSX) */}
                              <div
                                onClick={(e) => handleToggleClick(e, item)}
                                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 relative z-20 ${item.isPublished
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                                  }`}
                              >
                                <div
                                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${item.isPublished
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
                    Are you sure you want to delete this form? This action
                    cannot be undone.
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteFormMutation.mutate(itemToDelete)}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md shadow-red-200 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showModal && (
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed inset-0 !z-[9999] flex items-center justify-center backdrop-blur-xs"
              >
                <div className="w-full max-w-5xl relative py-10 px-8 bg-black outline-1 outline-white rounded-lg fixed z-50">

                  {/* Header */}
                  <div className="flex w-full items-center justify-between mb-4">
                    <h1 className="font-vagrounded text-white text-lg ">
                      Start a new Form
                    </h1>

                    <button
                      onClick={() => setShowModal(false)}
                      className=" text-white text-md cursor-pointer"
                    >
                      X
                    </button>

                  </div>




                  <div className=" flex items-stretch justify-between gap-5 w-full min-h-[280px]">
                    {/* create own forms */}
                    <div className="flex-1 font-vagrounded ">
                      {isLoading ? (
                        <span className="w-full h-full bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease flex justify-center items-center ">
                          <FaSpinner className="text-5xl text-(--green) animate-spin" />
                        </span>
                      ) : (
                        <button onClick={() => createFormMutation.mutate()} className="relative flex flex-col items-center gap-5 justify-center w-full h-full p-6 outline-2 outline-white/50 rounded-[6px]  transition-all duration-600 ease shadow-[inset_0_0_0px_rgba(255,255,255,0)] hover:shadow-[inset_0_0_30px_rgba(245,245,245,1)] hover:scale-101">
                          <IoDocumentText size={124} fill="white" />
                          <div className="h-10 flex items-start justify-center">
                            <span className="text-white text-lg font-vagrounded font-bold">
                              Blank form
                            </span></div>
                        </button>
                      )}
                    </div>




                    {/* generate with ai */}
                    <div className="flex-1 font-vagrounded relative">
                      {!showAIInput ? (
                        <div
                          className="flex flex-col gap-3 items-center w-full h-full cursor-pointer"
                          onClick={() => setShowAIInput(true)}
                        >
                          <button className="relative flex flex-col items-center gap-5 justify-center w-full h-full p-6 outline-2 outline-white/50 rounded-[6px]  transition-all duration-600 ease shadow-[inset_0_0_0px_rgba(255,255,255,0)] hover:shadow-[inset_0_0_30px_rgba(245,245,245,1)] hover:scale-101">
                            <IoSparkles size={120} fill="white" />
                            <div className="h-10 flex items-start justify-center">
                              <span className="text-lg text-white font-vagrounded font-bold">
                                Generate with AI
                              </span>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 items-center justify-center w-full h-11/12 animate-in fade-in zoom-in duration-200">
                          <textarea
                            autoFocus
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe what you want to make ...."
                            className="w-11/12 h-full p-3 rounded-lg bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm resize-none shadow-inner"
                          />

                          <div className="flex gap-2 w-11/12">
                            <button
                              onClick={() => setShowAIInput(false)}
                              className="flex-1 py-1 rounded bg-gray-200 hover:bg-gray-300 text-md text-gray-600 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              onClick={() => createAiFormMutation.mutate()}
                              disabled={createAiFormMutation.isPending || !aiPrompt.trim()}
                              className="flex-1 py-1 rounded bg-(--purple) text-white text-md disabled:opacity-50"
                            >
                              {isLoading ? "..." : "Generate"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 relative">
                      <button className="relative flex flex-col items-center gap-5 justify-center w-full h-full p-6 outline-2 outline-white/50 rounded-[6px]  transition-all duration-600 ease shadow-[inset_0_0_0px_rgba(255,255,255,0)] hover:shadow-[inset_0_0_30px_rgba(245,245,245,1)] hover:scale-101">
                        <IoGrid size={120} fill="white" />

                        <div className="h-10 flex items-start justify-center">
                          <span className="text-white text-lg font-vagrounded font-bold">
                            Use a template
                          </span></div>
                      </button>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      {isTablet && (
        <>

          <div className="flex w-full h-screen overflow-hidden bg-black">


            <div className="w-[260px] xl:w-[20%] shrink-0 h-full z-20 bg-black border-r border-gray-300 flex flex-col">
              <div

                className="flex border-b-2 border-gray-300 justify-between py-10 px-5 xl:px-10 cursor-pointer"
                onClick={() => navigate(`/`)}
              >
                <h1 className="font-zendots text-white text-[24px]">Ispecmn</h1>
              </div>

              <div className="px-5 xl:px-10 mt-8 flex-1">
                <div className="relative w-full mb-10">
                  <FaMagnifyingGlass size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full text-white placeholder-gray-400 text-[12px] py-4 pr-4 pl-10 bg-black outline rounded-xl hover:bg-[#1E1E1E] transition-all ${isFocused ? 'outline-[2px] outline-green-700 bg-[#1E1E1E]' : 'outline-[#707070]'}`}
                  />
                </div>

                <div className="mb-8">
                  {/* 4. Responsive text: Starts smaller (text-2xl) and scales up to 4xl on large screens */}
                  <p className="text-2xl lg:text-3xl xl:text-4xl text-white leading-tight">
                    <span className="font-bold font-vagrounded">Manage</span>{" "}
                    Your
                    Forms
                    <span className="font-bold font-vagrounded"> Here!</span>{" "}
                  </p>
                  <p className="font-vagrounded text-white mt-4 text-[12px] xl:text-[14px]">
                    This is where you can view, edit, and organize all your created forms.
                  </p>
                </div>

                {/* Create Forms Button... */}
                <button
                  className="text-left w-full"
                  onClick={() => setShowModal(true)}
                >
                  {/* Note: I added w-full to the button so it stretches nicely */}
                  <div className="justify-center w-full bg-black hover:bg-[#1E1E1E] group px-5 py-4 relative flex flex-col border-2 border-[var(--dirty-white)] duration-200 hover:border-green-700">
                    <div className="absolute flex items-center justify-center top-0 right-0 w-9 h-9 bg-[#C8C9DA]">
                      <div className="relative w-full h-full font-bold flex items-center justify-center overflow-hidden">
                        <FaArrowUp className="fill-black rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
                        <FaArrowUp className="absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:-translate-y-0 transition-all duration-400 ease-out fill-green-700" />
                      </div>
                    </div>
                    <IoDocumentText className="text-white mb-2 text-[24px]" />
                    <span className="vagrounded font-semibold text-[15px] text-white mb-[2px]">
                      Create Forms
                    </span>
                    <span className="vagrounded font-normal text-[10px] text-white">
                      Start with a blank template and more
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 5. MAIN CONTENT: Uses flex-1 to automatically fill the rest of the screen */}
            <div className="flex-1 h-full z-10 overflow-y-auto">
              <div className="px-5 lg:px-10 py-8">
                <div className="flex justify-end mb-16">
                  <div className="bg-white h-12 w-12 rounded-full flex justify-center items-center">
                    <img
                      src={user?.avatar}
                      onClick={() => setShowAccountModal(true)}
                      className="h-10 w-10 cursor-pointer rounded-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-white tracking-wide">
                        My workspaces
                      </h2>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="px-4 py-1.5 bg-black border border-gray-400 rounded-lg text-sm
                       font-medium text-white hover:bg-black/5 transition">
                        Date Created
                      </button>
                      <div className="flex border border-gray-300 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode("list")}
                          className={`p-1.5 rounded transition-colors ${viewMode === "list"
                            ? "bg-gray-400 text-white shadow-sm"
                            : "text-gray-500 hover:text-black"
                            }`}
                        >
                          <CiBoxList className="text-lg" />
                        </button>
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`p-1.5 rounded transition-colors ${viewMode === "grid"
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
                    className={`w-full mt-4 ${viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                      : "flex flex-col"
                      }`}
                  >
                    {viewMode === "list" && (
                      <div className="flex items-center justify-end gap-10 text-[8px]  font-semibold text-white uppercase tracking-wider mb-3 ">
                        <div className="col-span-4"></div>

                        {/* Changed from text-center to text-left */}
                        <div className="col-span-2 text-left whitespace-nowrap">Responses</div>

                        {/* Changed from text-center to text-left */}
                        <div className="col-span-2 text-left whitespace-nowrap">Published</div>

                        {/* Changed from text-center to text-left */}
                        <div className="col-span-3 text-left whitespace-nowrap">Last Modified</div>

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
                      group bg-white backdrop-blur-sm border border-black/30 hover:border-[var(--purple)] 
                      rounded-xl shadow-sm transition-all cursor-pointer relative
                      ${viewMode === "list"
                            ? "p-4 grid grid-cols-12 items-center mt-3"
                            : "p-6 flex flex-col justify-between h-56"
                          }
                    `}
                      >
                        {viewMode === "list" ? (
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePublishMutation.mutate({ id: item.id, isPublished: !item.isPublished });
                                }}
                                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 relative z-20 ${item.isPublished
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                                  }`}
                              >
                                <div
                                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${item.isPublished
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
                              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
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
                                {moment
                                  .utc(item.createdAt)
                                  .local()
                                  .fromNow(true)}
                              </span>
                              {/* Switch (Inline JSX) */}
                              <div
                                onClick={(e) => handleToggleClick(e, item)}
                                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 relative z-20 ${item.isPublished
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                                  }`}
                              >
                                <div
                                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${item.isPublished
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
                    Are you sure you want to delete this form? This action
                    cannot be undone.
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

          <AnimatePresence>
            {showModal && (
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed inset-0 !z-[9999] flex items-center justify-center backdrop-blur-xs"
              >
                <div className="w-full max-w-5xl relative py-10 px-8 bg-black outline-1 outline-white rounded-lg fixed z-50">

                  {/* Header */}
                  <div className="flex w-full items-center justify-between mb-4">
                    <h1 className="font-vagrounded text-white text-lg ">
                      Start a new Form
                    </h1>

                    <button
                      onClick={() => setShowModal(false)}
                      className=" text-white text-md cursor-pointer"
                    >
                      X
                    </button>

                  </div>




                  <div className=" flex items-stretch justify-between gap-5 w-full min-h-[280px]">
                    {/* create own forms */}
                    <div className="flex-1 font-vagrounded ">
                      {isLoading ? (
                        <span className="w-full h-full bg-white/20 shadow-md/20 hover:scale-101 duration-400 ease flex justify-center items-center ">
                          <FaSpinner className="text-5xl text-(--green) animate-spin" />
                        </span>
                      ) : (
                        <button onClick={createFormMutation} className="relative flex flex-col items-center gap-5 justify-center w-full h-full p-6 outline-2 outline-white/50 rounded-[6px]  transition-all duration-600 ease shadow-[inset_0_0_0px_rgba(255,255,255,0)] hover:shadow-[inset_0_0_30px_rgba(245,245,245,1)] hover:scale-101">
                          <IoDocumentText size={124} fill="white" />
                          <div className="h-10 flex items-start justify-center">
                            <span className="text-white text-lg font-vagrounded font-bold">
                              Blank form
                            </span></div>
                        </button>
                      )}
                    </div>




                    {/* generate with ai */}
                    <div className="flex-1 font-vagrounded relative">
                      {!showAIInput ? (
                        <div
                          className="flex flex-col gap-3 items-center w-full h-full cursor-pointer"
                          onClick={() => setShowAIInput(true)}
                        >
                          <button className="relative flex flex-col items-center gap-5 justify-center w-full h-full p-6 outline-2 outline-white/50 rounded-[6px]  transition-all duration-600 ease shadow-[inset_0_0_0px_rgba(255,255,255,0)] hover:shadow-[inset_0_0_30px_rgba(245,245,245,1)] hover:scale-101">
                            <IoSparkles size={120} fill="white" />
                            <div className="h-10 flex items-start justify-center">
                              <span className="text-lg text-white font-vagrounded font-bold">
                                Generate with AI
                              </span>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 items-center justify-center w-full h-11/12 animate-in fade-in zoom-in duration-200">
                          <textarea
                            autoFocus
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe what you want to make ...."
                            className="w-11/12 h-full p-3 rounded-lg bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm resize-none shadow-inner"
                          />

                          <div className="flex gap-2 w-11/12">
                            <button
                              onClick={() => setShowAIInput(false)}
                              className="flex-1 py-1 rounded bg-gray-200 hover:bg-gray-300 text-md text-gray-600 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              onClick={createAiFormMutation}
                              disabled={isLoading || !aiPrompt.trim()}
                              className="flex-1 py-1 rounded bg-(--purple) text-white text-md disabled:opacity-50"
                            >
                              {isLoading ? "..." : "Generate"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 relative">
                      <button className="relative flex flex-col items-center gap-5 justify-center w-full h-full p-6 outline-2 outline-white/50 rounded-[6px]  transition-all duration-600 ease shadow-[inset_0_0_0px_rgba(255,255,255,0)] hover:shadow-[inset_0_0_30px_rgba(245,245,245,1)] hover:scale-101">
                        <IoGrid size={120} fill="white" />

                        <div className="h-10 flex items-start justify-center">
                          <span className="text-white text-lg font-vagrounded font-bold">
                            Use a template
                          </span></div>
                      </button>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {isMobile && (
        <>
          <NavBar />
          <div className=" w-full min-h-screen overflow-y-auto z-10 ">


            {/* NYAW */}
            <div className="px-10 pt-2 mt-30">
              <p className="text-5xl text-white ">
                <strong>Manage</strong> Your <br />
                Forms<strong> Here!</strong>
              </p>
              <p className="text-l mt-2 text-white">
                This is where you can view, edit, organize <br />
                all your created forms.
              </p>

              <div className="relative w-full mt-8">
                <FaMagnifyingGlass size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={` w-full text-white placeholder-gray-400 text-[12px]  py-4 pr-4 pl-10 bg-black outline rounded-xl 
          hover:bg-[#1E1E1E] transition-all ${isFocused ? 'outline-[2px] outline-green-700 bg-[#1E1E1E]' : 'outline-[#707070] '}`}
                />
              </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex flex-col items-center justify-center flex-1 min-h-full">
              <div className="px-10 py-5 w-full max-w-7xl">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-1 items-center justify-between gap-3">
                      <h2 className="text-xl font-bold text-white tracking-wide">
                        My workspace
                      </h2>
                      <button className="text-left " onClick={() => setShowModal(true)}>


                        <span className="text-white vagrounded font-semibold text-[12px] hover:text-gray-300">
                          Create Forms
                        </span>


                      </button>
                    </div>


                  </div>

                  {!isLoading && filteredForms.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-xl">
                      <FaRegFileAlt className="text-gray-300 text-4xl mb-3" />
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        No forms yet
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 mt-2">
                    {filteredForms.map((item) => (


                      <div
                        key={item.id}
                        onClick={() => navigate(`/newform/${item.id}`)}
                        className=" group bg-white border border-black/30 hover:border-[var(--purple)] rounded-xl shadow-sm transition-all cursor-pointer relative p-4 grid grid-cols-12 items-center "
                      >
                        {/* Title & Icon (Expanded to col-span-6) */}
                        <div className="col-span-6 flex items-center gap-4">
                          <div className="w-4 h-4 rounded-md flex items-center justify-center text-white">
                            <FaRegFileAlt className="text-black text-xl" />
                          </div>
                          <span className="text-[12px] font-medium text-gray-800 truncate">
                            {item.title || "Untitled"}
                          </span>
                        </div>

                        {/* Responses */}
                        <div className="col-span-2 text-center text-sm font-medium">
                          {item.responseCount || 0}
                        </div>

                        {/* Date (Expanded to col-span-3) */}
                        <div className="col-span-3 text-center text-[10px] text-gray-500">
                          {moment.utc(item.createdAt).local().fromNow()}
                        </div>

                        {/* Options Menu */}
                        <div className=" flex flex-1 items-center relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents navigating to the form
                              setOpenDropdownId(openDropdownId === item.id ? null : item.id);
                            }}
                            className="relative z-20 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <FaEllipsisV className="text-md text-gray-500" />
                          </button>

                          {/* Dropdown Content */}
                          {openDropdownId === item.id && (
                            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-2 flex flex-col">

                              {/* Publish Toggle Inside Menu */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleClick(e, item);
                                }}
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors"
                              >
                                <span className="text-sm text-gray-700 font-medium">Published</span>
                                <div
                                  className={`w-9 h-4 flex items-center rounded-full p-1 transition-colors duration-300 ${item.isPublished ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                >
                                  <div
                                    className={`bg-white w-2 h-2 rounded-full shadow-md transform transition-transform duration-300 ${item.isPublished ? "translate-x-5" : "translate-x-0"
                                      }`}
                                  />
                                </div>
                              </div>

                              <hr className="border-gray-100 my-1" />

                              {/* Delete Button Inside Menu */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(e, item.id);
                                  setOpenDropdownId(null); // Close menu after deleting
                                }}
                                className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-3 text-red-500 transition-colors group/delete"
                              >
                                <FaTrash className="text-sm group-hover/delete:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Delete Form</span>
                              </div>

                            </div>
                          )}
                        </div>
                      </div>
                    ))}      </div>
                </div>

              </div>
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
                    Are you sure you want to delete this form? This action
                    cannot be undone.
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

          {/* NEW FORM MODAL */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex fixed inset-0 p-4 !z-[9999]  items-center justify-center backdrop-blur-xs"
              >

                <div className="w-full max-w-5xl relative py-10 px-8 bg-black outline-1 outline-white rounded-lg fixed z-50">

                  {/* Header */}
                  <div className="flex w-full items-center justify-between mb-4">
                    <h1 className="font-vagrounded text-white text-md ">
                      Start a new Form
                    </h1>

                    <button
                      onClick={() => setShowModal(false)}
                      className=" text-white cursor-pointer"
                    >
                      X
                    </button>

                  </div>


                  <div className=" flex items-stretch justify-center gap-2 w-full min-h-[100px]">

                    {/* create own forms */}

                    <div className="relative flex-1 font-vagrounded ">
                      {createFormMutation.isPending ? (
                        <span className="w-full h-full bg-white/20 shadow-md/20 flex justify-center items-center rounded-[6px]">
                          <FaSpinner className="text-5xl text-(--green) animate-spin" />
                        </span>
                      ) : (
                        <button
                          onClick={() => createFormMutation.mutate()}
                          className="relative flex items-center gap-5 justify-center w-full h-full p-6 border-2 border-white rounded-[6px] shadow-md/20 hover:scale-101 flex-col duration-400 ease"
                        >
                          <IoDocumentText size={24} fill="white" />
                          <div className="h-10 flex items-start justify-center">
                            <span className="text-white text-[12px] font-vagrounded font-bold">
                              Blank form
                            </span>
                          </div>
                        </button>
                      )}
                    </div>
                    {/* generate with ai */}
                    <div className=" relative flex-1 font-vagrounded">
                      {!showAIInput ? (
                        <div
                          className="flex flex-col gap-3 items-center w-full h-full cursor-pointer"
                          onClick={() => setShowAIInput(true)}
                        >
                          <button className="relative flex p-6 items-center gap-5 justify-center w-full h-full border-2 border-white rounded-[6px] shadow-md/20 hover:scale-101 flex-col duration-400 ease">
                            <IoSparkles size={24} fill="white" />
                            <div className="h-10 flex items-start justify-center">
                              <span className="text-xs text-white font-vagrounded font-bold">
                                Generate with AI
                              </span>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 items-center justify-center w-full h-11/12 animate-in fade-in zoom-in duration-200">
                          <textarea
                            autoFocus
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe what you want to make ...."
                            className="w-11/12 h-full p-3 rounded-lg bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 text-[9px] resize-none shadow-inner"
                          />

                          <div className="flex gap-2 w-11/12">
                            <button
                              onClick={() => setShowAIInput(false)}
                              className="flex-1 py-1 rounded bg-gray-200 hover:bg-gray-300 text-[9px] text-gray-600 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              onClick={createAiFormMutation}
                              disabled={isLoading || !aiPrompt.trim()}
                              className="flex-1 py-1 rounded bg-(--purple) text-black text-[9px] disabled:opacity-50"
                            >
                              {isLoading ? "..." : "Generate"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className=" relative flex-1 font-vagrounded">
                      <button className="relative p-4 flex  items-center gap-5 justify-center w-full h-full border-2 border-white rounded-[6px] shadow-md/20 hover:scale-101 flex-col duration-400 ease">
                        <IoGrid size={24} fill="white" />

                        <div className="h-10 flex items-start justify-center">
                          <span className="text-white text-xs font-vagrounded font-bold">
                            Use a template
                          </span></div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default Workspaces;
