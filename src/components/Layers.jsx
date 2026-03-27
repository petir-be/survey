import React from "react";
import LayerItem from "./LayerItem";
import { AnimatePresence } from "motion/react";
import { useMediaQuery } from "react-responsive";
export default function Layers({ questions = [], onReorder, onDelete }) {
  if (!Array.isArray(questions)) return null;

  const moveLayer = (fromIndex, toIndex) => {
    if (typeof onReorder === "function") onReorder(fromIndex, toIndex);
  };
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 822px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 821px)" });

  return (
    <>
      {isDesktopOrLaptop &&
        <div className="w-full h-full">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Drag to reorder items. Use the trash to remove.
            </p>
          </div>

          <div className="max-h-[65vh] overflow-y-auto hide-bar">
            {questions.length === 0 && (
              <div className="text-sm text-gray-500">
                No layers yet. Add items to the page.
              </div>
            )}

            <AnimatePresence>
              {questions.map((q, idx) => (
                <LayerItem
                  key={q.id || idx}
                  question={q}
                  index={idx}
                  moveLayer={moveLayer}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      }

      {isTabletOrMobile &&
        <div className="w-full h-full">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Drag to reorder items. Use the trash to remove.
            </p>
          </div>

          <div className=" overflow-y-auto hide-bar">
            {questions.length === 0 && (
              <div className="text-sm text-gray-500">
                No layers yet. Add items to the page.
              </div>
            )}

            <AnimatePresence>
              {questions.map((q, idx) => (
                <LayerItem
                  key={q.id || idx}
                  question={q}
                  index={idx}
                  moveLayer={moveLayer}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      }
    </>
  );

}
