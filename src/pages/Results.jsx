import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { FaArrowDown, FaCross, FaDownload, FaFile, FaX } from "react-icons/fa6";
import ResponsesNavbar from "../components/ResponsesNavbar";
import SearchBar from "../components/SearchBar";
import IndividualView from "../components/Results/IndividualView";
import SummaryView from "../components/Results/SummaryView";
import moment from "moment";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { MultipleDetailedResponsesPDF } from "../components/PDF/DetailedResponsePDF";

function Results({
  defaultFormName = "Form",
  parentResponses = [], // Default to empty array
  parentLoading = false,
  parentFormData,
}) {
  const { id } = useParams();
  const [SearchBarValue, setSearchBarValue] = useState("");
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("responses");
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [summary, setSummary] = useState();
  const [questions, setQuestions] = useState();
  const [formName, setFormName] = useState(defaultFormName);
  // const [formData, setFormData] = useState();
  const [isReversed, setIsReversed] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [inDetailRow, setInDetailRow] = useState(null);
  const [chartImages, setChartImages] = useState([]);

  const processedResponses = useMemo(() => {
    // 1. Create a shallow copy so we don't mutate props
    let data = [...parentResponses];

    // 2. Handle Reversing
    if (isReversed) {
      data.reverse();
    }

    // 3. Handle Filtering
    if (SearchBarValue) {
      data = data.filter((response) => {
        // ✅ SAFE ACCESS: Check if respondent exists, otherwise use "Anonymous"
        const name = response.respondent?.name || "Anonymous";
        return name.toLowerCase().includes(SearchBarValue.toLowerCase());
      });
    }

    return data;
  }, [parentResponses, isReversed, SearchBarValue]);

  // 2. SIMPLIFIED HANDLERS
  const handleReverseOrder = () => {
    setIsReversed(!isReversed); // Just toggle the flag
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      // Use processedResponses so we select what is currently visible
      setCheckedItems(processedResponses.map((r) => r.id));
    }
    setSelectAll(!selectAll);
    console.log(checkedItems);
  };

  const handleCheckItem = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
      setSelectAll(false);
    } else {
      const newChecked = [...checkedItems, id];
      setCheckedItems(newChecked);
      if (newChecked.length === processedResponses.length) {
        setSelectAll(true);
      }
    }
  };

  const filteredResponses = parentResponses.filter((response) =>
    response.respondent.name
      .toLowerCase()
      .includes(SearchBarValue.toLowerCase())
  );

  const seeInDetail = (rowData, formData) => {
    setInDetailRow(rowData);
    console.log(rowData);

    setActiveTab("individual");
  };

  const getAllCheckedResponses = () => {
    return parentResponses.filter((res) => checkedItems.includes(res.id));
  };

  return (
    <div className="m-auto w-full p-4 font-vagrounded">
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
          Responses{" "}
          <span className="text-(--purple)">({parentResponses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("individual")}
          className="font-vagrounded"
          style={{
            padding: "12px 24px",
            background: activeTab === "individual" ? "#CCCDD9" : "transparent",
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
      {parentLoading && (
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

      {!parentLoading && !error && (
        <>
          {activeTab === "responses" && (
            <div>
              <div className="w-full m-auto bruh p-6">
                <SearchBar
                  value={SearchBarValue}
                  onChange={(e) => setSearchBarValue(e.target.value)}
                />
              </div>

              {filteredResponses && filteredResponses.length > 0 ? (
                <div className="w-full p-6 min-h-screen">
                  <div className="rounded-lg overflow-hidden">
                    <table className="w-full border-separate border-spacing-x-0 border-spacing-y-4 pr-1">
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
                              <button
                                className="hover:bg-white rounded-full p-2 transition-transform"
                                onClick={handleReverseOrder}
                                style={{
                                  transform: isReversed
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                }}
                              >
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
                        {parentResponses.map((row, index) => {
                          const d = new Date(row.submittedAt);
                          const displayIndex = isReversed
                            ? parentResponses.length - index
                            : index + 1;

                          const formattedDate = d.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                          const formattedTime = d.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          });
                          const respondentName =
                            row.respondent?.name || "Anonymous";
                          const respondentEmail =
                            row.respondent?.email || "N/A";

                          return (
                            <tr
                              key={row.id}
                              className="border-b border-white outline-1 outline-white hover:bg-gray-50 transition-colors shadow-md rounded-sm"
                              onClick={() => seeInDetail(row)}
                            >
                              {/* Checkbox column — border on inner div */}
                              <td className="align-middle font-vagrounded">
                                <div
                                  className="py-4 px-4 border-l border-r border-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
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
                                <div className="py-4 px-4">{displayIndex}</div>
                              </td>

                              {/* Name */}
                              <td className="align-middle text-sm text-gray-900 font-vagrounded">
                                <div className="py-4 px-4 border-l border-white">
                                  {respondentName}
                                </div>
                              </td>

                              {/* Email */}
                              <td className="align-middle text-sm text-gray-900 font-vagrounded">
                                <div className="py-4 px-4 border-l border-white">
                                  {respondentEmail}
                                </div>
                              </td>

                              {/* Date */}
                              <td className="align-middle text-sm text-gray-600 font-vagrounded">
                                <div className="py-4 px-4 border-l border-white">
                                  {moment
                                    .utc(row.submittedAt)
                                    .local()
                                    .format("MMMM d, yyyy")}
                                </div>
                              </td>

                              {/* Time — LAST COLUMN: no left border on inner div */}
                              <td className="align-middle text-sm text-gray-600 font-vagrounded">
                                <div className="py-4 px-4  border-l border-white">
                                  {moment
                                    .utc(row.submittedAt)
                                    .local()
                                    .format("hh:mm A")}
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
            <div className="h-full">
              {inDetailRow ? (
                <IndividualView
                  response={inDetailRow}
                  formData={parentFormData}
                />
              ) : (
                <p
                  style={{ textAlign: "center", color: "#6b7280" }}
                  className="font-vagrounded m-auto mt-5"
                >
                  Click a row in the{" "}
                  <span
                    onClick={() => setActiveTab("responses")}
                    className="text-(--purple) cursor-pointer hover:underline hover:decoration-solid"
                  >
                    Responses
                  </span>{" "}
                  tab to see it in detail here.
                </p>
              )}
            </div>
          )}

          {activeTab === "summary" && (
            <SummaryView
              parentResponses={parentResponses}
              formData={parentFormData}
              setChartImages={setChartImages}
              chartImages={chartImages}
              formTitle={defaultFormName}
            />
          )}

          {checkedItems.length > 0 && (
            <div className="popup fixed bg-[var(--white)] shadow-lg left-0 right-0 bottom-20 m-auto p-1 max-w-2xs border-2 border-white rounded-lg flex items-stretch">
              <span className="p-4 text-base font-bold flex items-center w-full">
                {`${checkedItems.length}/${parentResponses.length} selected`}
              </span>

              <PDFDownloadLink
                className="flex items-center justify-center border-l border-gray-300 hover:bg-gray-300 w-24"
                fileName="selectedResponses"
                document={
                  <MultipleDetailedResponsesPDF
                    responses={getAllCheckedResponses()}
                    formData={parentFormData}
                  />
                }
              >
                <FaDownload />
              </PDFDownloadLink>

              <button
                className="flex items-center justify-center border-l border-gray-300 hover:bg-gray-300 w-24"
                onClick={() => {
                  setSelectAll(!selectAll);
                  setCheckedItems([]);
                }}
              >
                <FaX />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Results;
