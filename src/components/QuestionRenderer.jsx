import React, { Component } from "react";

import MultipleChoice from "./ResponseQuestions/MultipleChoice";
import Contact from "./ResponseQuestions/MultipleChoice";
import Checkbox from "./ResponseQuestions/Checkbox";
import Dropdown from "./ResponseQuestions/MultipleChoice";
import ChoiceMatrix from "./ResponseQuestions/ChoiceMatrix";
import Paragraph from "./ResponseQuestions/MultipleChoice";
import Heading from "./ResponseQuestions/MultipleChoice";
import LongText from "./ResponseQuestions/MultipleChoice";
import Email from "./ResponseQuestions/MultipleChoice";
import PhoneNumber from "./ResponseQuestions/MultipleChoice";
import FileUpload from "./ResponseQuestions/MultipleChoice";
import ShortText from "./ResponseQuestions/MultipleChoice";

function QuestionRenderer({ question, value, onAnswer }) {
  const QUESTION_TYPES = {
    multiple_choice: MultipleChoice,
    checkbox: Checkbox,
    choice_matrix: ChoiceMatrix,
  };

  const Component = QUESTION_TYPES[question.type];

  if (!Component) {
    return <div> Unsupported question type.</div>;
  }

  return <Component question={question} value={value} onChange={onAnswer} />;
}

export default QuestionRenderer;
