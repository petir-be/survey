import React from "react";

function Page() {
  return (
    <>
      <div className="w-full px-7">
        <h1 className="text-xl text-left font-vagrounded">Page 1</h1>
      </div>
      <div className="w-[600px] h-[330px] flex justify-center bg-[#DFE0F0] items-center border-gradient pageBorder drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] ">
        <p>Drag and Drop From Left Side</p>
      </div>
    </>
  );
}

export default Page;
