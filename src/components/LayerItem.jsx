import React, { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaGripVertical, FaTrashAlt } from "react-icons/fa";
import { motion } from "motion/react";
import { getEmptyImage } from "react-dnd-html5-backend";

const ItemTypes = {
  LAYER: "LAYER",
};

export default function LayerItem({ question, index, moveLayer, onDelete }) {
  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.LAYER,
    item: { index, id: question.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.LAYER,
    hover(dragged, monitor) {
      if (!ref.current) return;

      const from = dragged.index;
      const to = index;
      if (from === to) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (from < to && hoverClientY < hoverMiddleY) return;

      if (from > to && hoverClientY > hoverMiddleY) return;

      moveLayer(from, to);
      dragged.index = to;
    },
  });

  drag(drop(ref));
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <motion.div
      ref={ref}
      layout="position"
      initial={{ opacity: 0, y: -6 }}
      animate={{
        scale: isDragging ? 0.98 : 1,
        opacity: isDragging ? 0.75 : 1,
        y: 0,
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative flex items-center justify-between gap-2 p-3 rounded mb-2 bg-(--white) ring ring-white shadow-[0px_1px_4px_2px_rgba(0,0,0,0.15)] m-2 will-change-transform`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span
          className="text-gray-500 text-lg cursor-grab flex-shrink-0"
          title="Drag to reorder"
        >
          <FaGripVertical />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm break-words line-clamp-4">
            {question.question || question.type}
          </div>
          <div className="text-xs text-gray-500">Type: {question.type}</div>
        </div>
      </div>
      <div className="flex-shrink-0 ml-2">
        <button
          onClick={() => onDelete(question.id)}
          title="Delete"
          className="text-red-500 hover:text-red-700"
        >
          <FaTrashAlt />
        </button>
      </div>
    </motion.div>
  );
}
