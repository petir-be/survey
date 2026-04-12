import React, { useEffect, useState } from "react";
import { IoDuplicate, IoMail } from "react-icons/io5";
import { IoAlertCircle } from "react-icons/io5";

function Email({ question, onChange, value = "", hasError }) {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setEmail(val);

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

    if (val === "" || emailRegex.test(val)) {
      setError("");
      onChange(val);
    } else {
      setError("Please enter a valid email address");
    }
  };

  return (
    <div className="form-element-container group">
      {/* Question */}
      <div className="flex justify-between items-start mb-1">
        <p className="w-full font-vagrounded font-bold text-xl bg-transparent text-white">
          {question.question || "Enter your email address"}
          {question.required && (
            < span className="text-red-600"> *</span>
          )}
        </p>
      </div>

      <div className="space-y-2 mt-3 group relative">
        {/* Input Container */}
        <div
          className="flex items-center  py-1 transition-all duration-300 bg-zinc-950/40 border-b border-zinc-800 
            hover:border-emerald-500/30 focus-within:border-emerald-500/50"
        >
          <IoMail className="text-3xl text-white" />

          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="ispecmn@gmail.com"
            className="w-full bg-transparent text-zinc-300  placeholder:text-zinc-500 focus:outline-none px-2 py-1 overflow-hidden"
          />
        </div>

        {/* Local Validation Error */}
        {error && (
          <p className="text-red-400 text-sm font-vagrounded mt-1">{error}</p>
        )}

        {/* Form Submission Error */}
        {hasError && (
          <div className="flex items-center font-vagrounded gap-1 mt-2">
            <IoAlertCircle className="fill-red-500 text-xl" />
            <span className="text-sm font-bold tracking-wide uppercase text-red-500/90">
              This field is required.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Email;