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

                if (q.type === "heading" || q.type === "paragraph") {
                  return;
                }
                const answerObj = answers.find((a) => a.questionID === q.id);
                const displayAnswer = answerObj
                  ? answerObj.answer === "" ? "Unanswered" : answerObj.answer
                  : "Unanswered";

                //for choice matrix shit
                if (q.type === "choice_matrix") {
                  if (displayAnswer === "Unanswered") {
                    return (
                      // Render the question and "Unanswered" message in the single-row format
                      <div
                        key={q.id}
                        className="grid grid-cols-1 md:grid-cols-3 mb-2 pb-3 "
                      >
                        <div className="md:col-span-2 font-medium text-gray-700 w-3/4 truncate">
                          {q.question}
                        </div>
                        <div className="md:col-span-1 font-bold text-gray-500 italic break-words">
                          Unanswered
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={q.id} className="pb-3 mb-4">
                      {/* Main Question/Title of the Matrix */}
                      <div className="font-medium text-gray-700 mb-2">
                        {q.question}
                      </div>

                      {Object.entries(displayAnswer).map(
                        ([rowKey, rowValue]) => (
                          <div
                            key={rowKey}
                            className="grid grid-cols-1 md:grid-cols-3 mb-2 pb-1 text-sm text-gray-700"
                          >
                            <div className="md:col-span-2 font-medium truncate pl-0 md:pl-4">
                              {rowKey}
                            </div>

                            <div
                              className={`md:col-span-1 font-semibold ${
                                rowValue.toString() === "Unanswered"
                                  ? "italic text-gray-500"
                                  : "text-gray-700"
                              } break-words`}
                            >
                              {rowValue.toString()}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  );

                  // not choice matrix shit
                } else {
                  return (
                    <div
                      key={q.id}
                      className="grid grid-cols-1 md:grid-cols-3 pb-3 "
                    >
                      <div className="md:col-span-2 font-medium text-gray-700 w-3/4  truncate">
                        {q.question}
                      </div>
                      <div
                        className={`md:col-span-1 font-bold break-words ${
                          displayAnswer === "Unanswered"
                            ? "text-gray-500 italic"
                            : "text-gray-900 normal"
                        }`}
                      >
                        {q.type === "switch"
                          ? displayAnswer === "Unanswered"
                            ? "false"
                            : displayAnswer.toString()
                          : displayAnswer.toString()}

                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewPage;
