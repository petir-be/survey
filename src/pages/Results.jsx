import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router";
import axios from "axios";
import {
  FaArrowDown,
  FaCross,
  FaDownload,
  FaFile,
  FaX,
  FaFilter,
} from "react-icons/fa6";
import ResponsesNavbar from "../components/ResponsesNavbar";
import SearchBar from "../components/SearchBar";
import IndividualView from "../components/Results/IndividualView";
import SummaryView from "../components/Results/SummaryView";
import moment from "moment";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { MultipleDetailedResponsesPDF } from "../components/PDF/DetailedResponsePDF";

function Results({
  defaultFormName = "Form",
  parentResponses = [],
  parentLoading = false,
  parentFormData,
}) {
  const [SearchBarValue, setSearchBarValue] = useState("");
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("responses");
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [summary, setSummary] = useState();
  const [questions, setQuestions] = useState();
  const [formName, setFormName] = useState(defaultFormName);
  const [isReversed, setIsReversed] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [inDetailRow, setInDetailRow] = useState(null);
  const [chartImages, setChartImages] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const emailQuestionId = useMemo(() => {
    if (!parentFormData) return null;

    for (const section of parentFormData) {
      for (const question of section.questions ?? []) {
        if (question.type === "email") {
          return question.id;
        }
      }
    }

    return null;
  }, [parentFormData]);

  const normalizedResponses = useMemo(() => {
    return parentResponses.map((response) => {
      let email = "—";

      if (emailQuestionId) {
        const emailAnswer = response.responseData?.find(
          (a) => a.questionID === emailQuestionId
        );

        if (typeof emailAnswer?.answer === "string") {
          email = emailAnswer.answer;
        }
      }

      return {
        ...response,
        respondent: {
          name: response.respondent?.name ?? "Anonymous",
          email,
        },
      };
    });
  }, [parentResponses, emailQuestionId]);

  const processedResponses = useMemo(() => {
    let data = [...normalizedResponses];

    // Reverse order
    if (isReversed) {
      data.reverse();
    }

    // Filter by name
    if (SearchBarValue) {
      data = data.filter((response) =>
        response.respondent.name
          .toLowerCase()
          .includes(SearchBarValue.toLowerCase())
      );
    }

    // Filter by email
    if (emailFilter) {
      data = data.filter((response) =>
        response.respondent.email
          .toLowerCase()
          .includes(emailFilter.toLowerCase())
      );
    }

    // Filter by date range
    if (dateFrom) {
      const fromDate = moment(dateFrom).startOf("day");
      data = data.filter((response) =>
        moment(response.submittedAt).isSameOrAfter(fromDate)
      );
    }

    if (dateTo) {
      const toDate = moment(dateTo).endOf("day");
      data = data.filter((response) =>
        moment(response.submittedAt).isSameOrBefore(toDate)
      );
    }

    return data;
  }, [
    normalizedResponses,
    isReversed,
    SearchBarValue,
    emailFilter,
    dateFrom,
    dateTo,
  ]);

  const handleReverseOrder = () => {
    setIsReversed(!isReversed);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(processedResponses.map((r) => r.id));
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
      if (newChecked.length === processedResponses.length) {
        setSelectAll(true);
      }
    }
  };

  const clearAllFilters = () => {
    setSearchBarValue("");
    setEmailFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters = SearchBarValue || emailFilter || dateFrom || dateTo;

  const seeInDetail = (rowData, formData) => {
    setInDetailRow(rowData);
    setActiveTab("individual");
  };

  const getAllCheckedResponses = () => {
    return processedResponses.filter((res) => checkedItems.includes(res.id));
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
          <span className="text-(--purple)">({processedResponses.length})</span>
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
              <div className="w-full m-auto bruh p-4">
                <div className="flex gap-3 items-center mb-4">
                  <SearchBar
                    value={SearchBarValue}
                    onChange={(e) => setSearchBarValue(e.target.value)}
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-7 py-1.5 flex items-center gap-2 rounded-xl bg-(--white) ring ring-white inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-gray-300 transition-color duration-200 ease-out"
                  >
                    <FaFilter size={14} />
                    Filters
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="px-7 py-1.5 flex items-center gap-2 text-(--white) fill-(--white) rounded-xl bg-(--purple) ring ring-white inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-purple-700 transition-color duration-200 ease-out"
                    >
                      <FaX size={14} style={{fill: "var(--white)"}} />
                      Clear All
                    </button>
                  )}
                </div>

                {/* Filters Panel */}
                {showFilters && (
                  <div className="rounded-lg p-4 mb-4 ring ring-white shadow-md/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Email Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-vagrounded">
                          Email
                        </label>
                        <input
                          type="text"
                          value={emailFilter}
                          onChange={(e) => setEmailFilter(e.target.value)}
                          placeholder="Filter by email..."
                          className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-vagrounded"
                        />
                      </div>

                      {/* Date From */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-vagrounded">
                          Date From
                        </label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-vagrounded"
                        />
                      </div>

                      {/* Date To */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-vagrounded">
                          Date To
                        </label>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-vagrounded"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {processedResponses && processedResponses.length > 0 ? (
                <div className="w-full p-4 min-h-screen">
                  <div className="rounded-lg overflow-auto">
                    <table className="w-full border-separate border-spacing-x-0 border-spacing-y-4 pr-1 overflow-x-auto">
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
                        {processedResponses.map((row, index) => {
                          const displayIndex = index + 1;

                          return (
                            <tr
                              key={row.id}
                              className="border-b border-white outline-1 outline-white hover:bg-gray-50 transition-colors shadow-md rounded-sm"
                              onClick={() => seeInDetail(row)}
                            >
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

                              <td className="align-middle text-sm text-gray-900 font-vagrounded">
                                <div className="py-4 px-4">{displayIndex}</div>
                              </td>

                              <td className="align-middle text-sm text-gray-900 font-vagrounded">
                                <div className="py-4 px-4 border-l border-white">
                                  {respondentName}
                                </div>
                              </td>

                              <td className="align-middle text-sm text-gray-900 font-vagrounded">
                                <div className="py-4 px-4 border-l border-white">
                                  {respondentEmail}
                                </div>
                              </td>

                              <td className="align-middle text-sm text-gray-600 font-vagrounded">
                                <div className="py-4 px-4 border-l border-white">
                                  {moment
                                    .utc(row.submittedAt)
                                    .local()
                                    .format("MMMM d, yyyy")}
                                </div>
                              </td>

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
                  {hasActiveFilters
                    ? "No responses match the current filters."
                    : "No responses yet."}
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
              parentResponses={processedResponses}
              formData={parentFormData}
              setChartImages={setChartImages}
              chartImages={chartImages}
              formTitle={defaultFormName}
            />
          )}

          {checkedItems.length > 0 && (
            <div className="popup fixed bg-[var(--white)] shadow-lg left-0 right-0 bottom-20 m-auto p-1 max-w-2xs border-2 border-white rounded-lg flex items-stretch">
              <span className="p-4 text-base font-bold flex items-center w-full">
                {`${checkedItems.length}/${processedResponses.length} selected`}
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
