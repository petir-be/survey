import { useEffect, useState, useMemo, useRef } from "react";
import { toPng } from "html-to-image";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SummaryPDF from "../PDF/SummaryPDF";
import MultipleChoiceBarChart from "../Charts/MultipleChoiceBarChart";
import ChoiceMatrixBarChart from "../Charts/ChoiceMatrixBarChart";

// Helper function to aggregate responses by question and option
const aggregateResponseData = (parentResponses, formData) => {
  const aggregated = {};
  let total = 0;
  console.log(formData);
  console.log(parentResponses);

  // Initialize structure with questions from formData
  formData.forEach((page) => {
    page.questions.forEach((question) => {
      if (question.type === "multiple_choice" && question.options) {
        aggregated[question.id] = {
          question: question.question,
          type: question.type,
          options: {},
          total: 0,
        };
        // console.log("FUCKKk" + JSON.stringify(question));
        // Initialize each option with 0 count
        question.options.forEach((option) => {
          aggregated[question.id].options[option] = 0;
        });
      } else if (question.type === "choice_matrix" && question.rows) {
        aggregated[question.id] = {
          question: question.question,
          type: question.type,
          rows: {},
          total: 0,
        };

        // For each row, create an object with all columns initialized to 0
        question.rows.forEach((row) => {
          aggregated[question.id].rows[row] = {};
          question.columns.forEach((columnName) => {
            // console.log(aggregated[question.id].rows);

            aggregated[question.id].rows[row][columnName] = 0;
          });
        });
      } else if (question.type === "checkbox" && question.options) {
        aggregated[question.id] = {
          question: question.question,
          type: question.type,
          options: {},
          total: 0,
        };

        // Initialize each option with 0 count
        question.options.forEach((option) => {
          aggregated[question.id].options[option] = 0;
        });
      } else if (question.type === "dropdown" && question.options) {
        aggregated[question.id] = {
          question: question.question,
          type: question.type,
          options: {},
          total: 0,
        };

        // Initialize each option with 0 count
        question.options.forEach((option) => {
          aggregated[question.id].options[option] = 0;
        });
      } else if (question.type === "switch") {
        aggregated[question.id] = {
          question: question.question,
          type: question.type,
          options: {
            True: 0,
            False: 0,
          },
          total: 0,
        };
      }
    });
  });

  // console.log(aggregated);

  // Count responses for each option
  parentResponses.forEach((response) => {
    if (!response.responseData) return;

    let data = response.responseData;

    // console.log(data);
    // Handle if responseData is a string (needs parsing)
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse responseData:", e);
        return;
      }
    }

    // Process each answer in the response
    Object.entries(data).forEach(([index, answer]) => {
      try {
        let questionId = answer["questionID"];

        // Add this check BEFORE accessing aggregated[questionId]
        if (!aggregated[questionId]) {
          // console.warn(
          //   `Question ID ${questionId} not found in formData. Skipping...`
          // );
          // console.warn(answer);
          return; // Skip this answer
        }

        let questionType = aggregated[questionId].type;

        if (aggregated[questionId] && answer) {
          aggregated[questionId].total++;

          if (questionType == "multiple_choice") {
            if (aggregated[questionId].options.hasOwnProperty(answer.answer)) {
              aggregated[questionId].options[answer.answer]++;
            } else {
              // Handle edge case where answer doesn't match predefined options
              aggregated[questionId].options[answer.answer] = 1;
            }
          } else if (questionType === "choice_matrix") {
            // console.log(questionId);
            // console.log(answer);

            Object.entries(answer.answer).forEach(([rowName, columnName]) => {
              if (
                aggregated[questionId].rows[rowName] &&
                aggregated[questionId].rows[rowName][columnName] !== undefined
              ) {
                aggregated[questionId].rows[rowName][columnName]++;
              }
            });
          } else if (questionType === "checkbox") {
            if (aggregated[questionId].options.hasOwnProperty(answer.answer)) {
              answer.answer.forEach((checkboxAnswer) => {
                aggregated[questionId].options[checkboxAnswer]++;
              });
            } else {
              // Handle edge case where answer doesn't match predefined options
              answer.answer.forEach((checkboxAnswer) => {
                aggregated[questionId].options[checkboxAnswer] = 1;
              });
            }
          } else if (questionType === "dropdown") {
            if (aggregated[questionId].options.hasOwnProperty(answer.answer)) {
              aggregated[questionId].options[answer.answer]++;
            } else {
              // Handle edge case where answer doesn't match predefined options
              aggregated[questionId].options[answer.answer] = 1;
            }
          } else if (questionType === "switch") {
            if (answer.answer) {
              aggregated[questionId].options.True++;
            } else {
              aggregated[questionId].options.False++;
            }
          }

          total += 1;
        }
      } catch (e) {
        console.error("Error processing answer:", e, "Answer:", answer);
      }
    });
  });

  // console.log("aggregated: ");
  // console.log(aggregated);

  return [aggregated, total];
};

// Main Summary Component
function SummaryView({
  parentResponses,
  formData,
  setChartImages,
  chartImages,
  formTitle,
}) {
  const [summaryData, setSummaryData] = useState({});
  const chartRefs = useRef({}); // store refs by questionId
  const hasExportedRef = useRef(false);
  let total = 0;

  const handleExport = async () => {
    const images = [];

    for (const questionId of Object.keys(summaryData)) {
      const node = chartRefs.current[questionId];
      if (node) {
        try {
          const dataUrl = await toPng(node, { cacheBust: true });
          images.push({ questionId, dataUrl });
        } catch (err) {
          console.error("Error exporting chart", questionId, err);
        }
      }
    }

    setChartImages(images); // save all chart images
  };

  useEffect(() => {
    if (parentResponses && formData) {
      // console.log(responses);
      const [aggregated, total] = aggregateResponseData(
        parentResponses,
        formData
      );

      setSummaryData(aggregated);
      // console.log(aggregated);
    }
  }, [parentResponses, formData]);

  useEffect(() => {
    if (Object.keys(summaryData).length === 0 || hasExportedRef.current) {
      return;
    }

    // Ensure charts are rendered before capture
    const timeout = setTimeout(() => {
      handleExport();
      hasExportedRef.current = true;
    }, 700);

    return () => clearTimeout(timeout);
  }, [summaryData]);

  if (!parentResponses || !formData) {
    return <div>Loading summary...</div>;
  }

  if (Object.keys(summaryData).length === 0) {
    return <div>No multiple choice questions found or no responses yet.</div>;
  }

  console.log(summaryData)

  return (
    <div className="max-w-4xl m-auto overflow-y-auto h-auto p-4">
      <div className="flex justify-between mb-10 pb-6 border-b-1 border-gray-300">
        <h2
          style={{ marginTop: 0 }}
          className="text-3xl font-bold font-vagrounded"
        >
          Summary
        </h2>
        {chartImages.length > 0 && (
          <PDFDownloadLink
            document={
              <SummaryPDF
                chartImages={chartImages}
                formTitle={formTitle}
                aggregated={summaryData}
              />
            }
            fileName="charts.pdf"
            className="p-2 hover:font-bold flex gap-1 text-slate-600 cursor-pointer"
          >
            {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
          </PDFDownloadLink>
        )}
      </div>

      <div className="questions flex flex-col gap-6 w-auto">
        {Object.entries(summaryData).map(([questionId, data]) => {
          let questionType = data.type;
          return (
            <div
              className="border-1 border-white shadow-xl rounded-lg flex flex-col p-4"
              key={questionId}
              id={questionId}
              ref={(el) => (chartRefs.current[questionId] = el)}
            >
              {/* {console.log(data)} */}
              <h3 className="text-lg font-bold">{data.question}</h3>
              <p className="mb-10 text-sm text-gray-500">
                There were {data.total} responses to this question
              </p>

              {questionType === "multiple_choice" ? (
                <MultipleChoiceBarChart data={data} />
              ) : questionType === "choice_matrix" ? (
                <ChoiceMatrixBarChart data={data} />
              ) : questionType === "checkbox" ? (
                <MultipleChoiceBarChart data={data} />
              ) : questionType === "dropdown" ? (
                <MultipleChoiceBarChart data={data} />
              ) : questionType === "switch" ? (
                <MultipleChoiceBarChart data={data} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SummaryView;
