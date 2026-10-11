/**
 * Caminho: src/components/Admin/Courses/FaqFields.tsx
 * Arquivo: FaqFields.tsx
 * Descrição: Lista editável de perguntas frequentes do curso: adicionar, remover e mudar a ordem. Usa o formulário do curso (React Hook Form).
 */
"use client";
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { CourseInput } from "@/lib/courses/schema";
import { btnOutline, errorText, input, label } from "../styles";

type Props = {
  control: Control<CourseInput>;
  register: UseFormRegister<CourseInput>;
  errors: FieldErrors<CourseInput>;
};

const small = "rounded-md border border-black/10 px-2 py-1 text-xs leading-none hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30";

export default function FaqFields({ control, register, errors }: Props) {
  const { fields, append, remove, move } = useFieldArray({ control, name: "faqs" });

  return (
    <div>
      {fields.length === 0 && <p className="mb-3 text-sm text-muted">Nenhuma pergunta ainda.</p>}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const fieldErrors = errors.faqs?.[index];
          return (
            <div key={field.id} className="rounded-lg border border-black/10 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Pergunta {index + 1}</span>
                <div className="flex gap-1">
                  <button type="button" aria-label={`Subir pergunta ${index + 1}`} disabled={index === 0} onClick={() => move(index, index - 1)} className={small}>▲</button>
                  <button type="button" aria-label={`Descer pergunta ${index + 1}`} disabled={index === fields.length - 1} onClick={() => move(index, index + 1)} className={small}>▼</button>
                  <button type="button" aria-label={`Remover pergunta ${index + 1}`} onClick={() => remove(index)} className={`${small} text-error`}>Remover</button>
                </div>
              </div>

              <label htmlFor={`faq-q-${index}`} className={label}>Pergunta</label>
              <input id={`faq-q-${index}`} className={input} {...register(`faqs.${index}.question`)} />
              {fieldErrors?.question && <p className={errorText}>{fieldErrors.question.message}</p>}

              <label htmlFor={`faq-a-${index}`} className={`${label} mt-3`}>Resposta</label>
              <textarea id={`faq-a-${index}`} rows={3} className={input} {...register(`faqs.${index}.answer`)} />
              {fieldErrors?.answer && <p className={errorText}>{fieldErrors.answer.message}</p>}
            </div>
          );
        })}
      </div>

      {errors.faqs?.message && <p className={errorText}>{errors.faqs.message}</p>}

      <button type="button" onClick={() => append({ question: "", answer: "" })} className={`${btnOutline} mt-4`}>
        + Adicionar pergunta
      </button>
    </div>
  );
}
