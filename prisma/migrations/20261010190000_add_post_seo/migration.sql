-- SEO por artigo: título e descrição próprios para o Google (opcionais)
ALTER TABLE "posts" ADD COLUMN "seoTitle" TEXT,
ADD COLUMN "seoDescription" TEXT;
