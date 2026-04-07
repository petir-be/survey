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
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (from < to && hoverClientY < hoverMiddleY) return;
      if (from > to && hoverClientY > hoverMiddleY) return;

      moveLayer(from, to);
      dragged.index = to;
    },
  });


  drop(ref);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{
        scale: isDragging ? 1.02 : 1,
        opacity: isDragging ? 0.4 : 1,
        y: 0,
        backgroundColor: isDragging ? "#000000" : "rgba(9, 9, 11, 0.5)",
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
        opacity: { duration: 0.2 }
      }}
      className={`
        relative flex items-center justify-between  p-4 mb-3 my-2 
        bg-zinc-950/50 backdrop-blur-sm border border-zinc-800 
        rounded-xl group select-none
        hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)]
      `}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">

        <span
          ref={drag}
          className="text-zinc-600 hover:text-emerald-500 text-lg cursor-grab active:cursor-grabbing flex-shrink-0 p-1 transition-colors"
          title="Drag to reorder"
        >
          <FaGripVertical />
        </span>

        <div className="flex-1 min-w-0">
          <div className="font-vagrounded font-bold text-[13px] text-zinc-100 truncate mb-1">
            {question.question || "Untitled Question"}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {question.type}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-2 relative z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(question.id);
          }}
          className="p-2 rounded-lg text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <FaTrashAlt size={14} />
        </button>
      </div>

   
      <div className="absolute left-0 w-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
    </motion.div>
  );
}