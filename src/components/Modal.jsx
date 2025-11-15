import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";

export default function Modal({ isOpen, close, title, children }) {
  return (
    <Dialog open={isOpen} onClose={close} className="relative z-50">
      <div className="fixed inset-0 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              key="box"
              className="w-full max-w-md"
            >
              <DialogPanel className="rounded-xl bg-white p-6 backdrop-blur-2xl min-h-[150px] shadow-lg">
                <DialogTitle className="text-lg font-medium text-gray-900">
                  {title || "Modal Title"}
                </DialogTitle>
                <div className="mt-2 text-sm text-gray-700">{children}</div>
              </DialogPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Dialog>
  );
}
