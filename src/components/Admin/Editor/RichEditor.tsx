/**
 * Caminho: src/components/Admin/Editor/RichEditor.tsx
 * Arquivo: RichEditor.tsx
 * Descrição: Editor de texto do artigo (Tiptap) com barra de formatação, foto no texto e alternância entre modo visual e markdown. O valor trafega como markdown.
 */
"use client";
import { useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { input } from "../styles";

type Props = {
  value: string;
  onChange: (markdown: string) => void;
  // Envia a imagem e devolve a URL final
  onUploadImage: (file: File) => Promise<string>;
};

type Mode = "visual" | "markdown";

export default function RichEditor({ value, onChange, onUploadImage }: Props) {
  const [mode, setMode] = useState<Mode>("visual");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Escreva o artigo aqui..." }),
      Markdown.configure({ html: false, linkify: true }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "blog-details markdown min-h-[380px] px-4 py-3 outline-none",
        "aria-label": "Conteúdo do artigo",
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.storage.markdown.getMarkdown()),
  });

  if (!editor) return null;

  // Troca de modo: o markdown digitado volta para o editor visual
  const switchMode = (next: Mode) => {
    if (next === mode) return;
    if (next === "visual") editor.commands.setContent(value);
    setMode(next);
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await onUploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const setLink = () => {
    const url = window.prompt("Endereço do link (deixe vazio para remover)", editor.getAttributes("link").href ?? "");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  };

  const tools: { label: string; run: () => void; active?: boolean }[] = [
    { label: "Título", run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { label: "Subtítulo", run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    { label: "Negrito", run: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { label: "Itálico", run: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { label: "Citação", run: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { label: "Lista", run: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { label: "Lista numerada", run: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { label: "Link", run: setLink, active: editor.isActive("link") },
    { label: "Divisória", run: () => editor.chain().focus().setHorizontalRule().run() },
    { label: "Desfazer", run: () => editor.chain().focus().undo().run() },
    { label: "Refazer", run: () => editor.chain().focus().redo().run() },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-black/10 bg-[#f6f8fa] p-2">
        {mode === "visual" && (
          <>
            {tools.map((tool) => (
              <button
                key={tool.label}
                type="button"
                onClick={tool.run}
                aria-pressed={tool.active}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                  tool.active ? "bg-primary text-white" : "text-midnight_text hover:bg-black/5"
                }`}
              >
                {tool.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium text-midnight_text hover:bg-black/5 disabled:opacity-60"
            >
              {uploading ? "Enviando..." : "Foto"}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              aria-label="Escolher foto para o texto"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </>
        )}
        <div className="ml-auto flex overflow-hidden rounded-md border border-black/10 text-xs font-semibold">
          {(["visual", "markdown"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => switchMode(option)}
              aria-pressed={mode === option}
              className={`px-3 py-1.5 capitalize ${mode === option ? "bg-primary text-white" : "bg-white text-midnight_text"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {uploadError && <p role="alert" className="px-4 pt-2 text-xs text-error">{uploadError}</p>}

      {mode === "visual" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          aria-label="Conteúdo em markdown"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${input} min-h-[380px] rounded-none border-0 font-mono`}
        />
      )}
    </div>
  );
}
