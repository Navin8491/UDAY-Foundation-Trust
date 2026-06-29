import { useRef, useEffect } from "react";
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Link, Sparkles } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Enter description..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const execCmd = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    triggerChange();
  };

  const triggerChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt("Enter link URL (e.g., https://example.com):");
    if (url) {
      execCmd("createLink", url);
    }
  };

  return (
    <div className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap gap-1 items-center p-2 border-b border-slate-200 bg-slate-50 select-none">
        <button
          type="button"
          onClick={() => execCmd("bold")}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 cursor-pointer transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("italic")}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 cursor-pointer transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("underline")}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 cursor-pointer transition-colors"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => execCmd("formatBlock", "<h2>")}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 cursor-pointer transition-colors"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("formatBlock", "<h3>")}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 cursor-pointer transition-colors"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => execCmd("insertUnorderedList")}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 cursor-pointer transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("insertOrderedList")}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 cursor-pointer transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={addLink}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 cursor-pointer transition-colors"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => execCmd("removeFormat")}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/80 active:bg-slate-300/80 cursor-pointer transition-colors ml-auto"
          title="Clear Formatting"
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={triggerChange}
        onBlur={triggerChange}
        className="p-4 min-h-[160px] max-h-[300px] overflow-y-auto focus:outline-none prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed"
        style={{ direction: "ltr" }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
