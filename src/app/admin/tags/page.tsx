/**
 * Caminho: src/app/admin/tags/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tags do blog no admin: as tags em uso com o total de artigos, e ações para renomear, mesclar e remover.
 */
import TagActions from "@/components/Admin/Tags/TagActions";
import { listAllPostTags } from "@/lib/repositories/admin-tags";
import { summarizeTags } from "@/lib/tags/tag-ops";

export default async function AdminTagsPage() {
  const tags = summarizeTags(await listAllPostTags());

  return (
    <>
      <div>
        <h1 className="font-heading text-3xl font-bold">Tags</h1>
        <p className="mt-1 text-sm text-muted">
          {tags.length} tag(s) em uso. As tags nascem no editor do artigo; aqui você organiza todas de uma vez. Renomear para um nome que já existe une as duas.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
        {tags.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">Nenhum artigo usa tags ainda.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-black/5 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Tag</th>
                <th className="px-3 py-3">Artigos</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {tags.map((tag) => (
                <tr key={tag.key}>
                  <td className="px-5 py-4 font-medium">#{tag.name}</td>
                  <td className="px-3 py-4 text-muted">{tag.count}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <TagActions
                        tagKey={tag.key}
                        name={tag.name}
                        count={tag.count}
                        otherNames={tags.filter((other) => other.key !== tag.key).map((other) => other.name)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
