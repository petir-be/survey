import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { FaHome } from "react-icons/fa";
import { IoMdArrowRoundForward } from "react-icons/io";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

import ReviewPage from "../components/ReviewPage";
import QuestionRenderer from "../components/QuestionRenderer";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { motion } from "framer-motion";
import Loading from "../components/Loading";
import ShaderBackground from "../components/ShaderBackground"
const localStorageKey = (guid) => `formAnswersCache_${guid}`;

const loadAnswersFromCache = (key) => {
  try {
    const cachedAnswers = localStorage.getItem(key);
    if (cachedAnswers) {
      const parsedAnswers = JSON.parse(cachedAnswers);
      if (Array.isArray(parsedAnswers)) {
        console.log("Answers loaded from cache:", parsedAnswers);
        return parsedAnswers;
      }
    }
  } catch (e) {
    console.error("Could not load answers from cache", e);
  }
  return [];
};

const saveAnswersToCache = (key, currentAnswers) => {
  try {
    localStorage.setItem(key, JSON.stringify(currentAnswers));
    console.log("Answers saved to cache.");
  } catch (e) {
    console.error("Could not save answers to cache", e);
  }
};

const removeAnswersFromCache = (key) => {
  try {
    localStorage.removeItem(key);
    console.log("Cache cleared after submission.");
  } catch (e) {
    console.error("Could not clear cache", e);
  }
};

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
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState(() => loadAnswersFromCache(localStorageKey(guid)));
  const [validationErrors, setValidationErrors] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  // We use local state for "already submitted" only if we detect it locally or via error
  const [localAlreadySubmitted, setLocalAlreadySubmitted] = useState(false);

  // Reset state when guid changes
  useEffect(() => {
    setAnswers(loadAnswersFromCache(localStorageKey(guid)));
    setCurrentPageIndex(0);
    setValidationErrors([]);
    setHasSubmitted(false);
    setLocalAlreadySubmitted(false);
  }, [guid]);

  const {
    data: formDataResponse,
    isLoading: isFormLoading,
    error: formError
  } = useQuery({
    queryKey: ['form', guid],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/api/Form/view/${guid}`
      );
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Derived state
  const pages = formDataResponse?.formData || [];
  // Ensure pages is an array. If API returns something else or nothing, default to empty array.
  const validPages = Array.isArray(pages) ? pages : [];

  const hasReviewPage = formDataResponse?.hasReviewPage || false;
  const isPublished = formDataResponse?.isPublished ?? false;
  const allowMultipleSubmission = formDataResponse?.allowMultipleSubmissions || false;

  const submitMutation = useMutation({
    mutationFn: async () => {
      const dto = {
        responseData: answers,
      };
      return axios.post(
        `${import.meta.env.VITE_BACKEND}/api/Response/submit/${guid}`,
        dto,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      setHasSubmitted(true);
      removeAnswersFromCache(localStorageKey(guid));
    },
    onError: (err) => {
      if (err.response?.status === 409) {
        setLocalAlreadySubmitted(true);
        removeAnswersFromCache(localStorageKey(guid));
      }
    }
  });

  // Handle specific errors from query
  useEffect(() => {
    if (formError?.response?.status === 409) {
      setLocalAlreadySubmitted(true);
      removeAnswersFromCache(localStorageKey(guid));
    }
  }, [formError, guid]);

  const isReviewPage = hasReviewPage && currentPageIndex === validPages.length;

  const goNext = () => {
    if (!validateCurrentPage()) {
      return;
    }

    if (hasReviewPage && currentPageIndex < validPages.length) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (!hasReviewPage && currentPageIndex === validPages.length - 1) {
      submitMutation.mutate();
    } else if (hasReviewPage && currentPageIndex === validPages.length) {
      submitMutation.mutate();
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
          validPages
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
    const isReviewPage = hasReviewPage && currentPageIndex === validPages.length;
    if (isReviewPage) return true;

    const currentPageQuestions = validPages[currentPageIndex]?.questions || [];
    const failedQuestionIds = [];

    currentPageQuestions.forEach((q) => {
      if (q.required) {
        // Force both to strings to ensure "15" matches 15
        const answerObj = answers.find((a) => String(a.questionID) === String(q.id));
        const answerValue = answerObj?.answer;

        let isAnswered = false;

        if (Array.isArray(answerValue)) {
          isAnswered = answerValue.length > 0;
        } else if (typeof answerValue === "string") {
          isAnswered = answerValue.trim().length > 0;
        } else if (answerValue !== undefined && answerValue !== null) {
          // Additional check: if it's an object (like a file object), make sure it's not empty
          isAnswered = true;
        }

        if (!isAnswered) {
          failedQuestionIds.push(q.id);
        }

        // This log will now tell you if the types were the issue
        console.log(`ID: ${q.id} (${typeof q.id}) | Match: ${!!answerObj} | Answer:`, answerValue);
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

  if (isFormLoading || submitMutation.isPending) {
    return (
      <div className="h-dvh w-full bg-(--white) flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Handle errors
  if (formError || submitMutation.error) {
    const err = formError || submitMutation.error;

    // Check for 409 (Already Submitted)
    if (localAlreadySubmitted || err?.response?.status === 409) {
      return <AlreadySubmitted />;
    }

    // Check for Not Published - Only if it was a fetch error on isPublished? 
    // Or if we successfully fetched but it says not published.
    // The previous logic was: if (!isPublished) error.
    // If we have data, isPublished is false, we handle it below.
    // If we have error, we check status.

    if (err?.response?.status === 404) {
      return (
        <div className="h-dvh w-full bg-(--white) flex flex-col items-center justify-center gap-6 px-8 text-center">
          <h2 className="text-3xl font-bold text-red-600">Error</h2>
          <p className="text-lg text-gray-700 max-w-md">Form not found or the link is invalid.</p>
          <Link to="/" className="text-(--purple) underline text-lg">
            Back to Home
          </Link>
        </div>
      );
    }

    if (err?.response?.status === 403) {
      return (
        <div className="h-dvh w-full bg-(--white) flex flex-col items-center justify-center gap-6 px-8 text-center">
          <h2 className="text-3xl font-bold text-red-600">Error</h2>
          <p className="text-lg text-gray-700 max-w-md">You don't have permission to view this form.</p>
          <Link to="/" className="text-(--purple) underline text-lg">
            Back to Home
          </Link>
        </div>
      );
    }

    return (
      <div className="h-dvh w-full bg-(--white) flex flex-col items-center justify-center gap-6 px-8 text-center">
        <h2 className="text-3xl font-bold text-red-600">Error</h2>
        <p className="text-lg text-gray-700 max-w-md">
          {submitMutation.error ? "Failed to submit the form." : "Failed to load the form. Please try again."}
        </p>
        <Link to="/" className="text-(--purple) underline text-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  // If we have data but it's not published
  if (formDataResponse && !isPublished) {
    return <FormNotPublished />;
  }

  // If no pages and no error (e.g. empty form)
  if (validPages.length === 0) {
    return (
      <div className="h-dvh w-full bg-(--white) flex items-center justify-center text-xl text-gray-500">
        This form has no questions.
      </div>
    );
  }

  const currentPage = validPages[currentPageIndex];
  const progress = ((currentPageIndex + 1) / validPages.length) * 100;

  return (
    //nigga
    <>
      <ShaderBackground />
      <div className="h-dvh w-full flex flex-col overflow-hidden">
        {hasSubmitted ? (
          <SubmitDone allowMultipleSubmission={allowMultipleSubmission} />
        ) : (
          <>
            {/* progress bar */}
            <div className="z-50 px-10 py-4 w-full mb-5  border border-transparent">
              <div className="w-full max-w-5xl justify-self-center h-3 bg-black border-2  border-gray-200  rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>



            {/* questions d2*/}
            <div className="flex-1 overflow-y-auto px-10 pb-10 flex flex-col">
              <div className="relative max-w-4xl w-full mx-auto px-10 py-7 outline outline-gray-400 bg-black mt-1  flex flex-col justify-between">
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {isReviewPage ? (
                    <ReviewPage pages={validPages} answers={answers} />
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
                    className={`px-4 py-2 rounded-lg font-medium ${currentPageIndex === 0
                      ? "opacity-0 cursor-default"
                      : "opacity-100 bg-black text-white  ring-white ring hover:bg-[#1E1E1E] inset-shadow-md/10 font-vagrounded drop-shadow-sm/25 transition-color duration-200 ease-out"
                      }`}
                  >
                    Previous
                  </button>

                  <button
                    onClick={goNext}
                    className="flex bg-green-600  hover:bg-green-700 ring ring-white items-center text-white gap-1 pl-7 pr-6 py-1.5 rounded-xl font-vagrounded drop-shadow-sm/30 transition-color duration-200 ease-out
                    "
                  >
                    {isReviewPage ||
                      (!hasReviewPage && currentPageIndex === validPages.length - 1)
                      ? "Submit Response"
                      : currentPageIndex === validPages.length - 1 && hasReviewPage
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
    </>
  );
}

export default Response;
