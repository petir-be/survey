import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { FaArrowDown } from "react-icons/fa6";

import ResponsesNavbar from "../components/ResponsesNavbar";
import SearchBar from "../components/SearchBar";

export default function Results({ formName = "Form" }) {
  const { id } = useParams();

  const [SearchBarValue, setSearchBarValue] = useState("");
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("responses");

  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

        setResponses(res.data);
        setError(null);
      } catch (err) {
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
                <h2 style={{ marginTop: 0 }} className="font-vagrounded">
                  All Responses ({responses?.length || 0})
                </h2>

                <div className="w-full m-auto bruh p-6">
                  <SearchBar
                    value={SearchBarValue}
                    onChange={(e) => setSearchBarValue(e.target.value)}
                  />
                </div>

                {responses && responses.length > 0 ? (
                  <div className="w-full p-6 min-h-screen">
                    <div className="rounded-lg overflow-hidden">
                      <table className="w-full border-separate border-spacing-x-0 border-spacing-y-2">
                        <thead className="shadow-md font-vagrounded">
                          <tr
                            className="outline-1 outline-white border-box rounded-sm"
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
                              <div className="py-4 px-4 border-l border-r border-white">
                                <FaArrowDown />
                              </div>
                            </th>
                            <th className="text-left text-sm font-medium text-gray-700 font-vagrounded">
                              <div className="py-4 px-4 border-l border-r border-white">
                                Name
                              </div>
                            </th>
                            <th className="text-left text-sm font-medium text-gray-700 font-vagrounded">
                              <div className="py-4 px-4 border-l border-r border-white">
                                Email
                              </div>
                            </th>
                            <th className="text-left text-sm font-medium text-gray-700 font-vagrounded">
                              <div className="py-4 px-4 border-l border-r border-white">
                                Date
                              </div>
                            </th>
                            <th className="text-left text-sm font-medium text-gray-700 font-vagrounded">
                              <div className="py-4 px-4 border-l border-r border-white">
                                Time
                              </div>
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {responses.map((row) => {
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

                                {/* Empty / icon column */}
                                <td className="align-middle text-sm text-gray-900 font-vagrounded">
                                  <div className="py-4 px-4"></div>
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
                <h2
                  style={{ marginTop: 0 }}
                  className="text-3xl font-bold font-vagrounded"
                >
                  Summary
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "20px",
                  }}
                >
                  <div
                    style={{
                      padding: "20px",
                      background: "#f0f9ff",
                      borderRadius: "8px",
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "14px",
                        color: "#1e40af",
                        fontWeight: "600",
                      }}
                      className="font-vagrounded"
                    >
                      TOTAL RESPONSES
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#1e3a8a",
                      }}
                      className="font-vagrounded"
                    >
                      {responses?.length || 0}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "20px",
                      background: "#f0fdf4",
                      borderRadius: "8px",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "14px",
                        color: "#15803d",
                        fontWeight: "600",
                      }}
                      className="font-vagrounded"
                    >
                      LATEST RESPONSE
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#166534",
                      }}
                      className="font-vagrounded"
                    >
                      {responses?.length > 0
                        ? new Date(
                            responses[0].submittedAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "20px",
                      background: "#fef3c7",
                      borderRadius: "8px",
                      border: "1px solid #fde68a",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "14px",
                        color: "#92400e",
                        fontWeight: "600",
                      }}
                      className="font-vagrounded"
                    >
                      COMPLETION RATE
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#78350f",
                      }}
                      className="font-vagrounded"
                    >
                      100%
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "30px",
                    padding: "20px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                >
                  <h3 style={{ marginTop: 0 }} className="font-vagrounded">
                    Response Details
                  </h3>

                  <p style={{ color: "#6b7280" }} className="font-vagrounded">
                    More detailed analytics and charts will be displayed here.
                  </p>
                </div>
              </div>
            )}

            {checkedItems.length > 0 && (
              <div className="popup absolute left-0 right-0 bottom-0 m-auto w-64">
                <span>
                  {`${checkedItems.length}/${responses.length} selected`}
                </span>
                <button className="p-4">Delete</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
