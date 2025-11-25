import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { FaHome } from "react-icons/fa";
import axios from "axios";

// Import your form element components
import Contact from "../components/FormElements/Contact";
import MultipleChoice from "../components/ResponseQuestions/MultipleChoice";
import Checkbox from "../components/FormElements/Checkbox";
import Dropdown from "../components/FormElements/Dropdown";
import ChoiceMatrix from "../components/FormElements/ChoiceMatrix";
import Paragraph from "../components/FormElements/Paragraph";
import Heading from "../components/FormElements/Heading";
import LongText from "../components/FormElements/LongText";
import Email from "../components/FormElements/Email";
import PhoneNumber from "../components/FormElements/PhoneNumber";
import FileUpload from "../components/FormElements/FileUploader";
import ShortText from "../components/FormElements/ShortText";

function Preview() {
  const { guid } = useParams(); // This is the publicId (GUID)
  const [id, setId] = useState(0);
  const [pages, setPages] = useState([]);
  const [title, setTitle] = useState("Untitled Form");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!guid) return;

    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/Form/view/${guid}`
        );

        const { id, title, formData } = response.data;
        setId(id);

        console.log(typeof formData);

        // Critical fix: FormData is the array of pages
        if (!Array.isArray(formData) || formData.length === 0) {
          setError("This form has no questions.");
          setPages([]);
        } else {
          setPages(formData);
          setTitle(title || "Untitled Form");
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setError("Form not found or the link is invalid.");
        } else if (err.response?.status === 403) {
          setError("You don't have permission to view this form.");
        } else {
          setError("Failed to load the form. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const goNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      console.log("Submitted answers:", answers);
      alert("Thank you! Your response has been recorded.");
      // TODO: POST to your submission endpoint
    }
  };

  const goPrev = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
  };

  const updateAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (loading) {
    return (
      <div className="h-dvh w-full bg-(--white) flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading form...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh w-full bg-(--white) flex flex-col items-center justify-center gap-6 px-8 text-center">
        <h2 className="text-3xl font-bold text-red-600">Error</h2>
        <p className="text-lg text-gray-700 max-w-md">{error}</p>
        <Link to="/" className="text-(--purple) underline text-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="h-dvh w-full bg-(--white) flex items-center justify-center text-xl text-gray-500">
        This form has no questions.
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];
  const progress = ((currentPageIndex + 1) / pages.length) * 100;

  return (
    <div className="h-dvh w-full bg-(--white) flex flex-col overflow-hidden">
      <header className="flex w-full items-center justify-between bg-(--white) pt-8 pb-8 px-10 pr-12 relative z-50 border-b-2 border-(--dirty-white)">
        <div className="flex w-full items-center justify-between">
          <div className="inline-flex items-center gap-7 bg-(--white) flex-1 min-w-0">
            <Link to="/">
              <FaHome className="text-3xl cursor-pointer" />
            </Link>

            <span className="text-(--black) font-vagrounded text-xl py-1 px-2 max-w-1/3 truncate">
              {title}
            </span>
          </div>

          <Link to={`/newform/${id}`}>
            <button className="px-10 py-1.5 rounded-xl bg-(--white) ring ring-white inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-gray-300 transition-color duration-200 ease-out">
              Exit Preview
            </button>
          </Link>
        </div>
      </header>

      <div className="px-10 py-2 mt-3">
        <div className="w-full max-w-4xl justify-self-center h-3 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full  bg-(--purple) transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* questions d2 */}
      <div className="flex-1 overflow-y-auto px-10 pb-10">
        <div className="max-w-4xl mx-auto p-12">
          <div className="space-y-10">
            {currentPage.questions
              .sort((a, b) => a.order - b.order)
              .map((q) => {
                switch (q.type) {
                  case "multiple_choice":
                    return (
                      <MultipleChoice
                        question={q} // your question object from FormData
                        value={answers[q.id]} // current answer
                        onChange={(val) => updateAnswer(q.id, val)}
                      />
                    );

                  default:
                    return (
                      <div
                        key={q.id}
                        className="p-6 bg-orange-100 border border-orange-400 rounded-lg"
                      >
                        <p className="text-orange-800 font-medium">
                          Unknown question type: {q.type}
                        </p>
                      </div>
                    );
                }
              })}
          </div>

          <div className="flex justify-between items-center mt-16 pt-8 border-t">
            <button
              onClick={goPrev}
              disabled={currentPageIndex === 0}
              className={`px-8 py-4 rounded-xl font-medium ${
                currentPageIndex === 0
                  ? "bg-red-200 text-red-500"
                  : "bg-red-100 hover:bg-red-200"
              }`}
            >
              Previous
            </button>

            <button
              onClick={goNext}
              className="px-12 py-4 text-black font-bold rounded bg-red-500 shadow-lg hover:shadow-xl transition"
            >
              {currentPageIndex === pages.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
