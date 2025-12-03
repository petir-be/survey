import { FaMagnifyingGlass } from "react-icons/fa6";

function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-xs">
      <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-3 py-2 border-2px border-white inset-shadow-sm inset-shadow-black placeholder:text-gray:500 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition concave"
      />
    </div>
  );
}

export default SearchBar;
