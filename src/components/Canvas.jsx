import { useDrop } from "react-dnd";
import DotShader2 from "./DotShader2";
import Contact from "./FormElements/Contact";
import Page from "./Page";

function Canvas({ elements, onDropElement }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "PALETTE_ITEM",
    drop: (item) => {
      onDropElement(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <div
      ref={dropRef}
      className="h-full w-3/7  border-2 border-[var(--dirty-white)] overflow-hidden flex justify-center items-center flex-col "
    >
      <DotShader2 />

      <Page />

    </div>
  );

 
}

export default Canvas;
