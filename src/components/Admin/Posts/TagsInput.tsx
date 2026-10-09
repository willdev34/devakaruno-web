/**
 * Caminho: src/components/Admin/Posts/TagsInput.tsx
 * Arquivo: TagsInput.tsx
 * Descrição: Campo de tags do artigo: adiciona com Enter, vírgula ou botão "+" e remove clicando na tag.
 */
"use client";
import { useState } from "react";
import { input } from "../styles";

type Props = { value: string[]; onChange: (tags: string[]) => void };

export default function TagsInput({ value, onChange }: Props) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const tags = draft.split(",").map((tag) => tag.trim()).filter(Boolean);
    if (tags.length) onChange(Array.from(new Set([...value, ...tags])));
    setDraft("");
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          aria-label="Nova tag"
          value={draft}
          placeholder="Ex: autoconhecimento, tântrica..."
          className={input}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
        />
        <button type="button" onClick={add} aria-label="Adicionar tag" className="rounded-lg bg-primary px-4 text-white">
          +
        </button>
      </div>
      {value.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {value.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                aria-label={`Remover ${tag}`}
                onClick={() => onChange(value.filter((item) => item !== tag))}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-error/10 hover:text-error"
              >
                {tag} ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
