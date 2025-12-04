import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { FaArrowDown, FaCross, FaDownload, FaFile } from "react-icons/fa6";

import ResponsesNavbar from "../components/ResponsesNavbar";
import SearchBar from "../components/SearchBar";
import MultipleChoiceBarChart from "../components/Charts/MultipleChoiceBarChart";

function Results({ defaultFormName = "Form" }) {
  const { id } = useParams();

  const [SearchBarValue, setSearchBarValue] = useState("");
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("responses");

  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [summary, setSummary] = useState();
  const [questions, setQuestions] = useState();
  const [formName, setFormName] = useState(defaultFormName);
  const [formData, setFormData] = useState();

  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(responses.map((r) => r.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckItem = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
      setSelectAll(false);
    } else {
      const newChecked = [...checkedItems, id];
      setCheckedItems(newChecked);
      if (newChecked.length === responses.length) {
        setSelectAll(true);
      }
    }
  };

  useEffect(() => {
    const getResponses = async () => {
      try {
        const aggregated = {};
        setLoading(true);

        const surveyId = parseInt(id, 10);

        if (isNaN(surveyId)) {
          setError("Invalid survey ID");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/Response/responses/${surveyId}`,
          {
            withCredentials: true,
          }
        );

        const formDetails = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/Form/${surveyId}`,
          {
            withCredentials: true,
          }
        );

        // console.log("Form Details:", formDetails.data); // Debug log

        setResponses(res.data);
        setFormData(formDetails.data.formData);
        setError(null);

        // Fix: Access formDetails.data.title
        setFormName(formDetails.data.title);

        // Fix: Build question mapping correctly
        const questionMap = {};
        formDetails.data.formData.forEach((page) => {
          page.questions.forEach((question) => {
            // Use question.id as key and question.question as value
            questionMap[question.id] = question.question;
          });
        });

        // console.log("Question Map:", questionMap); // Debug log
        setQuestions(questionMap);

        // Rest of your aggregation code
        res.data.forEach((response) => {
          if (!response.responseData) return;

          let data = response.responseData;
          if (typeof data === "string") {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error("Failed to parse responseData:", e);
              return;
            }
          }

          Object.keys(data).forEach((questionId) => {
            const answer = data[questionId];

            if (!aggregated[questionId]) {
              aggregated[questionId] = {
                answers: {},
                total: 0,
                allAnswers: [],
              };
            }

            aggregated[questionId].total++;
            aggregated[questionId].allAnswers.push(answer);

            if (answer && typeof answer === "string" && answer.length < 100) {
              aggregated[questionId].answers[answer] =
                (aggregated[questionId].answers[answer] || 0) + 1;
            }
          });
        });

        // Aggregate
        setSummary(aggregated);
        // console.log("Summary:", aggregated); // Debug log
      } catch (err) {
        console.error("Full error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch responses"
        );
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getResponses();
    }
  }, [id]);

  return (
    <>
      <ResponsesNavbar formName={formName} id={id} />

      <div className="m-auto mt-30 p-4 font-vagrounded">
        {/* Tab Buttons */}
        <div
          style={{
            display: "flex",
            gap: "0px",
            borderBottom: "2px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => setActiveTab("responses")}
            className="font-vagrounded"
            style={{
              padding: "12px 24px",
              background: activeTab === "responses" ? "#CCCDD9" : "transparent",
              color: activeTab === "responses" ? "black" : "#6b7280",
              border: "white 1px solid",
              borderBottom: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s",
              borderRadius: "12px 0px 0px 0px",
            }}
          >
            Responses <span className="text-red-500">({responses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("individual")}
            className="font-vagrounded"
            style={{
              padding: "12px 24px",
              background:
                activeTab === "individual" ? "#CCCDD9" : "transparent",
              color: activeTab === "individual" ? "black" : "#6b7280",
              border: "white 1px solid",
              borderBottom: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s",
              borderRadius: "0px 0px 0px 0px",
            }}
          >
            Individual
          </button>

          <button
            onClick={() => setActiveTab("summary")}
            className="font-vagrounded"
            style={{
              padding: "12px 24px",
              background: activeTab === "summary" ? "#CCCDD9" : "transparent",
              color: activeTab === "summary" ? "black" : "#6b7280",
              border: "white 1px solid",
              borderBottom: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s",
              borderRadius: "0px 12px 0px 0px",
            }}
          >
            Summary
          </button>
        </div>

        {/* Loading/Error */}
        {loading && (
          <p
            style={{ textAlign: "center", fontSize: "18px" }}
            className="font-vagrounded"
          >
            Loading responses...
          </p>
        )}
        {error && (
          <p
            style={{ color: "red", textAlign: "center", fontSize: "16px" }}
            className="font-vagrounded"
          >
            Error: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {activeTab === "responses" && (
              <div>
                <div className="w-full m-auto bruh p-6">
                  <SearchBar
                    value={SearchBarValue}
                    onChange={(e) => setSearchBarValue(e.target.value)}
                  />
                </div>

                {responses && responses.length > 0 ? (
                  <div className="w-full p-6 min-h-screen">
                    <div className="rounded-lg overflow-hidden">
                      <table className="w-full border-separate border-spacing-x-0 border-spacing-y-4">
                        <thead className="shadow-md font-vagrounded">
                          <tr
                            className="outline-1 outline-white border-box "
                            style={{ background: "var(--dirty-white)" }}
                          >
                            <th className="text-left font-vagrounded align-middle">
                              <div className="py-4 px-4 border-l border-r border-white">
                                <input
                                  type="checkbox"
                                  className="pretty-checkbox"
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                />
                              </div>
                            </th>
                            <th className="text-left text-sm font-medium text-gray-700 font-vagrounded">
                              <div className="py-4 px-4 border-l border-r border-white font-bold">
                                <button className="hover:bg-white rounded-full p-2">
                                  <FaArrowDown />
                                </button>
                              </div>
                            </th>
                            <th className="text-left text-sm font-medium text-gray-700 font-vagrounded">
                              <div className="py-4 px-4 border-l border-r border-white font-bold">
                                Name
                              </div>
                            </th>
                            <th className="text-left text-sm font-medium text-gray-700 font-vagrounded">
                              <div className="py-4 px-4 border-l border-r border-white font-bold">
                                Email
                              </div>
                            </th>
                            <th className="text-left text-sm font-medium text-gray-700 font-vagrounded ">
                              <div className="py-4 px-4 border-l border-r border-white font-bold">
                                Date
                              </div>
                            </th>
                            <th className="text-left text-sm font-medium text-gray-700 font-vagrounded ">
                              <div className="py-4 px-4 border-l border-r border-white font-bold">
                                Time
                              </div>
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {responses.map((row, index) => {
                            const d = new Date(row.submittedAt);
                            const date = d.toISOString().split("T")[0];
                            const time = d
                              .toISOString()
                              .split("T")[1]
                              .slice(0, 8);

                            return (
                              <tr
                                key={row.id}
                                className="border-b border-white outline-1 outline-white hover:bg-gray-50 transition-colors shadow-md rounded-sm"
                              >
                                {/* Checkbox column — border on inner div */}
                                <td className="align-middle font-vagrounded">
                                  <div className="py-4 px-4 border-l border-r border-white">
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 border-gray-300 pretty-checkbox row-checkbox"
                                      checked={checkedItems.includes(row.id)}
                                      onChange={() => handleCheckItem(row.id)}
                                    />
                                  </div>
                                </td>

                                {/* Index*/}
                                <td className="align-middle text-sm text-gray-900 font-vagrounded">
                                  <div className="py-4 px-4">{index + 1}</div>
                                </td>

                                {/* Name */}
                                <td className="align-middle text-sm text-gray-900 font-vagrounded">
                                  <div className="py-4 px-4 border-l border-white">
                                    {row.respondent.name}
                                  </div>
                                </td>

                                {/* Email */}
                                <td className="align-middle text-sm text-gray-900 font-vagrounded">
                                  <div className="py-4 px-4 border-l border-white">
                                    {row.respondent.email}
                                  </div>
                                </td>

                                {/* Date */}
                                <td className="align-middle text-sm text-gray-600 font-vagrounded">
                                  <div className="py-4 px-4 border-l border-white">
                                    {date}
                                  </div>
                                </td>

                                {/* Time — LAST COLUMN: no left border on inner div */}
                                <td className="align-middle text-sm text-gray-600 font-vagrounded">
                                  <div className="py-4 px-4  border-l border-white">
                                    {time}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#6b7280",
                      fontSize: "16px",
                    }}
                    className="font-vagrounded"
                  >
                    No responses yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === "individual" && (
              <div>
                <h2 style={{ marginTop: 0 }} className="font-vagrounded">
                  Individual Responses
                </h2>

                <p style={{ color: "#6b7280" }} className="font-vagrounded">
                  Select a specific response to view detailed information.
                </p>

                {responses && responses.length > 0 ? (
                  <div style={{ display: "grid", gap: "10px" }}>
                    {responses.map((response) => (
                      <div
                        key={response.id}
                        style={{
                          padding: "15px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          background: "#ffffff",
                        }}
                      >
                        <p
                          style={{ margin: "5px 0", fontWeight: "600" }}
                          className="font-vagrounded"
                        >
                          Response #{response.id}
                        </p>

                        <p
                          style={{
                            margin: "5px 0",
                            fontSize: "14px",
                            color: "#6b7280",
                          }}
                          className="font-vagrounded"
                        >
                          {response.respondent?.email || "Anonymous"} •{" "}
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{ textAlign: "center", color: "#6b7280" }}
                    className="font-vagrounded"
                  >
                    No responses to display.
                  </p>
                )}
              </div>
            )}

            {activeTab === "summary" && (
              <div>
                <SummaryView
                  responses={responses}
                  formData={formData}
                  questionMap={questions}
                />
              </div>
            )}

            {checkedItems.length > 0 && (
              <div className="popup absolute left-0 right-0 bottom-20 m-auto p-1 w-min-content border-box justify-between max-w-2xs shadow-lg border-2 border-white rounded-lg flex">
                <span className="p-2 text-base font-bold">
                  {`${checkedItems.length}/${responses.length} selected`}
                </span>
                <button className="p-2 text-base font-bold pl-4 border-l border-gray-300 hover:bg-gray-300">
                  <FaCross />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// Helper function to aggregate responses by question and option
function aggregateResponseData(responses, formData) {
  const aggregated = {};

  console.log(formData);

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
        console.log("console_matrix");
      }

    });
  });

  // Count responses for each option
  responses.forEach((response) => {
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
      let questionId = answer["questionID"];
      // console.log(answer);

      if (aggregated[questionId] && answer) {
        aggregated[questionId].total++;

        // Increment count for this specific answer/option
        if (aggregated[questionId].options.hasOwnProperty(answer.answer)) {
          aggregated[questionId].options[answer.answer]++;
        } else {
          // Handle edge case where answer doesn't match predefined options
          aggregated[questionId].options[answer[answer]] = 1;
        }
      }
    });
  });

  // console.log("aggregated: ");
  // console.log(aggregated);

  return aggregated;
}

// Main Summary Component
function SummaryView({ responses, formData, questions }) {
  const [summaryData, setSummaryData] = useState({});

  useEffect(() => {
    if (responses && formData) {
      console.log(responses);
      const aggregated = aggregateResponseData(responses, formData);
      // console.log(`Aggregated - ${JSON.stringify(aggregated)}`);
      // console.log("Responses - " + JSON.stringify(responses));
      setSummaryData(aggregated);
    }
  }, [responses, formData]);

  if (!responses || !formData) {
    return <div>Loading summary...</div>;
  }

  if (Object.keys(summaryData).length === 0) {
    return <div>No multiple choice questions found or no responses yet.</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="flex justify-between mb-10 pb-6 border-b-1 border-gray-300">
        <h2
          style={{ marginTop: 0 }}
          className="text-3xl font-bold font-vagrounded"
        >
          Summary
        </h2>
        <button className="p-2 hover:font-bold flex gap-1">
          <FaFile />
          Print to PDF
        </button>
      </div>

      <div className="questions flex flex-col gap-6 w-auto">
        {Object.entries(summaryData).map(([questionId, data]) => (
          // <QuestionSummary key={questionId} questionData={data} />

          <div className="border-1 border-white shadow-xl rounded-lg flex flex-col p-4">
            {/* {console.log(data)} */}
            <h3 className="text-lg font-bold">{data.question}</h3>
            <p className="mb-10 text-lg">
              There were {data.total} responses to this question
            </p>
            <MultipleChoiceBarChart data={data} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Results;
