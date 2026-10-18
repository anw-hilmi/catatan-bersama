// src/components/RichTextEditor.jsx
import { useMemo, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Tulis isi di sini...",
}) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
      ],
    }),
    [],
  );

  const formats = useMemo(
    () => ["header", "bold", "italic", "underline", "strike", "list", "align"],
    [],
  );

  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules,
    formats,
    placeholder,
  });

  useEffect(() => {
    if (!quill) return;
    const handler = () => onChange?.(quill.root.innerHTML);
    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [quill, onChange]);

  useEffect(() => {
    if (!quill) return;
    if (value !== undefined && value !== quill.root.innerHTML) {
      quill.clipboard.dangerouslyPasteHTML(value || "");
    }
  }, [value, quill]);

  return (
    <div className="w-full rounded-xl overflow-hidden border border-stone-200 bg-[#FAF8F5] focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
      <div
        ref={quillRef}
        className="min-h-[160px] max-h-[300px] overflow-y-auto"
      />
    </div>
  );
};
