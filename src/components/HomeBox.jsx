import { FaArrowUp } from "react-icons/fa6";
export default function HomeBox({ icon, title }) {
  return (
    <div className="group p-5 h-30 relative flex flex-col border-2 border-[var(--dirty-white)] ">
      <div className="absolute flex items-center justify-center top-0 right-0 w-9 h-9 bg-[var(--dirty-white)]">
        <button className="relative w-full h-full font-bold cursor-pointer flex items-center justify-center overflow-hidden">
          <FaArrowUp className="rotate-45 group-hover:translate-x-15 group-hover:-translate-y-15 transition-all duration-400 ease-out" />
          <FaArrowUp className="absolute -translate-x-15 translate-y-15 rotate-45 group-hover:translate-x-0 group-hover:-translate-y-0 
          transition-all duration-400 ease-out" fill = "purple" />
        </button>
      </div>
      <img src={icon} alt="" width={25} height={25} />
      <p className="text-md font-vagrounded mt-1 font-bold">{title}</p>
    </div>
  );
}
