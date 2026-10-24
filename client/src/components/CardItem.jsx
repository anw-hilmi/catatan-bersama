import { useState, useRef, useEffect } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaFilePdf,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function CardItem({
  title = "",
  content = "",
  pdfPaths = [], // <-- Prop baru untuk menampung array URL PDF
  isExpanded = false,
  onToggleExpand,
  onEdit,
  onDelete,
}) {
  const contentRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  // Normalisasi data PDF agar selalu berupa Array
  const pdfList = Array.isArray(pdfPaths) ? pdfPaths.filter(Boolean) : [];

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, [content, pdfList]);

  return (
    <div className="flex flex-col bg-white border border-stone-200 shadow-sm hover:shadow-md rounded-2xl w-full h-full transition-all duration-300 group overflow-hidden">
      {/* Header Card */}
      <div className="bg-[#FAF8F5] border-b border-stone-200 py-3 px-5 flex items-center justify-between">
        <p className="text-xs sm:text-sm font-semibold text-stone-700 uppercase tracking-wide">
          {title}
        </p>
      </div>

      {/* Body Card */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="relative flex-grow space-y-4">
          {/* 1. Tampilkan Konten Teks (Jika Ada) */}
          {content && (
            <div
              ref={contentRef}
              className={`text-sm sm:text-base text-stone-600 leading-relaxed break-words transition-all duration-300 
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 
  [&_li]:mb-1 
  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 
  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 
  [&_p]:mb-2
  [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through
  [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify
  ${!isExpanded ? "line-clamp-3" : ""}`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* 2. Tampilkan Daftar Lampiran File PDF */}
          {pdfList.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Lampiran PDF ({pdfList.length}):
              </p>
              <div className="flex flex-col gap-2">
                {pdfList.map((url, idx) => {
                  const rawName = url.split("/").pop().split("?")[0] || "";
                  const hexPart = rawName.replace(/^[^-]+-\d+-\d+-/, "");

                  const fileName = (() => {
                    try {
                      return decodeURIComponent(
                        hexPart.replace(/(..)/g, "%$1"),
                      );
                    } catch {
                      return hexPart || rawName || `File Doa ${idx + 1}.pdf`;
                    }
                  })();

                  return (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-[#FAF8F5] hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-xl transition-all duration-200 group/pdf text-stone-700 hover:text-amber-800"
                    >
                      <div className="flex items-center gap-2.5 truncate max-w-[85%]">
                        <FaFilePdf className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {fileName}
                        </span>
                      </div>
                      <FaExternalLinkAlt className="w-3 h-3 text-stone-400 group-hover/pdf:text-amber-600 transition-colors flex-shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {!isExpanded && isTruncated && (
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="mt-5 pt-4 flex items-center justify-between border-t border-stone-100">
          <div className="flex-1 min-h-[36px] flex items-center">
            {(isTruncated || isExpanded) && (
              <button
                type="button"
                onClick={onToggleExpand}
                className="text-xs sm:text-sm font-medium text-amber-700 hover:text-amber-600 active:text-amber-800 transition-colors focus:outline-none"
              >
                {isExpanded ? "Sembunyikan" : "Lihat selengkapnya"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={onEdit}
              className="p-2.5 text-stone-400 hover:text-amber-600 hover:bg-stone-50 active:scale-95 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-200 bg-white"
              title="Edit"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="p-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 active:scale-95 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-200 bg-white"
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
