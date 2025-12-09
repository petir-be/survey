import React, { Component } from "react";

import MultipleChoice from "./ResponseQuestions/MultipleChoice";
import Contact from "./ResponseQuestions/MultipleChoice";
import Checkbox from "./ResponseQuestions/Checkbox";
import Dropdown from "./ResponseQuestions/Dropdown";
import ChoiceMatrix from "./ResponseQuestions/ChoiceMatrix";
import Paragraph from "./ResponseQuestions/Paragraph";
import Heading from "./ResponseQuestions/Heading";
import LongText from "./ResponseQuestions/LongText";
import Email from "./ResponseQuestions/Email";
import PhoneNumber from "./ResponseQuestions/PhoneNumber";
import FileUploader from "./ResponseQuestions/FileUploader";
import ShortText from "./ResponseQuestions/ShortText";
import Switch from "./ResponseQuestions/Switch";

function QuestionRenderer({ question, value, onAnswer }) {
  const QUESTION_TYPES = {
    multiple_choice: MultipleChoice,
    checkbox: Checkbox,
    choice_matrix: ChoiceMatrix,
    email: Email,
    long_text: LongText,
    short_text: ShortText,
    heading: Heading,
    paragraph: Paragraph,
    file_uploader: FileUploader,
    dropdown: Dropdown,
    phone_number: PhoneNumber,
    switch:Switch,
  };

  const Component = QUESTION_TYPES[question.type];

  if (!Component) {
    return <div> Unsupported question type.</div>;
  }

  return <Component question={question} value={value} onChange={onAnswer} />;
}

export default QuestionRenderer;
