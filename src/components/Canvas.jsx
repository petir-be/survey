import { useDrop } from "react-dnd";
import DotShader2 from "./DotShader2";
import Page from "./Page";
import CustomDragLayer from "./CustomDragLayer";

function Canvas({ elements, onDropElement }) {
  const [, dropRef] = useDrop({
    accept: "PALETTE_ITEM",
    drop: (item) => {
      onDropElement(item);
    },
    collect: () => ({}),
  });

  return (
    <div
      ref={dropRef}
      className="h-full w-full flex justify-center items-center flex-col overflow-auto mb-10"
    >
      <CustomDragLayer />
      <DotShader2 />
      <Page elements={elements} onInsert={onDropElement} />
    </div>
  );
}

export default Canvas;
