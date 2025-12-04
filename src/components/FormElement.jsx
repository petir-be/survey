import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useEffect } from "react";

function FormElement({ title, icon: Icon, foreKulay, bgKulay }) {
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
      className="w-full flex flex-col pt-3 items-center min-h-20 text-center pb-1.5 ring drag-item ring-white overflow-hidden  rounded shadow-[0px_1px_4px_2px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_5px_2px_rgba(132,95,255,0.5)]"
    >
      <div
        className={`ring min-w-7 h-7 flex justify-center items-center ring-(${foreKulay}) rounded bg-${bgKulay} p-0.5`}
      >
        <Icon className=" text-xl " fill={foreKulay} />
      </div>

      <div className="w-full px-1 text-xs mt-3 leading-3 flex-justify-center text-center font-vagrounded font-semibold">
        {title}
      </div>
    </div>
  );
}

export default FormElement;

// <button type="button" id="Checkbox-------------choices" role="button" tabindex="0" aria-roledescription="draggable" aria-describedby="DndDescribedBy-0" class="bg-white px-[3px] flex flex-col pt-3 pb-[6px] items-center  rounded-md cursor-pointer  border border-white shadow hover:shadow-md hover:shadow-gray-400/50 w-full" data-cy="component-bar-widget-option"><div class="p-1 rounded bg-gray-50 border-[0.5px]" style="color: rgb(245, 158, 11); background: rgb(255, 251, 235); border-color: rgb(253, 230, 138);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-5 w-5"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div><div class="text-gray-700 text-xs font-medium flex justify-center mt-2 text-center leading-3 h-6 items-center">Checkbox</div></button>
