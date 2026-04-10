import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";
export default function Modal({ isOpen, close, title, children, dialogbox }) {
  return (
    <Dialog open={isOpen} onClose={close} className="relative z-50">
      <div className="fixed inset-0 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-center">


        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              key="box"
              className="w-full text-left max-w-md px-6 sm:px-0"
            >
              <DialogPanel className="overflow-hidden rounded-2xl bg-zinc-950 border border-green-500/30 p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <DialogTitle className="text-xl font-bold text-green-400 tracking-wide font-vagrounded">
                  {title || "Modal Title"}
                </DialogTitle>
                <div className="mt-3 text-base text-zinc-300">{children}</div>
              </DialogPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Dialog>
  );

}