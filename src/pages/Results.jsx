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

  console.log(processedResponses);

  return (
    <div className="m-auto w-full p-4 font-vagrounded bg-black min-h-screen text-gray-200">
      {/* Tab Buttons */}
      <div className="flex border-b border-[#333] mb-6">
        <button
          onClick={() => setActiveTab("responses")}
          className={`px-6 py-3 text-base font-semibold transition-all duration-200 rounded-t-lg ${activeTab === "responses"
              ? "text-green-400 border-b-2 border-green-500 bg-[#1e1e1e]"
              : "text-gray-500 hover:text-gray-300 hover:bg-[#111]"
            }`}
        >
          Responses{" "}
          <span
            className={
              activeTab === "responses" ? "text-green-500" : "text-gray-600"
            }
          >
            ({processedResponses.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("individual")}
          className={`px-6 py-3 text-base font-semibold transition-all duration-200 rounded-t-lg ${activeTab === "individual"
              ? "text-green-400 border-b-2 border-green-500 bg-[#1e1e1e]"
              : "text-gray-500 hover:text-gray-300 hover:bg-[#111]"
            }`}
        >
          Individual
        </button>

        <button
          onClick={() => setActiveTab("summary")}
          className={`px-6 py-3 text-base font-semibold transition-all duration-200 rounded-t-lg ${activeTab === "summary"
              ? "text-green-400 border-b-2 border-green-500 bg-[#1e1e1e]"
              : "text-gray-500 hover:text-gray-300 hover:bg-[#111]"
            }`}
        >
          Summary
        </button>
      </div>

      {/* Loading/Error */}
      {parentLoading && (
        <p className="text-center text-lg text-green-500 mt-8 font-vagrounded animate-pulse">
          Loading responses...
        </p>
      )}
      {error && (
        <p className="text-center text-base text-red-500 mt-8 font-vagrounded bg-red-900/20 p-4 rounded-lg border border-red-900/50">
          Error: {error}
        </p>
      )}

      {!parentLoading && !error && (
        <>
          {activeTab === "responses" && (
            <div className="w-full mx-auto max-w-7xl">
              <div className="mb-6 flex flex-col gap-4">
                {/* Search & Filter Controls */}
                <div className="flex flex-wrap gap-3 items-center">
                  <SearchBar
                    value={SearchBarValue}
                    onChange={(e) => setSearchBarValue(e.target.value)}
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-5 py-2 flex items-center gap-2 rounded-lg font-semibold transition-colors duration-200 border ${showFilters
                        ? "bg-[#1e1e1e] text-green-400 border-green-500/50"
                        : "bg-[#111] text-gray-300 border-[#333] hover:border-green-500/50 hover:text-green-400"
                      }`}
                  >
                    <FaFilter size={14} />
                    Filters
                  </button>

                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="px-5 py-2 flex items-center gap-2 rounded-lg bg-red-900/20 text-red-400 border border-red-900/50 font-semibold hover:bg-red-900/40 transition-colors duration-200"
                    >
                      <FaX size={12} />
                      Clear All
                    </button>
                  )}
                </div>

                {/* Expanded Filters Panel */}
                {showFilters && (
                  <div className="rounded-xl p-5 bg-[#111] border border-[#333] shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2 font-vagrounded">
                          Email
                        </label>
                        <input
                          type="text"
                          value={emailFilter}
                          onChange={(e) => setEmailFilter(e.target.value)}
                          placeholder="Filter by email..."
                          className="w-full px-4 py-2.5 bg-[#1e1e1e] text-white border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-vagrounded placeholder-gray-600 transition-shadow"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2 font-vagrounded">
                          Date From
                        </label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#1e1e1e] text-white border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-vagrounded placeholder-gray-600 transition-shadow color-scheme-dark"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2 font-vagrounded">
                          Date To
                        </label>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#1e1e1e] text-white border border-[#333] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-vagrounded placeholder-gray-600 transition-shadow"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {processedResponses && processedResponses.length > 0 ? (
                <div className="w-full pb-24">
                  <div className="rounded-xl border border-[#333] overflow-hidden bg-black shadow-lg">
                    <table className="w-full border-collapse text-left">
                      <thead className="bg-[#111] border-b border-[#333] text-gray-400 font-vagrounded text-sm">
                        <tr>
                          <th className="py-4 px-5 w-16 text-center border-r border-[#333]">
                            <input
                              type="checkbox"
                              className="pretty-checkbox accent-green-500 w-4 h-4 cursor-pointer"
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th className="py-4 px-5 border-r border-[#333]">
                            <button
                              className="hover:text-green-400 p-1 transition-all rounded-full hover:bg-[#1e1e1e]"
                              onClick={handleReverseOrder}
                              style={{
                                transform: isReversed
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              }}
                            >
                              <FaArrowDown />
                            </button>
                          </th>
                          <th className="py-4 px-5 font-semibold border-r border-[#333]">
                            Name
                          </th>
                          <th className="py-4 px-5 font-semibold border-r border-[#333]">
                            Email
                          </th>
                          <th className="py-4 px-5 font-semibold border-r border-[#333]">
                            Date
                          </th>
                          <th className="py-4 px-5 font-semibold">Time</th>
                        </tr>
                      </thead>

                      <tbody className="text-gray-300 text-sm">
                        {processedResponses.map((row, index) => {
                          const displayIndex = index + 1;

                          return (
                            <tr
                              key={row.id}
                              className="border-b border-[#222] hover:bg-[#111] transition-colors cursor-pointer group"
                              onClick={() => seeInDetail(row)}
                            >
                              <td className="py-4 px-5 text-center border-r border-[#333]/50">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    className="pretty-checkbox row-checkbox accent-green-500 w-4 h-4 cursor-pointer"
                                    checked={checkedItems.includes(row.id)}
                                    onChange={() => handleCheckItem(row.id)}
                                  />
                                </div>
                              </td>

                              <td className="py-4 px-5 text-gray-500 font-medium border-r border-[#333]/50">
                                {displayIndex}
                              </td>

                              <td className="py-4 px-5 font-medium group-hover:text-green-400 transition-colors border-r border-[#333]/50">
                                {row.respondent.name}
                              </td>

                              <td className="py-4 px-5 border-r border-[#333]/50">
                                {row.respondent.email}
                              </td>

                              <td className="py-4 px-5 border-r border-[#333]/50">
                                {moment
                                  .utc(row.submittedAt)
                                  .local()
                                  .format("MMMM D, YYYY")}
                              </td>

                              <td className="py-4 px-5">
                                {moment
                                  .utc(row.submittedAt)
                                  .local()
                                  .format("hh:mm A")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 border border-[#333] border-dashed rounded-xl bg-[#111]/50 mt-4">
                  <p className="text-gray-500 font-vagrounded text-lg text-center">
                    {hasActiveFilters
                      ? "No responses match the current filters."
                      : "No responses yet."}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="mt-4 text-green-500 hover:text-green-400 hover:underline"
                    >
                      Clear filters to see all results
                    </button>
                  )}
                </div>
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
                <div className="flex flex-col items-center justify-center py-20 border border-[#333] border-dashed rounded-xl bg-[#111]/50 mt-4">
                  <p className="text-gray-500 font-vagrounded text-lg text-center">
                    Click a row in the{" "}
                    <span
                      onClick={() => setActiveTab("responses")}
                      className="text-green-500 font-semibold cursor-pointer hover:underline"
                    >
                      Responses
                    </span>{" "}
                    tab to see it in detail here.
                  </p>
                </div>
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

          {/* Floating Action Bar for Selected Items */}
          {checkedItems.length > 0 && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] border border-green-500/50 shadow-xl shadow-green-900/10 rounded-full flex items-center z-50 overflow-hidden text-gray-200 font-vagrounded animate-in slide-in-from-bottom-8 duration-300">
              <div className="px-6 py-3 text-sm font-semibold border-r border-[#333]">
                <span className="text-green-400 mr-1">
                  {checkedItems.length}
                </span>
                / {processedResponses.length} selected
              </div>

              <PDFDownloadLink
                className="px-6 py-3 flex items-center gap-2 hover:bg-[#2a2a2a] hover:text-green-400 transition-colors cursor-pointer border-r border-[#333]"
                fileName="selectedResponses"
                document={
                  <MultipleDetailedResponsesPDF
                    responses={getAllCheckedResponses()}
                    formData={parentFormData}
                  />
                }
              >
                <FaDownload size={14} />
                <span className="text-sm font-semibold">Download</span>
              </PDFDownloadLink>

              <button
                className="px-6 py-3 flex items-center gap-2 hover:bg-red-900/30 hover:text-red-400 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectAll(false);
                  setCheckedItems([]);
                }}
              >
                <FaX size={12} />
                <span className="text-sm font-semibold">Clear</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Results;