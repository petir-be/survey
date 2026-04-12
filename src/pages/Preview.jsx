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
import ShaderBackground from "../components/ShaderBackground"

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
      <div className="h-dvh w-full bg-black flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh w-full bg-black flex flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="p-8 border border-red-500/30 bg-red-500/5 rounded-2xl">
          <h2 className="text-3xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-400 max-w-md mb-6">{error}</p>
          <Link to="/" className="text-white hover:text-green-500 underline transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  {/* if (pages.length === 0) {
    return (
      <div className="h-dvh w-full bg-(--white) flex items-center justify-center text-xl text-white">
        This form has no questions.
      </div>
    );
  } */}

  // UPDATED: Logic for Page Count
  const totalSteps = pages.length + (hasReviewPage ? 1 : 0);
  const currentStep = currentPageIndex + 1;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const isReviewPage = hasReviewPage && currentPageIndex === pages.length;
  const currentPage = pages[currentPageIndex];

  const answersForReview = Object.keys(answers).map((questionID) => ({
    questionID: questionID,
    answer: answers[questionID],
  }));

  return (
    <>
      <ShaderBackground />
      <div className="h-dvh w-full flex flex-col relative z-10 font-sans">

        {/* Header */}
        <header className="w-full flex items-center justify-between py-6 px-8 md:px-12">
          <Link to={`/newform/${id}`} reloadDocument className="group">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-white transition-all">
              <div className="p-2 rounded-full transition-all">
                <IoArrowBack size={18} />
              </div>
              Exit Preview
            </button>
          </Link>
          <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
            {title}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-12 flex flex-col items-center">
          <div className="w-full max-w-3xl flex flex-col gap-6">

            {/*  Page/Step Indicator */}
            <div className="w-full space-y-3">
              <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                  {isReviewPage ? "Final Review" : `Progress`}
                </span>
                <span className="text-[11px] font-mono text-white">
                  Page <span className="text-green-500 font-bold">{currentStep}</span> of {totalSteps}
                </span>
              </div>
              {/* Visual bar remains as a subtle guide */}
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-700 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Form Card */}
            <div className="w-full bg-[#0A0A0A]/90 backdrop-blur-xl border pt-10 border-white/10 rounded-3xl shadow-2xl">
              <div className="min-h-[350px]">
                {isReviewPage ? (
                  <ReviewPage pages={pages} answers={answersForReview} />
                ) : currentPage?.questions.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-full text-center py-20">
                    <p className="text-gray-500 italic">No questions on this page.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {currentPage.questions
                      .sort((a, b) => a.order - b.order)
                      .map((q) => (
                        <div key={q.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                          <QuestionRenderer
                            question={q}
                            value={answers[q.id]}
                            onAnswer={(val) => updateAnswer(q.id, val)}
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Nav Buttons */}
              <div className="flex justify-between items-center mt-12  p-8 border-t border-white/5">
                <button
                  onClick={goPrev}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all
                    ${currentPageIndex === 0
                      ? "opacity-0 pointer-events-none"
                      : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                >
                  Previous
                </button>

                <button
                  onClick={goNext}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300
                    ${isReviewPage
                      ? "bg-green-700 text-white hover:bg-green-600 shadow-lg shadow-green-500/20"
                      : "bg-green-700 text-white hover:bg-green-600 shadow-lg shadow-green-500/20"}`}
                >
                  {isReviewPage
                    ? "Finish Preview"
                    : currentPageIndex === pages.length - 1 && hasReviewPage
                      ? "Review Answers"
                      : currentPageIndex === pages.length - 1
                        ? "Finish"
                        : "Next Page"}
                  <IoMdArrowRoundForward size={20} />
                </button>
              </div>
            </div>

            <p className="text-center text-gray-600 text-[11px] uppercase tracking-widest mt-4">
              Form Preview Mode &bull; Responses are not saved to database
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

export default Preview;