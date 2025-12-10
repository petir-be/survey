import { AnswerRenderer } from "./AnswerRenderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DetailedResponsePDF from "../PDF/DetailedResponsePDF";
import moment from "moment";

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
      <div className="flex justify-between">
        <h2
          style={{ marginTop: 0 }}
          className="text-3xl font-bold font-vagrounded"
        >
          {response.respondent.name}
        </h2>
        <PDFDownloadLink
          document={
            <DetailedResponsePDF response={response} formData={formData} />
          }
          fileName={`response_${response.respondent.name}.pdf`}
          className="p-2 hover:font-bold flex gap-1 text-slate-600 cursor-pointer"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
        </PDFDownloadLink>
      </div>

      <h3 style={{ marginTop: 0 }} className="font-vagrounded mt-2">
        {response.respondent.email}
      </h3>

      <p className="font-vagrounded mb-5 pb-6 border-b-1 border-gray-300">
        {moment.utc(response.submittedAt).local().format("MMMM d, yyyy")} -{" "}
        {moment.utc(response.submittedAt).local().format("hh:mm A")}
      </p>

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

            if (question.type == "paragraph")
              return (
                <h2 style={{ marginTop: 0 }} className="font-vagrounded">
                  {question.question ? question.question : null}
                </h2>
              );

            if (question.question == "" || !question.question) return;

            const matchedAnswer = response.responseData.find(
              (item) => item.questionID === question.id
            );

            console.log(matchedAnswer.answer);

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
