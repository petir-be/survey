import React, { useEffect, useState } from "react";
import { IoDuplicate, IoMail } from "react-icons/io5";

function Email({ question, onChange, value = "" }) {
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
    <div className="my-6">
      <p className="text-lg mb-3">
        {question.question || "Enter your email address"}
      </p>

      <div className="space-y-2 group relative">
        <div className="flex items-center px-3 py-1 bg-(--dirty-white) border-b-2 border-b-(--black) text-lg focus-within:border-(--purple) focus:outline-none">
          <IoMail className="text-3xl" fill="#212529" />

          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full placeholder:italic placeholder:text-gray-400 focus:outline-none px-2 py-1 overflow-hidden"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm font-vagrounded">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Email;
