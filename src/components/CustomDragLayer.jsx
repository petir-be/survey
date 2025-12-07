import React from "react";
import { useDragLayer } from "react-dnd";
import MultipleChoice from "./FormElements/MultipleChoice";
import Contact from "./FormElements/MultipleChoice";
import Checkbox from "./FormElements/Checkbox";
import Dropdown from "./FormElements/Dropdown";
import ChoiceMatrix from "./FormElements/ChoiceMatrix";
import Paragraph from "./FormElements/Paragraph";
import Heading from "./FormElements/Heading";
import LongText from "./FormElements/LongText";
import Email from "./FormElements/Email";
import PhoneNumber from "./FormElements/PhoneNumber";
import FileUploader from "./FormElements/FileUploader";
import ShortText from "./FormElements/ShortText";
import { motion } from "motion/react";


function getItemComponent(item) {
  {
    motion;
  }


  if (!item) return null;
  const title = item.title;
  const mockQuestion = {
    id: "preview",
    question:
      title === "Contact"
        ? "What is your contact information?"
        : title === "Multiple Choice"
        ? "Select one option:"
        : "Enter your question here",

    type:
      title === "Contact"
        ? "contact"
        : title === "Multiple Choice"
        ? "multiple_choice"
        : "text",

    order: 0,

    options: title === "Multiple Choice" ? ["Option 1", "Option 2"] : undefined,
  };
  const mockUpdate = () => {};
  const mockDelete = () => {};

  if (title === "Multiple Choice") {
    return (
      <MultipleChoice
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "Contact") {
    return (
      <Contact
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "Checkbox") {
    return (
      <Checkbox
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "Dropdown") {
    return (
      <Dropdown
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "Choice Matrix") {
    return (
      <ChoiceMatrix
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "Paragraph") {
    return (
      <Paragraph
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "Heading") {
    return (
      <Heading
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "Long Text") {
    return (
      <LongText
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "Email") {
    return (
      <Email
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "Phone Number") {
    return (
      <PhoneNumber
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "File Uploader") {
    return (
      <FileUploader
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }

  if (title === "Short Text") {
    return (
      <ShortText
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }


  // fallback
  return null;
}

export default function CustomDragLayer() {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
  }));

  if (!isDragging || !currentOffset) return null;

  const style = {
    position: "fixed",
    pointerEvents: "none",
    left: currentOffset.x,
    top: currentOffset.y,
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
  };

  return (
    <div style={style}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.95, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="w-120"
      >
        <div
          className={`border-2 border-(--purple) shadow-xl rounded-lg pointer-events-none`}
          style={{
            background: "#dfe0f0",
            opacity: 1,
          }}
        >
          {getItemComponent(item)}
        </div>
      </motion.div>
    </div>
  );
}
