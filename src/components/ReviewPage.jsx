function ReviewPage({ pages, answers }) {
  return (
    <div className="flex flex-col font-vagrounded w-full h-full">
      <div className="py-7 mb-4">
        <p className="text-3xl font-bold text-gray-800">Review Submission</p>
        <p className="text-lg text-gray-500">
          Please verify your answers before submitting.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {pages.map((page, pageIndex) => (
          <div key={pageIndex} className="mb-8">
            <h3 className="text-xl font-bold  mb-3 border-b-(--dirty-white) border-b pb-3">
              {page.title || `Page ${pageIndex + 1}`}
            </h3>
            <div className=" p-4 space-y-4">
              {page.questions.map((q) => {
                // Find the answer for this specific question
                const answerObj = answers.find((a) => a.questionID === q.id);
                const displayAnswer = answerObj ? answerObj.answer : "Unanswered";

                return (
                  <div
                    key={q.id}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-3 "
                  >
                    <div className="md:col-span-2 font-medium text-gray-700 w-3/4  truncate">
                      {q.question}
                    </div>
                    <div className={`md:col-span-1 font-bold  break-words ${displayAnswer === "Unanswered" ? "text-gray-500 italic" : "text-gray-900 normal"}`}>
                      {displayAnswer.toString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewPage;
