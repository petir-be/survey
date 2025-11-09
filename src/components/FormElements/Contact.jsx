import React from "react";

function Contact({ question, onUpdate }) {
  return (
    <div className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <input
            type="text"
            value={question.question || ""}
            onChange={(e) =>
              onUpdate(question.id, { question: e.target.value })
            }
            className="w-full font-medium text-lg border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
            placeholder="Enter your question"
          />
          <p className="text-sm text-gray-500 mt-1">
            Type: {question.type || "contact"}
          </p>
        </div>
      </div>

      <div className="space-y-2 mt-3">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
          disabled
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
          disabled
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
          disabled
        />
      </div>
    </div>
  );
}

export default Contact;
