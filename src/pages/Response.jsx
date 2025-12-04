import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { FaHome } from "react-icons/fa";
import { IoMdArrowRoundForward } from "react-icons/io";
import axios from "axios";
import DotShader2 from "../components/DotShader2";
import ReviewPage from "../components/ReviewPage";
import QuestionRenderer from "../components/QuestionRenderer";




// import { Steps } from "rsuite";

function Response() {
  const { guid } = useParams();
  const [id, setId] = useState(0);
  const [pages, setPages] = useState([]);
  const [title, setTitle] = useState("Untitled Form");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
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

  const submitAnswers = async () => {
    try {
      setLoading(true);
      setError(null);

      const dto = {
        responseData: answers,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Response/submit/${guid}`,
        dto,
        { withCredentials: true }
      );

      alert("Thank you! Your response has been recorded.");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You have already submitted this form.");
      } else {
        setError("Failed to submit the form.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isReviewPage = currentPageIndex === pages.length;

  const goNext = () => {
    // If we are not at the Review page yet, go forward
    if (currentPageIndex < pages.length) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      // We are AT the review page, so Submit
      console.log("Submitted answers:", answers);
      submitAnswers();
    }
  };

  const goPrev = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
  };

  const updateAnswer = (questionId, value) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.questionID === questionId
      );

      if (existingIndex > -1) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = { questionID: questionId, answer: value };
        return updated;
      }
      // Add new
      return [...prev, { questionID: questionId, answer: value }];
    });
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
      {/* progress bar */}

      <div className="z-50 bg-(--white) px-10 py-4 w-full mb-5 border-b-(--dirty-white) border border-transparent">
        <div className="w-full max-w-5xl justify-self-center h-3 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full  bg-(--purple) transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* nyaw gumana steps */}
      {/* 
      <div className="w-full flex justify-center py-6">
        <div className="max-w-5xl w-full px-10">
          <Steps
            current={currentPageIndex}
            size="small"
            labelPlacement="vertical"
          >
            {pages.map((p, index) => (
              <Steps.Step key={index} title={`Page ${index + 1}`} />
            ))}
          </Steps>
        </div>
      </div> */}

      <DotShader2 className="z-50" />
      {/* questions d2 */}

      <div className="flex-1 overflow-y-auto px-10 pb-10 flex flex-col">
        <div className="relative max-w-4xl w-full mx-auto px-10 py-7 border-gradient bg-(--white) pageBorder drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col  justify-between">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {isReviewPage ? (
              // RENDER REVIEW PAGE
              <ReviewPage pages={pages} answers={answers} />
            ) : (
              // RENDER QUESTIONS
              <>
                {currentPage?.questions.length === 0 ? (
                  <div className="flex justify-center items-center text-xl text-gray-400 w-full h-full text-center">
                    Current page has no questions available.
                  </div>
                ) : (
                  <div className="space-y-10">
                    {currentPage.questions
                      .sort((a, b) => a.order - b.order)
                      .map((q) => {
                        const currentAnswerObj = answers.find(
                          (a) => a.questionID === q.id
                        );
                        const currentValue = currentAnswerObj
                          ? currentAnswerObj.answer
                          : "";
                        return (
                          <QuestionRenderer
                            key={q.id}
                            question={q}
                            value={currentValue}
                            onAnswer={(val) => updateAnswer(q.id, val)}
                          />
                        );
                      })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* buttons */}
          <div className="flex justify-between mt-5 pt-8 border-t border-gray-100">
            <button
              onClick={goPrev}
              disabled={currentPageIndex === 0}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPageIndex === 0
                  ? "opacity-0 cursor-default"
                  : "opacity-100 bg-(--white) ring-white ring hover:bg-gray-300 inset-shadow-md/10 font-vagrounded drop-shadow-sm/25 transition-color duration-200 ease-out"
              }`}
            >
              Previous
            </button>

            <button
              onClick={goNext}
              className={`flex items-center gap-1 pl-7 pr-6 py-1.5 rounded-xl font-vagrounded drop-shadow-sm/30 transition-color duration-200 ease-out
                ${
                  isReviewPage
                    ? "bg-(--white) ring ring-green-500  hover:bg-green-200"
                    : "bg-(--white) ring ring-(--purple) inset-shadow-md/10 hover:bg-violet-200"
                }`}
            >
              {isReviewPage
                ? "Submit Response"
                : currentPageIndex === pages.length - 1
                ? "Review Answers"
                : "Next"}
              <IoMdArrowRoundForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Response;
