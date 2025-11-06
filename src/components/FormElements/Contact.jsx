import React from "react";

function Contact({ element }) {
  return (
    <div>
      <div>
        <p>Type your question here</p>
        <p>{element.title}</p>
      </div>
      <div>
        <input type="text" className="border-2 border-red-500" />
      </div>
    </div>
  );
}

export default Contact;
