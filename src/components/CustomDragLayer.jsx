import React from "react";
import { useDragLayer } from "react-dnd";
import Contact from "./FormElements/Contact";
import MultipleChoice from "./FormElements/MultipleChoice";
import Checkbox from "./FormElements/Checkbox";
import { motion } from "motion/react";

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

  if (title === "Contact"){
    return (
      <Contact
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }
  if(title === "Multiple Choice"){
    return (
      <MultipleChoice

        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }
  if(title === "Checkbox"){
    return (
      <Checkbox
        question={mockQuestion}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
      />
    );
  }
 
    
  
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
        {getItemComponent(item)}
      </motion.div>
    </div>
  );
}
