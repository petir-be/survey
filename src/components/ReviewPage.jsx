import React from "react";

function ReviewPage() {
  return (
    <div className="flex flex-col font-vagrounded">
      <div className="py-7 border-b border-b-(--dirty-white)">
        <p className="text-3xl">Please review your submission</p>
        <p className="text-lg text-gray-500">Make sure answers are correct</p>
      </div>
    </div>
  );
}

export default ReviewPage;
