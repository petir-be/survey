import React from "react";
import { useDragLayer } from "react-dnd";
import Contact from "./FormElements/Contact";
import MultipleChoice from "./FormElements/MultipleChoice";

function getItemComponent(item) {
  if (!item) return null;
  const title = item.title;
  if (title === "Contact") return <Contact element={{ title: item.title }} />;
  if (title === "Multiple Choice")
    return <MultipleChoice element={{ title: item.title }} />;
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
