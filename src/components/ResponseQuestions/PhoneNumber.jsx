import React, { useEffect, useState } from "react";
import { PH } from "country-flag-icons/react/3x2";
import { IoAlertCircle } from "react-icons/io5";

function PhoneNumber({ question, onChange, value = "", hasError }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPhone(value);
  }, [value]);

  const handleChange = (e) => {
    let val = e.target.value;

    // Remove any non-digit characters
    val = val.replace(/\D/g, "");

    setPhone(val);

    if (val.length > 11) val = val.slice(0, 11);

    onChange(val);
    setPhone(val);

    if (val.length === 10 || val.length === 11 || val.length === 0) {
      setError("");
      onChange(val);
    } else {
      setError("Please enter valid phone number");
    }
  };

  return (
    <div
      className="form-element-container group outline-none"
      tabIndex={0}

    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 flex items-start gap-3">
          <p className="w-full font-vagrounded font-bold text-xl text-white">
            {question.question}{" "}
            {question.required &&
              <span className="text-red-600"> *</span>
            }
          </p>

        </div>
      </div>

      <div className="space-y-3 mt-4 group/item relative">
        <div className="flex items-center px-3 py-1 bg-transparent border-b-2 border-b-[var(--black)] text-lg focus-within:border-green-600 focus:outline-none">
          <PH className="w-7 h-7 mr-2" />{" "}
          <p className="text-(--black) font-vagrounded">(+63)</p>
          <input
            type="tel"
            value={phone}
            onChange={handleChange}
            className="w-full text-white placeholder:italic placeholder:text-gray-400 focus:outline-none px-2 py-1 overflow-hidden"
            placeholder="Enter 10-digit number"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm font-vagrounded">{error}</p>
        )}
      </div>
      {hasError && (
        <div className="flex items-center font-vagrounded gap-1 my-2">
          <IoAlertCircle className="fill-red-500 text-xl" />
          <span className="text-md text-red-500">This field is required.</span>
        </div>
      )}
    </div>
  );
}

export default PhoneNumber;
