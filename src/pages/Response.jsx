import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { FaHome } from "react-icons/fa";
import { IoMdArrowRoundForward } from "react-icons/io";
import axios from "axios";
import DotShader2 from "../components/DotShader2";
import ReviewPage from "../components/ReviewPage";
import QuestionRenderer from "../components/QuestionRenderer";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { motion } from "framer-motion";
import Loading from "../components/Loading";

const localStorageKey = (guid) => `formAnswersCache_${guid}`;

function SubmitDone({ allowMultipleSubmission }) {
  return (
    <div className="w-full font-vagrounded min-h-dvh flex justify-center items-center flex-col">
      {/* Animated Success Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="relative"
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="drop-shadow-lg"
        >
          {/* Circle - appears with scale + subtle bounce */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="#10b981"
            stroke="#10b981" // emerald-500
            strokeWidth="6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1], // strong easeOutBack
            }}
          />

          {/* Checkmark - draws itself after circle */}
          <motion.path
            d="M 28 50 L 42 64 L 72 34"
            fill="none"
            stroke="#fff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              pathLength: { delay: 0.4, duration: 0.5, ease: "easeInOut" },
              opacity: { delay: 0.4, duration: 0.01 },
            }}
          />
        </svg>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className=" mt-5 text-center"
      >
        <p className="text-5xl font-bold italic text-gray-800">Thank you!</p>
        <p className="text-2xl font-medium text-gray-600 mt-1">
          Your response has been recorded.
        </p>
        {allowMultipleSubmission ? (
          <button onClick={() => window.location.reload()}>
            <p className="mt-8 text-lg underline underline-offset-4 text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors">
              Submit another response
            </p>
          </button>
        ) : (
          <p></p>
        )}
      </motion.div>
    </div>
  );
}

function AlreadySubmitted() {
  return (
    <>
      <div className="w-full font-vagrounded min-h-dvh flex justify-center items-center flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className=" mt-5 text-center"
        >
          <p className="text-5xl font-bold italic text-gray-800">You Again?</p>
          <p className="text-2xl font-medium text-gray-600 mt-1">
            Thank you but you already submitted in this form.
          </p>
          <p className="mt-4 text-lg font-medium cursor-pointer  ">
            If you think this is an error,{" "}
            <span className="text-blue-600 hover:text-blue-700 transition-colors underline">
              contact the owner for details.
            </span>
          </p>
        </motion.div>
      </div>
    </>
  );
}

function FormNotPublished() {
  return (
    <>
      <div className="w-full font-vagrounded min-h-dvh flex justify-center items-center flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className=" mt-5 text-center"
        >
          <p className="text-5xl font-bold italic text-gray-800">
            Form not published
          </p>
          <p className="text-2xl font-medium text-gray-600 mt-1">
            We are sorry, document is not published yet.
          </p>
          <p className="mt-4 text-lg font-medium cursor-pointer  ">
            If you think this is an error,{" "}
            <span className="text-blue-600 hover:text-blue-700 transition-colors underline">
              contact the owner for details.
            </span>
          </p>
        </motion.div>
      </div>
    </>
  );
}

function Response() {
  const { guid } = useParams();
  const [id, setId] = useState(0);
  const [pages, setPages] = useState([]);
  const [title, setTitle] = useState("Untitled Form");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allowMultipleSubmission, setAllowMultipleSubmission] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [hasReviewPage, setHasReviewPage] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const loadAnswersFromCache = (key) => {
    try {
      const cachedAnswers = localStorage.getItem(key);
      if (cachedAnswers) {
        // Parse the JSON data from cache
        const parsedAnswers = JSON.parse(cachedAnswers);
        // Only return it if it's an array (basic validation)
        if (Array.isArray(parsedAnswers)) {
          console.log("Answers loaded from cache:", parsedAnswers);
          return parsedAnswers;
        }
      }
    } catch (e) {
      console.error("Could not load answers from cache", e);
    }
    return []; // Return an empty array if loading fails
  };

  const saveAnswersToCache = (key, currentAnswers) => {
    try {
      localStorage.setItem(key, JSON.stringify(currentAnswers));
      console.log("Answers saved to cache.");
    } catch (e) {
      console.error("Could not save answers to cache", e);
    }
  };

  useEffect(() => {
    if (!guid) return;
    setAnswers(loadAnswersFromCache(localStorageKey(guid)));

    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/Form/view/${guid}`
        );

        const { id, title, formData } = response.data;
        setId(id);
        setHasReviewPage(response.data.hasReviewPage);
        setIsPublished(response.data.isPublished);
        setAllowMultipleSubmission(response.data.allowMultipleSubmissions);

        // console.log(response.data);

        // console.log(typeof formData);

        if (alreadySubmitted) {
          setAlreadySubmitted(true);
          removeAnswersFromCache();
          return;
        }

        if (!Array.isArray(formData) || formData.length === 0) {
          setError("This form has no questions.");
          setPages([]);
        } else {
          setPages(formData);
          setTitle(title || "Untitled Form");
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 409) {
          setAlreadySubmitted(true);
          removeAnswersFromCache();

          setError("You have already submitted in this form.");
        } else if (!isPublished) {
          setError(
            "Form is not published. Please contact the owner for more details."
          );
        } else if (err.response?.status === 404) {
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

  const removeAnswersFromCache = () => {
    try {
      localStorage.removeItem(localStorageKey(guid));
      console.log("Cache cleared after submission.");
    } catch (e) {
      console.error("Could not clear cache", e);
    }
  };

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
      setHasSubmitted(true);
      removeAnswersFromCache();
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

  const isReviewPage = hasReviewPage && currentPageIndex === pages.length;
  const goNext = () => {
    if (!validateCurrentPage()) {
      return;
    }

    if (hasReviewPage && currentPageIndex < pages.length) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (!hasReviewPage && currentPageIndex === pages.length - 1) {
      submitAnswers();
    } else if (hasReviewPage && currentPageIndex === pages.length) {
      submitAnswers();
    } else {
      setCurrentPageIndex(currentPageIndex + 1);
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

      let updated;

      if (existingIndex > -1) {
        // Update existing
        updated = [...prev];
        updated[existingIndex] = { questionID: questionId, answer: value };
      } else {
        // Add new
        updated = [...prev, { questionID: questionId, answer: value }];
      }

      // Save updated answers to cache immediately
      saveAnswersToCache(localStorageKey(guid), updated);

      setValidationErrors((prevErrors) => {
        const isValidNow = checkSingleQuestionValidity(
          questionId,
          updated,
          pages
        );

        if (isValidNow) {
          return prevErrors.filter((id) => id !== questionId);
        }
        return prevErrors;
      });

      return updated;
    });
  };

  function checkSingleQuestionValidity(
    questionId,
    currentAnswers,
    allQuestions
  ) {
    const question = allQuestions
      .flatMap((page) => page.questions)
      .find((q) => q.id === questionId);

    if (!question || !question.required) {
      return true; // Not a required question, so it's valid
    }

    const answerObj = currentAnswers.find((a) => a.questionID === questionId);
    const answerValue = answerObj?.answer;

    let isAnswered = false;

    // Logic for determining "answered" (mirrored from validateCurrentPage)
    if (Array.isArray(answerValue)) {
      isAnswered = answerValue.length > 0;
    } else if (typeof answerValue === "string") {
      isAnswered = answerValue.trim().length > 0;
    } else if (answerValue !== undefined && answerValue !== null) {
      isAnswered = true;
    }

    return isAnswered;
  }

  function validateCurrentPage() {
    const isReviewPage = hasReviewPage && currentPageIndex === pages.length;
    if (isReviewPage) return true;

    const currentPageQuestions = pages[currentPageIndex]?.questions || [];
    const failedQuestionIds = [];

    currentPageQuestions.forEach((q) => {
      if (q.required) {
        const answerObj = answers.find((a) => a.questionID === q.id);
        const answerValue = answerObj?.answer;

        let isAnswered = false;

        // ... (Your existing logic to determine isAnswered) ...
        if (Array.isArray(answerValue)) {
          isAnswered = answerValue.length > 0;
        } else if (typeof answerValue === "string") {
          isAnswered = answerValue.trim().length > 0;
        } else if (answerValue !== undefined && answerValue !== null) {
          isAnswered = true;
        }

        if (!isAnswered) {
          failedQuestionIds.push(q.id); // Collect the ID of the failed question
        }
      }
    });

    // 1. Update the error state
    setValidationErrors(failedQuestionIds);

    // 2. Return true only if no required questions failed validation
    const isValid = failedQuestionIds.length === 0;

    if (!isValid) {
      // Provide user feedback
      alert(
        `Please answer ${failedQuestionIds.length} required question(s) before continuing.`
      );
    }

    return isValid;
  }

  if (loading) {
    return (
      <div className="h-dvh w-full bg-(--white) flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isPublished) {
    return (
      <>
        <FormNotPublished />
      </>
    );
  }

  if (error) {
    if (alreadySubmitted) {
      return (
        <>
          <AlreadySubmitted />
        </>
      );
    }

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
      {hasSubmitted ? (
        <SubmitDone allowMultipleSubmission={allowMultipleSubmission} />
      ) : (
        <>
          {/* progress bar */}
          <div className="z-50 bg-(--white) px-10 py-4 w-full mb-5 border-b-(--dirty-white) border border-transparent">
            <div className="w-full max-w-5xl justify-self-center h-3 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-(--purple) transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <DotShader2 className="z-50" />

          {/* questions d2*/}
          <div className="flex-1 overflow-y-auto px-10 pb-10 flex flex-col">
            <div className="relative max-w-4xl w-full mx-auto px-10 py-7 border-gradient bg-(--white) pageBorder drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-between">
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {isReviewPage ? (
                  <ReviewPage pages={pages} answers={answers} />
                ) : (
                  <>
                    {currentPage?.questions.length === 0 ? (
                      <div className="flex justify-center items-center text-xl text-gray-400 w-full h-full text-center">
                        Current page has no questions available.
                      </div>
                    ) : (
                      <div className="space-y-10 p-1">
                        {currentPage.questions
                          .sort((a, b) => a.order - b.order)
                          .map((q) => {
                            const currentAnswerObj = answers.find(
                              (a) => a.questionID === q.id
                            );
                            const isFileQuestion =
                              q.type === "File" || q.questionType === "File";

                            let currentValue;
                            if (currentAnswerObj) {
                              currentValue = currentAnswerObj.answer;
                            } else {
                             
                              currentValue = isFileQuestion ? [] : "";
                            }
                            return (
                              <QuestionRenderer
                                key={q.id}
                                question={q}
                                value={currentValue}
                                onAnswer={(val) => updateAnswer(q.id, val)}
                                hasError={validationErrors.includes(q.id)}
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
                        ? "bg-(--white) ring ring-green-500 hover:bg-green-200"
                        : "bg-(--white) ring ring-(--purple) inset-shadow-md/10 hover:bg-violet-200"
                    }`}
                >
                  {isReviewPage ||
                  (!hasReviewPage && currentPageIndex === pages.length - 1)
                    ? "Submit Response"
                    : currentPageIndex === pages.length - 1 && hasReviewPage
                    ? "Review Answers"
                    : "Next"}
                  <IoMdArrowRoundForward />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Response;
