import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { FaHome } from "react-icons/fa";
import { IoMdArrowRoundForward } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import DotShader2 from "../components/DotShader2";
// Import the ReviewPage component if it exists in your components folder
// NOTE: Assuming ReviewPage exists for completeness, though its content might be different for a Preview
import ReviewPage from "../components/ReviewPage";
import QuestionRenderer from "../components/QuestionRenderer";
import Loading from "../components/Loading";

function Preview() {
  const { guid } = useParams();
  const [id, setId] = useState(0);
  const [pages, setPages] = useState([]);
  const [title, setTitle] = useState("Untitled Form");
  const [hasReviewPage, setHasReviewPage] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  // Answers state is an object in Preview, array in Response. Keep it as object for Preview.
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
        // Setting hasReviewPage from response data
        setHasReviewPage(response.data.hasReviewPage);
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
    const isLastQuestionPage = currentPageIndex === pages.length - 1;
    const isReviewPage = hasReviewPage && currentPageIndex === pages.length;

    if (hasReviewPage && isLastQuestionPage) {
      // Go to the review page
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (isReviewPage || (!hasReviewPage && isLastQuestionPage)) {
      // Simulating submission
      console.log("Simulated Submission - Answers:", answers);
      alert(
        "Thank you! Your response has been recorded. (Simulated Submission in Preview)"
      );
      // No actual POST in Preview. Just reset or show a done message.
    } else if (currentPageIndex < pages.length - 1) {
      // Go to the next question page
      setCurrentPageIndex(currentPageIndex + 1);
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
        <Loading />
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

  // Calculate progress, which needs to include the review page if it exists.
  // Total steps = pages.length + (hasReviewPage ? 1 : 0)
  const totalSteps = pages.length + (hasReviewPage ? 1 : 0);
  // Current step index: currentPageIndex is 0-indexed for pages. If it's the review page, it's pages.length.
  const currentStep = currentPageIndex + 1;
  const progress = (currentStep / totalSteps) * 100;

  const isReviewPage = hasReviewPage && currentPageIndex === pages.length;
  const currentPage = pages[currentPageIndex]; // This will be undefined on the review page index

  // Map the answers object to the array format expected by ReviewPage
  const answersForReview = Object.keys(answers).map((questionID) => ({
    questionID: questionID,
    answer: answers[questionID],
  }));

  return (
    <div className="h-dvh w-full bg-(--white) flex flex-col overflow-hidden">
      <header className="flex w-full items-center justify-between bg-(--white) pt-8 pb-8 px-10 pr-12 relative z-50 border-b-2 border-(--dirty-white)">
        <div className="flex w-full items-center justify-between">
          <div className="inline-flex items-center bg-(--white) flex-1 min-w-0">
            <Link to={`/newform/${id}`} reloadDocument>
              <button className="flex gap-2 items-center px-6 py-1.5 rounded-xl bg-(--white) ring ring-white inset-shadow-md/10 font-vagrounded drop-shadow-sm/30 hover:bg-gray-300 transition-color duration-200 ease-out">
                <IoArrowBack className="fill-black text-xl" /> Exit Preview
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* progress bar */}

      <div className="px-10 py-2 ">
        <div className="w-full max-w-5xl justify-self-center h-3 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-(--purple) transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <DotShader2 className="z-50" />
      {/* questions d2 */}

      <div className="flex-1 overflow-y-auto px-10 pb-10 flex flex-col">
        <div className="relative max-w-4xl w-full mx-auto px-10 py-7 border-gradient bg-(--white) pageBorder drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-between">
          <div className="flex-1">
            {isReviewPage ? (
              <ReviewPage pages={pages} answers={answersForReview} />
            ) : currentPage?.questions.length === 0 ? (
              <div className="flex justify-center items-center text-xl text-gray-400 w-full h-full text-center">
                Current page has no questions available.
              </div>
            ) : (
              <div className="space-y-10">
                {currentPage.questions
                  .sort((a, b) => a.order - b.order)
                  .map((q) => {
                    return (
                      <QuestionRenderer
                        key={q.id}
                        question={q}
                        value={answers[q.id]}
                        onAnswer={(val) => updateAnswer(q.id, val)}
                      />
                    );
                  })}
              </div>
            )}
          </div>

          {/* buttons */}
          <div className="flex justify-between mt-5 pt-8">
            <button
              onClick={goPrev}
              disabled={currentPageIndex === 0}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPageIndex === 0
                  ? "opacity-0 cursor-default"
                  : "opacity-100 bg-red-100 hover:bg-red-200"
              }`}
            >
              Previous
            </button>

            <button
              onClick={goNext}
              className={`flex items-center gap-1 pl-7 pr-6 py-1.5 rounded-xl font-vagrounded drop-shadow-sm/30 transition-color duration-200 ease-out
         ${
           isReviewPage
             ? "bg-(--white) ring ring-green-500 hover:bg-green-200"
             : "bg-(--white) ring ring-(--purple) inset-shadow-md/10 hover:bg-violet-200"
         }`}
            >
              {isReviewPage
                ? "Simulate Submission"
                : currentPageIndex === pages.length - 1 && hasReviewPage
                ? "Review Answers"
                : currentPageIndex === pages.length - 1
                ? "Simulate Submission"
                : "Next"}
              <IoMdArrowRoundForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
