import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { IoMdArrowRoundForward } from "react-icons/io";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

import ReviewPage from "../components/ReviewPage";
import QuestionRenderer from "../components/QuestionRenderer";
import { motion } from "framer-motion";
import Loading from "../components/Loading";
import ShaderBackground from "../components/ShaderBackground";

const localStorageKey = (guid) => `formAnswersCache_${guid}`;

const loadAnswersFromCache = (key) => {
  try {
    const cachedAnswers = localStorage.getItem(key);
    if (cachedAnswers) {
      const parsedAnswers = JSON.parse(cachedAnswers);
      if (Array.isArray(parsedAnswers)) return parsedAnswers;
    }
  } catch (e) { console.error("Could not load answers from cache", e); }
  return [];
};

const saveAnswersToCache = (key, currentAnswers) => {
  try { localStorage.setItem(key, JSON.stringify(currentAnswers)); }
  catch (e) { console.error("Could not save answers to cache", e); }
};

const removeAnswersFromCache = (key) => {
  try { localStorage.removeItem(key); }
  catch (e) { console.error("Could not clear cache", e); }
};

function SubmitDone({ allowMultipleSubmission }) {
  return (
    <div className="w-full font-vagrounded min-h-dvh flex justify-center items-center flex-col relative z-10 px-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: "backOut" }}>
        <svg width="120" height="120" viewBox="0 0 100 100">
          <motion.circle cx="50" cy="50" r="45" fill="#10b981" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }} />
          <motion.path d="M 28 50 L 42 64 L 72 34" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ pathLength: { delay: 0.4, duration: 0.5 } }} />
        </svg>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-8 text-center">
        <p className="text-5xl font-bold italic text-white mb-2">Thank you!</p>
        <p className="text-xl text-zinc-400">Your response has been recorded.</p>
        {allowMultipleSubmission && (
          <button onClick={() => window.location.reload()} className="mt-10 px-8 py-3 bg-zinc-900 border border-zinc-700 text-white rounded-xl hover:bg-zinc-800 transition-all font-bold">
            Submit another response
          </button>
        )}
      </motion.div>
    </div>
  );
}

function StatusMessage({ title, message, subtext }) {
  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center gap-6 px-8 text-center relative z-10">
      <div className="p-10 border border-white/10 bg-black/60 backdrop-blur-xl rounded-3xl max-w-lg">
        <h2 className="text-4xl font-bold text-white mb-4 italic">{title}</h2>
        <p className="text-zinc-400 text-lg mb-6">{message}</p>
        {subtext && <p className="text-sm text-zinc-500">{subtext}</p>}
        <Link to="/" className="mt-8 inline-block text-emerald-500 hover:text-emerald-400 underline transition-colors">Back to Home</Link>
      </div>
    </div>
  );
}

function Response() {
  const { guid } = useParams();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState(() => loadAnswersFromCache(localStorageKey(guid)));
  const [validationErrors, setValidationErrors] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [localAlreadySubmitted, setLocalAlreadySubmitted] = useState(false);

  useEffect(() => {
    setAnswers(loadAnswersFromCache(localStorageKey(guid)));
    setCurrentPageIndex(0);
    setValidationErrors([]);
    setHasSubmitted(false);
    setLocalAlreadySubmitted(false);
  }, [guid]);

  const { data: formDataResponse, isLoading: isFormLoading, error: formError } = useQuery({
    queryKey: ['form', guid],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/Form/view/${guid}`);
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const validPages = Array.isArray(formDataResponse?.formData) ? formDataResponse.formData : [];
  const hasReviewPage = formDataResponse?.hasReviewPage || false;
  const isPublished = formDataResponse?.isPublished ?? false;
  const allowMultipleSubmission = formDataResponse?.allowMultipleSubmissions || false;
  const title = formDataResponse?.title || "Form";

  const submitMutation = useMutation({
    mutationFn: async () => {
      return axios.post(`${import.meta.env.VITE_BACKEND}/api/Response/submit/${guid}`, { responseData: answers }, { withCredentials: true });
    },
    onSuccess: () => { setHasSubmitted(true); removeAnswersFromCache(localStorageKey(guid)); },
    onError: (err) => {
      if (err.response?.status === 409) {
        setLocalAlreadySubmitted(true);
        removeAnswersFromCache(localStorageKey(guid));
      }
    }
  });

  useEffect(() => {
    if (formError?.response?.status === 409) {
      setLocalAlreadySubmitted(true);
      removeAnswersFromCache(localStorageKey(guid));
    }
  }, [formError, guid]);

  const isReviewPage = hasReviewPage && currentPageIndex === validPages.length;

  const goNext = () => {
    if (!validateCurrentPage()) return;
    if (hasReviewPage && currentPageIndex < validPages.length) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else if ((!hasReviewPage && currentPageIndex === validPages.length - 1) || (hasReviewPage && currentPageIndex === validPages.length)) {
      submitMutation.mutate();
    } else {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goPrev = () => { if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1); };

  const updateAnswer = (questionId, value) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((item) => item.questionID === questionId);
      let updated = existingIndex > -1 ? [...prev] : [...prev, { questionID: questionId, answer: value }];
      if (existingIndex > -1) updated[existingIndex] = { questionID: questionId, answer: value };
      saveAnswersToCache(localStorageKey(guid), updated);

      if (checkSingleQuestionValidity(questionId, updated, validPages)) {
        setValidationErrors((prevErrors) => prevErrors.filter((id) => id !== questionId));
      }
      return updated;
    });
  };

  function checkSingleQuestionValidity(questionId, currentAnswers, allQuestions) {
    const question = allQuestions.flatMap((page) => page.questions).find((q) => q.id === questionId);
    if (!question || !question.required) return true;
    const answerObj = currentAnswers.find((a) => a.questionID === questionId);
    const val = answerObj?.answer;
    return Array.isArray(val) ? val.length > 0 : (typeof val === "string" ? val.trim().length > 0 : (val !== undefined && val !== null));
  }

  function validateCurrentPage() {
    if (isReviewPage) return true;
    const currentPageQuestions = validPages[currentPageIndex]?.questions || [];
    const failedIds = currentPageQuestions.filter(q => {
      if (!q.required) return false;
      const ans = answers.find(a => String(a.questionID) === String(q.id))?.answer;
      return Array.isArray(ans) ? ans.length === 0 : (typeof ans === "string" ? ans.trim().length === 0 : (ans === undefined || ans === null));
    }).map(q => q.id);

    setValidationErrors(failedIds);
    if (failedIds.length > 0) alert(`Please answer all ${failedIds.length} required question(s).`);
    return failedIds.length === 0;
  }

  if (isFormLoading || submitMutation.isPending) return <div className="h-dvh w-full bg-black flex items-center justify-center"><Loading /></div>;

  if (localAlreadySubmitted || formError?.response?.status === 409 || submitMutation.error?.response?.status === 409) return <StatusMessage title="You Again?" message="You have already submitted a response for this form." />;
  if (formError?.response?.status === 404) return <StatusMessage title="404" message="Form not found or link is invalid." />;
  if (formDataResponse && !isPublished) return <StatusMessage title="Not Published" message="This document is not currently accepting responses." />;
  if (validPages.length === 0) return <div className="h-dvh w-full bg-black flex items-center justify-center text-zinc-500 font-vagrounded">This form has no questions.</div>;

  const totalSteps = validPages.length + (hasReviewPage ? 1 : 0);
  const currentStep = currentPageIndex + 1;
  const progressPercentage = (currentStep / totalSteps) * 100;
  const currentPage = validPages[currentPageIndex];

  return (
    <>
      <ShaderBackground />
      <div className="h-dvh w-full flex flex-col relative z-10 font-sans text-white overflow-hidden">
        {hasSubmitted ? (
          <SubmitDone allowMultipleSubmission={allowMultipleSubmission} />
        ) : (
          <>
            <header className="w-full flex items-center justify-between py-6 px-8 md:px-12">

              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold">{title}</div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 pb-12 flex flex-col items-center no-scrollbar">
              <div className="w-full max-w-3xl flex flex-col gap-6">

                {/* Progress UI */}
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-bold text-green-500  uppercase tracking-widest">
                      {isReviewPage ? "Final Review" : "Progress"}
                    </span>
                    <span className="text-[11px] font-vagrounded text-zinc-400">
                      Page <span className="text-green-500 font-bold">{currentStep}</span> of {totalSteps}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-green-500 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Form Content Card */}
                <div className="w-full bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl py-8 px-2 md:p-10">
                  <div className="min-h-[350px]">
                    {isReviewPage ? (
                      <ReviewPage pages={validPages} answers={answers} />
                    ) : (
                      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {currentPage?.questions.sort((a, b) => a.order - b.order).map((q) => {
                          const currentAnswer = answers.find(a => a.questionID === q.id)?.answer;
                          const isFile = q.type === "File" || q.questionType === "File";
                          return (
                            <QuestionRenderer
                              key={q.id}
                              question={q}
                              value={currentAnswer ?? (isFile ? [] : "")}
                              onAnswer={(val) => updateAnswer(q.id, val)}
                              hasError={validationErrors.includes(q.id)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                    <button
                      onClick={goPrev}
                      disabled={currentPageIndex === 0}
                      className={`px-6 py-2.5 rounded-xl font-medium transition-all font-vagrounded ${currentPageIndex === 0 ? "opacity-0 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      Previous
                    </button>

                    <button
                      onClick={goNext}
                      className="flex items-center justify-center gap-2 px-4 md:px-8 py-3 bg-green-700 hover:bg-green-600 shadow-green-500/20 text-white rounded-xl font-bold transition-all duration-300 shadow-lg font-vagrounded whitespace-nowrap text-sm md:text-base"                    >
                      {isReviewPage || (!hasReviewPage && currentPageIndex === validPages.length - 1)
                        ? "Submit Response"
                        : currentPageIndex === validPages.length - 1 && hasReviewPage
                          ? "Review Answers"
                          : "Next Page"}
                      <IoMdArrowRoundForward size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </>
  );
}

export default Response;