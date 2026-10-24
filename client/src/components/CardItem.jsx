import { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function CardItem({
  title = "",
  content = "",
  isExpanded = false,
  onToggleExpand,
  onEdit,
  onDelete,
}) {
  const contentRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, [content]);

  return (
    <div className="flex flex-col bg-white border border-card-border shadow-sm hover:shadow-md rounded-2xl w-full h-full transition-all duration-300 group overflow-hidden">
      <div className="bg-card-header border-b border-card-border py-3 px-5 flex items-center justify-between">
        <p className="text-xs sm:text-sm font-semibold text-card-text uppercase tracking-wide">
          {title}
        </p>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="relative flex-grow">
          <div
            ref={contentRef}
            className={`text-sm sm:text-base text-card-muted leading-relaxed break-words transition-all duration-300 
[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 
[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 
[&_li]:mb-1 
[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 
[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 
[&_p]:mb-0
[&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through
[&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify
${!isExpanded ? "line-clamp-3" : ""}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {!isExpanded && isTruncated && (
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        <div className="mt-5 pt-4 flex items-center justify-between">
          <div className="flex-1 min-h-[36px] flex items-center">
            {(isTruncated || isExpanded) && (
              <button
                type="button"
                onClick={onToggleExpand}
                className="text-xs sm:text-sm font-medium text-secondary hover:text-secondary-dark active:text-secondary-dark transition-colors focus:outline-none"
              >
                {isExpanded ? "Sembunyikan" : "Lihat selengkapnya"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={onEdit}
              className="p-2.5 text-card-muted hover:text-secondary hover:bg-secondary-light active:scale-95 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-card-border bg-white"
              title="Edit"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="p-2.5 text-card-muted hover:text-danger hover:bg-danger-light active:scale-95 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-danger-light bg-white"
              title="Hapus"
            >
              <FaTrashAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
