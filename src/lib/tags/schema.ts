/**
 * Caminho: src/lib/tags/schema.ts
 * Arquivo: schema.ts
 * Descrição: Validação (Zod) do nome de uma tag ao renomear ou mesclar. Segue o mesmo limite do formulário de artigo (1 a 30 caracteres).
 */
import { z } from "zod";

export const TAG_MAX_LENGTH = 30;

export const tagNameSchema = z
  .string()
  .trim()
  .min(1, "Informe o nome da tag")
  .max(TAG_MAX_LENGTH, `Máximo de ${TAG_MAX_LENGTH} caracteres`);
