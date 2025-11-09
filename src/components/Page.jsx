import { useDrop } from "react-dnd";
import Contact from "./FormElements/Contact";
import MultipleChoice from "./FormElements/MultipleChoice";

function DropZone({ index, onInsert }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "PALETTE_ITEM",
    drop: (item) => {
      onInsert(item, index);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    <div
      ref={dropRef}
      className={`w-full min-h-2 flex items-center justify-center transition-all my-2 rounded ${
        isOver ? "bg-purple-200" : "bg-transparent"
      }`}
    >
      {isOver && <div className="h-1 w-full bg-blue-600 rounded" />}
    </div>
  );
}

function renderElement(element) {
  if (!element) return null;
  if (element.title === "Contact") return <Contact element={element} />;
  if (element.title === "Multiple Choice")
    return <MultipleChoice element={element} />;

  return (
    <div className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white">
      <div className="mb-2">
        <p className="font-medium">{element.title}</p>
      </div>
    </div>
  );
}

function Page({ elements = [], onInsert }) {
  return (
    <>
      <div className="w-full px-7 ">
        <h1 className="text-xl text-left font-vagrounded mb-2">Page 1</h1>
      </div>
      <div className="w-[92%] flex flex-col overflow-hidden min-h-[87%] bg-[#DFE0F0] items-start border-gradient pageBorder drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] py-6 px-4 gap-2">
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] w-full pr-2">
          {elements.length === 0 && (
            <div className="w-full flex justify-center items-center h-screen text-gray-600 py-10 ">
              Drag and Drop From Left Side
            </div>
          )}

          <DropZone index={0} onInsert={onInsert} />
          {elements.map((el, idx) => (
            <div key={el.id} className="w-full">
              <div>{renderElement(el)}</div>
              <DropZone index={idx + 1} onInsert={onInsert} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mt-2.5 text-3xl cursor-pointer">+</p>
      </div>
    </>
  );
}

export default Page;
