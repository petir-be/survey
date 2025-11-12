import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useEffect } from "react";

function FormElement({ title, icon: Icon }) {
  const [{ isDragging }, dragRef, preview] = useDrag({
    type: "PALETTE_ITEM",
    item: { title, Icon },
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
      className="w-full min-h-20 flex gap-2 flex-col ring drag-item ring-white overflow-hidden font-vagrounded items-center justify-center rounded-xl shadow-[0px_1px_4px_2px_rgba(0,0,0,0.25)]"
    >
      <Icon className="text-2xl text-(--black)" />
      <p className="w-11/12 text-sm leading-4 text-center">{title}</p>
    </div>
  );
}

export default FormElement;
