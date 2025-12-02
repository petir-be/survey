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

        console.log("API Response:", res.data);

        setResponses(res.data);
        setError(null);
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
      <div className="m-auto mt-30 p-4">
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
            style={{
              padding: "12px 24px",
              background: activeTab === "responses" ? "#CCCDD9" : "transparent",
              color: activeTab === "responses" ? "black" : "#6b7280",
              border: "white 1px solid",
              borderBottom: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600", // Always 600
              transition: "all 0.2s",
              borderRadius: "12px 0px 0px 0px",
            }}
          >
            Responses {`(${responses.length})`}
          </button>

          <button
            onClick={() => setActiveTab("individual")}
            style={{
              padding: "12px 24px",
              background:
                activeTab === "individual" ? "#CCCDD9" : "transparent",
              color: activeTab === "individual" ? "black" : "#6b7280",
              border: "white 1px solid",
              borderBottom: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600", // Always 600
              transition: "all 0.2s",
              borderRadius: "0px 0px 0px 0px",
            }}
          >
            Individual
          </button>

          <button
            onClick={() => setActiveTab("summary")}
            style={{
              padding: "12px 24px",
              background: activeTab === "summary" ? "#CCCDD9" : "transparent",
              color: activeTab === "summary" ? "black" : "#6b7280",
              border: "white 1px solid",
              borderBottom: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600", // Always 600
              transition: "all 0.2s",
              borderRadius: "0px 12px 0px 0px",
            }}
          >
            Summary
          </button>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <p style={{ textAlign: "center", fontSize: "18px" }}>
            Loading responses...
          </p>
        )}
        {error && (
          <p style={{ color: "red", textAlign: "center", fontSize: "16px" }}>
            Error: {error}
          </p>
        )}

        {/* Tab Content */}
        {!loading && !error && (
          <>
            {activeTab === "responses" && (
              <div>
                <h2 style={{ marginTop: 0 }}>
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
                    <div className=" rounded-lg overflow-hidden">
                      <table className="w-full border-separate border-spacing-x-0 border-spacing-y-2">
                        <thead className="shadow-md">
                          <tr
                            className="border-2px border-white rounded-sm"
                            style={{ background: "var(--dirty-white)" }}
                          >
                            <th className="p-4 text-left">
                              <input
                                type="checkbox"
                                className="pretty-checkbox"
                              />
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-700">
                              <FaArrowDown />
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-700">
                              Status
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-700">
                              Name
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-700">
                              Email
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-700">
                              Date
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-gray-700">
                              Time
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
                              .slice(0, 8); // HH:MM:SS

                            return (
                              <tr
                                key={row.id}
                                className="border-b border-white hover:bg-gray-50 transition-colors shadow-md rounded-sm"
                              >
                                <td className="p-4">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 border-gray-300 pretty-checkbox row-checkbox"
                                  />
                                </td>
                                <td className="p-4 text-sm text-gray-900"></td>
                                <td className="p-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      row.status === "Completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {row.status}
                                  </span>
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                  {row.respondent.name}
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                  {row.respondent.email}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                  {date}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                  {time}
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
                  >
                    No responses yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === "individual" && (
              <div>
                <h2 style={{ marginTop: 0 }}>Individual Responses</h2>
                <p style={{ color: "#6b7280" }}>
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
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f9fafb")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#ffffff")
                        }
                      >
                        <p style={{ margin: "5px 0", fontWeight: "600" }}>
                          Response #{response.id}
                        </p>
                        <p
                          style={{
                            margin: "5px 0",
                            fontSize: "14px",
                            color: "#6b7280",
                          }}
                        >
                          {response.respondent?.email || "Anonymous"} •{" "}
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: "center", color: "#6b7280" }}>
                    No responses to display.
                  </p>
                )}
              </div>
            )}

            {activeTab === "summary" && (
              <div>
                <h2 style={{ marginTop: 0 }} className="text-3xl font-bold">
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
                  <h3 style={{ marginTop: 0 }}>Response Details</h3>
                  <p style={{ color: "#6b7280" }}>
                    More detailed analytics and charts will be displayed here.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
