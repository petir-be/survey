import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useContext, useRef } from "react"; // Added useRef
import toast from "react-hot-toast";
import axios from "axios";
import { FaCamera, FaEye, FaEyeSlash, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../Context/authContext";
import { useNavigate } from "react-router";
import Modal from "./Modal";
export default function AccountModal({ isOpen, close, title, dialogbox }) {
  const [activeTab, setActiveTab] = useState("General");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference for hidden input
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Access logout function from Context
  const { user, logout } = useContext(AuthContext); // You might need a setUser here to update context locally

  const [avatarPreview, setAvatarPreview] = useState(null); // For immediate preview
  const [displayName, setDisplayName] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name);
      setAvatarPreview(user.avatar); // Initialize with current avatar
    }
  }, [user]);

  const tabs = ["General", "Security", "Danger"];

  // --- AVATAR HANDLER ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Check size (limit to 2MB to prevent DB bloat)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }

      // 2. Convert to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // Show preview immediately
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneralSave = async () => {
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      // Send both Name and Avatar (if changed)
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND}/api/User/update-profile`,
        {
          name: displayName,
          avatar: avatarPreview, // Send the Base64 string
        },
        { withCredentials: true }
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePassChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSecuritySave = async () => {
    // 1. Basic Validation
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // 2. API Call
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND}/api/User/change-password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        { withCredentials: true } // Crucial for passing the HttpOnly cookie
      );

      // 3. Success Handling
      toast.success(res.data.message);

      // Clear fields
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      // 4. Error Handling (Display backend message like "Incorrect current password")
      const msg = error.response?.data?.message || "Failed to update password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/User/logout`,
        {}, // Empty body
        { withCredentials: true }
      );

      logout();

      toast.success("Logged out successfully");
      close();
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);

      logout();
      close();
      navigate("/login");
    }
  };

  const requestDelete = () => {
    setIsDeleteModalOpen(true);
  };
  const confirmDeleteAccount = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND}/api/User/delete-account`,
        { withCredentials: true }
      );

      toast.success(res.data.message || "Account deleted successfully");

      // Cleanup
      if (logout) logout();
      setIsDeleteModalOpen(false); // Close confirmation
      close(); // Close main account modal
      navigate("/");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to delete account";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onClose={close} className="relative z-50">
      <div
        className="fixed inset-0 backdrop-blur-md bg-black/60 transition-opacity" aria-hidden="true"
      />

      <div
        className={`fixed z-50 flex items-center justify-center p-4 ${dialogbox
          ? "inset-0"
          : "w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          }`}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <DialogPanel className="rounded-2xl bg-zinc-950 p-8 shadow-2xl border border-zinc-800 backdrop-blur-xl">
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="relative group">
                    <div className="rounded-full bg-zinc-900 w-24 h-24 shadow-inner border-2 border-green-600 flex items-center justify-center text-3xl font-bold text-green-600 uppercase overflow-hidden transition-all group-hover:border-green-800">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <p>{user?.name?.charAt(0) || "U"}</p>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-0 right-0 bg-green-700 p-2.5 rounded-full shadow-lg text-white hover:bg-green-800 transition-all transform hover:scale-110 border-2 border-zinc-950">
                      <FaCamera className="text-sm" />
                    </button>
                  </div>

                  <DialogTitle className="text-xl font-semibold text-zinc-100 tracking-tight">
                    {title || "Account Settings"}
                  </DialogTitle>
                </div>

                <div className="relative flex w-full bg-zinc-900 p-1 rounded-xl mb-8 border border-zinc-800">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={` relative flex-1 py-2 text-xs font-bold rounded-lg z-10 transition-all duration-300 uppercase tracking-wider
                     ${activeTab === tab ? "text-black" : "text-zinc-500 hover:text-zinc-300"}
                      `}
                    >
                      {activeTab === tab && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-green-700 rounded-lg -z-10 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="min-h-[200px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* GENERAL TAB */}
                      {activeTab === "General" && (
                        <div className="flex flex-col gap-4">
                          <div>
                            <label className="text-[10px] font-black text-green-600 uppercase tracking-widest ml-1">
                              Display Name
                            </label>
                            <input
                              type="text"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="Enter your name"
                              className="w-full p-3 mt-1.5 rounded-xl border border-zinc-800   focus:ring-2 focus:ring-green-800 outline-none bg-zinc-900 text-zinc-100 transition-all placeholder:text-zinc-600" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={user?.email || ""}
                              disabled
                              className="w-full p-3 mt-1.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-500 cursor-not-allowed opacity-60" />
                            <p className="text-[10px] text-gray-400 mt-1 ml-1">
                              Email cannot be changed
                            </p>
                          </div>
                          <button
                            onClick={handleGeneralSave}
                            disabled={loading}
                            className="w-full mt-2 py-3 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      )}

                      {activeTab === "Security" && (
                        <div className="flex flex-col gap-4">
                          <div>
                            <label className="text-[10px] font-black text-green-600 uppercase tracking-widest ml-1">
                              Current Password
                            </label>
                            <input
                              name="currentPassword"
                              type="password"
                              value={passwords.currentPassword}
                              onChange={handlePassChange}
                              className="w-full p-3 mt-1.5 rounded-xl border border-zinc-800 focus:border-green-700 outline-none bg-zinc-900 text-zinc-100 transition-all" />
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">New</label>
                              <div className="relative">
                                <input
                                  name="newPassword"
                                  type={showNewPassword ? "text" : "password"}
                                  value={passwords.newPassword}
                                  onChange={handlePassChange}
                                  className="w-full p-3 mt-1.5 rounded-xl border border-zinc-800 focus:border-green-700 outline-none bg-zinc-900 text-zinc-100 transition-all" />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                  className="absolute right-3 top-5 text-zinc-500 hover:text-green-600">
                                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                            </div>
                            <div className="flex-1">
                              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirm</label>
                              <div className="relative">
                                <input
                                  name="confirmPassword"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  value={passwords.confirmPassword}
                                  onChange={handlePassChange}
                                  className={`w-full p-3 mt-1.5 rounded-xl border outline-none bg-zinc-900 text-zinc-100 transition-all ${passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-zinc-800 focus:border-green-700"
                                    }`}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  className="absolute right-3 top-4 translate-y-1/6 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                  {showConfirmPassword ? (
                                    <FaEyeSlash />
                                  ) : (
                                    <FaEye />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleSecuritySave}
                            disabled={loading}
                            className="w-full mt-2 py-3 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"                          >
                            {loading ? "Updating..." : "Update Password"}
                          </button>
                        </div>
                      )}

                      {activeTab === "Danger" && (
                        <div className="flex flex-col gap-4 pt-2">
                          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                            <h4 className="text-red-500 font-bold text-sm">Delete Account</h4>
                            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                              Permanently remove your account and all of its
                              contents. This action is not reversible.
                            </p>
                          </div>
                          <button
                            onClick={requestDelete}
                            disabled={loading}
                            className="w-full py-3 bg-transparent border border-red-500/50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"                          >
                            {loading ? "Deleting..." : "Delete Account"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-between items-center pt-6 border-t border-zinc-800/50">
                  <button
                    onClick={handleLogout}
                    className="text-xs text-zinc-500 hover:text-red-400 font-bold flex items-center gap-2 transition-colors uppercase tracking-widest"                  >
                    <FaSignOutAlt /> Logout
                  </button>
                  <button
                    onClick={close}
                    className="text-xs text-zinc-400 font-bold px-6 py-2 rounded-lg hover:text-white hover:bg-zinc-900 transition-all uppercase tracking-widest"                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        close={() => setIsDeleteModalOpen(false)}
        title="Delete Account?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-gray-600">
            Are you absolutely sure? This action cannot be undone. All your
            forms, responses, and personal data will be permanently removed.
          </p>

          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-bold transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteAccount}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Deleting..." : "Yes, Delete Everything"}
            </button>
          </div>
        </div>
      </Modal>
    </Dialog>
  );
}
