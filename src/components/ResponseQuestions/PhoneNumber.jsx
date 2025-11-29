import React, { useEffect, useState } from "react";
import { PH } from "country-flag-icons/react/3x2";

function PhoneNumber({ question, onChange, value = "" }) {

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    setPhone(value);
  }, [value])

  const handleChange = (e) => {
    let val = e.target.value;

    // Remove any non-digit characters
    val = val.replace(/\D/g, "");

    setPhone(val);

    if (val.length > 10) val = val.slice(0, 10);

    setPhone(val);

    if (val.length === 10 || val.length === 0) {
      setError("");
      onChange(val);
    } else {
      setError("Please enter valid phone number");
    }
  };

 

  return (
    <div className="my-6">
        <p className="text-lg mb-3">{question.question}</p>
     
      <div className="space-y-2">
        <div className="flex items-center px-3 py-1 bg-[var(--dirty-white)] border-b-2 border-b-[var(--black)] text-lg focus-within:border-[var(--purple)] focus:outline-none">
          <PH className="w-7 h-7 mr-2" />{" "}
          <p className="text-(--black) font-vagrounded">(+63)</p>
          <input
            type="tel"
            value={phone}
            onChange={handleChange}
            className="w-full placeholder:italic placeholder:text-gray-400 focus:outline-none px-2 py-1 overflow-hidden"
            placeholder="Enter 10-digit number"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm font-vagrounded">{error}</p>
        )}
      </div>
    </div>
  );
}

export default PhoneNumber;
