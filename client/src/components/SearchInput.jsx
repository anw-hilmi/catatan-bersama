import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="relative w-full sm:max-w-md mb-4 sm:mb-6">
      <FaSearch className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-card-muted w-4 h-4" />
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Cari berdasarkan judul..."
        className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-card-header border border-card-border rounded-xl text-sm sm:text-base text-card-text focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary focus:bg-white shadow-sm transition-all"
      />
    </div>
  );
}
