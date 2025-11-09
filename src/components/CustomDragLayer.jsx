import React from "react";
import { useDragLayer } from "react-dnd";
import Contact from "./FormElements/Contact";
import MultipleChoice from "./FormElements/MultipleChoice";

function getItemComponent(item) {
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

  if (title === "Contact")
    return (
      <Contact
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  if (title === "Multiple Choice")
    return (
      <MultipleChoice
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );

  return (
    <div className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white">
      <div className="mb-2">
        <p className="font-medium">{title}</p>
      </div>
      <div className="text-sm text-gray-600">Preview</div>
    </div>
  );
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
      <div className="opacity-90 w-64">{getItemComponent(item)}</div>
    </div>
  );
}
