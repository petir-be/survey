import { useDrop } from "react-dnd";
import DotShader2 from "./DotShader2";
import Page from "./Page";
import CustomDragLayer from "./CustomDragLayer";

function Canvas({
  questions,
  onDropElement,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddPage,
  onRemovePage,
  currentPageIndex,
  pageNumber,
  totalPages,
  onPageChange,
}) {
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
      className="h-full w-full flex justify-center items-center flex-col overflow-auto mb-20"
    >
      <CustomDragLayer />
      <DotShader2 />
      <Page
        questions={questions}
        onInsert={onDropElement}
        onUpdateQuestion={onUpdateQuestion}
        onDeleteQuestion={onDeleteQuestion}
        onAddPage={onAddPage}
        onRemovePage={onRemovePage}
        currentPageIndex={currentPageIndex}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
export default Canvas;
