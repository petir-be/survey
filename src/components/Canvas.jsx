import { useDrop } from "react-dnd";
import DotShader2 from "./DotShader2";
import Page from "./Page";
import CustomDragLayer from "./CustomDragLayer";
import { useMediaQuery } from "react-responsive";
function Canvas({
  questions,
  onDropElement,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onAddPage,
  onRemovePage,
  currentPageIndex,
  pageNumber,
  totalPages,
  onPageChange,
  onPingSidebar, ...props
}) {
  const [, dropRef] = useDrop({
    accept: "PALETTE_ITEM",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      onDropElement(item);
    },
    collect: () => ({}),
  });
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 822px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 821px)" });
  return (
    <>
      {isDesktopOrLaptop &&
        <>
          <div
            ref={dropRef}
            className="h-ful w-full flex justify-center items-center flex-col overflow-auto mb-20"
          >
            <CustomDragLayer />

            <Page
              questions={questions}
              onInsert={onDropElement}
              onUpdateQuestion={onUpdateQuestion}
              onDeleteQuestion={onDeleteQuestion}
              onDuplicateQuestion={onDuplicateQuestion}
              onAddPage={onAddPage}
              onRemovePage={onRemovePage}
              currentPageIndex={currentPageIndex}
              pageNumber={pageNumber}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onPingSidebar={onPingSidebar}
            />
          </div>
        </>}
      {isTabletOrMobile &&
        <>
          <div
            ref={dropRef}
            className="h-full w-full flex justify-center items-center flex-col overflow-auto "
          >
            <CustomDragLayer />

            <Page
              questions={questions}
              onInsert={onDropElement}
              onUpdateQuestion={onUpdateQuestion}
              onDeleteQuestion={onDeleteQuestion}
              onDuplicateQuestion={onDuplicateQuestion}
              onAddPage={onAddPage}
              onRemovePage={onRemovePage}
              currentPageIndex={currentPageIndex}
              pageNumber={pageNumber}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </>}

    </>
  );
}
export default Canvas;
