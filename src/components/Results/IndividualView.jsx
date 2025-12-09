import AnswerRenderer from "./AnswerRenderer";

function formatDateTime(isoString) {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} · ${formattedTime}`;
}

function IndividualView({ response, formData }) {
  return (
    <div className="max-w-4xl m-auto p-4 overflow-y-auto h-auto">
      <div className="flex justify-between mb-10 pb-6 border-b-1 border-gray-300">
        <h2
          style={{ marginTop: 0 }}
          className="text-3xl font-bold font-vagrounded"
        >
          {response.respondent.name}
        </h2>
        <h3 style={{ marginTop: 0 }} className="text-xl font-vagrounded">
          {response.respondent.email}
        </h3>

        {console.log(formData)}
        {console.log(response)}
      </div>

      <div className="flex justify-between mb-10 pb-6 border-b-1 border-gray-300">
        <p>{formatDateTime(response.submittedAt)}</p>
      </div>

      <div className="formData flex flex-col gap-5">
        {formData.map((section) =>
          (section.questions ?? []).map((question) => {
            if (question.type == "heading")
              return (
                <h2
                  style={{ marginTop: 0 }}
                  className="text-2xl font-bold font-vagrounded"
                >
                  {question.question ? question.question : null}
                </h2>
              );

            if (question.question == "" || !question.question) return;

            const matchedAnswer = response.responseData.find(
              (item) => item.questionID === question.id
            );

            return (
              <div
                key={question.id}
                className="border border-white shadow-xl rounded-lg flex flex-col p-6"
              >
                <h2 className="font-vagrounded">
                  <b>Question:</b> {question.question}
                </h2>

                <div className="mt-2">
                  <span>
                    <b>Answer: </b>
                  </span>
                  <AnswerRenderer answer={matchedAnswer?.answer} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default IndividualView;
