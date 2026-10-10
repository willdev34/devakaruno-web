/**
 * Caminho: src/components/Admin/Tags/TagActions.tsx
 * Arquivo: TagActions.tsx
 * Descrição: Ações de uma tag na tela de tags do admin: renomear (ou mesclar, se o nome já existir) e remover de todos os artigos.
 */
"use client";
import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeTagAction, renameTagAction } from "@/app/admin/tags/actions";
import { tagKey } from "@/lib/tags/tag-ops";
import { btnOutline, btnPrimary, errorText, input } from "@/components/Admin/styles";

type Props = {
  tagKey: string;
  name: string;
  count: number;
  // Nomes das outras tags, para sugerir e avisar sobre mesclagem
  otherNames: string[];
};

export default function TagActions({ tagKey: key, name, count, otherNames }: Props) {
  const router = useRouter();
  const listId = useId();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [error, setError] = useState("");

  // O nome digitado já existe em outra tag: salvar vai unir as duas
  const willMerge = otherNames.some((other) => tagKey(other) === tagKey(value) && tagKey(other) !== key);

  const finish = (result: { ok: boolean; error?: string }) => {
    if (!result.ok) {
      setError(result.error ?? "Não foi possível concluir.");
      return;
    }
    setEditing(false);
    setError("");
    router.refresh();
  };

  const save = () =>
    start(async () => {
      finish(await renameTagAction(key, value));
    });

  const remove = () => {
    if (!window.confirm(`Remover a tag "${name}" de ${count} artigo(s)? Os artigos continuam no ar, só perdem essa tag.`)) return;
    start(async () => {
      finish(await removeTagAction(key));
    });
  };

  if (editing) {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-wrap justify-end gap-2">
          <input
            aria-label={`Novo nome da tag ${name}`}
            list={listId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={30}
            className={`${input} w-48`}
          />
          <datalist id={listId}>
            {otherNames.map((other) => (
              <option key={other} value={other} />
            ))}
          </datalist>
          <button type="button" onClick={save} disabled={pending} className={btnPrimary}>
            {pending ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setValue(name);
              setError("");
            }}
            disabled={pending}
            className={btnOutline}
          >
            Cancelar
          </button>
        </div>
        {willMerge && <p className="text-xs text-muted">Essa tag já existe: os artigos serão unidos nela.</p>}
        {error && <p className={errorText}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => setEditing(true)} className="text-sm font-medium text-primary hover:underline">
          Renomear ou mesclar
        </button>
        <button type="button" onClick={remove} disabled={pending} className="text-sm font-medium text-error hover:underline disabled:opacity-60">
          {pending ? "Removendo..." : "Remover"}
        </button>
      </div>
      {error && <p className={errorText}>{error}</p>}
    </div>
  );
}
