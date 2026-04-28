import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useEffect } from "react";

function FormElement({ title, icon: Icon, foreKulay, bgKulay, onDragStart, onDragEnd }) {
  const [{ isDragging }, dragRef, preview] = useDrag({
    type: "PALETTE_ITEM",
    item: () => {
      onDragStart?.();          //hide modal when drag begins
      return { title, Icon };
    },
    end: () => {
      onDragEnd?.();            // show modal again after drop/cancel
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: false });
  }, [preview]);

  return (
    <div
      ref={dragRef}
      className="w-full bg-[#1e1e1e] ring flex flex-col pt-3 items-center min-h-20 text-center pb-1.5 rounded-[6px] drag-item overflow-hidden shadow-[0px_1px_4px_2px_rgba(0,0,0,0.1)] transition-all duration-600 ease hover:bg-[#2a2a2a]"
    >
      <div
        className="min-w-7 h-7 flex justify-center items-center rounded p-0.5"
        style={{
          borderColor: foreKulay,
          backgroundColor: bgKulay,
          borderWidth: foreKulay ? 1 : 0,
        }}
      >
        <Icon className="text-xl" style={{ fill: foreKulay || "black" }} />
      </div>
      <div className="w-full text-white px-1 text-xs mt-3 leading-3 flex-justify-center text-center font-vagrounded font-semibold">
        {title}
      </div>
    </div>
  );
}

export default FormElement;