/**
 * Caminho: prisma/seed.ts
 * Arquivo: seed.ts
 * Descrição: Popula o banco com o usuário admin e os posts do blog (lidos de markdown/blog/*.mdx), usando upsert para ser seguro rodar múltiplas vezes.
 */
import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const postsDirectory = join(process.cwd(), "markdown/blog");

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "karunodeva@gmail.com" },
    update: {},
    create: {
      name: "Will",
      email: "karunodeva@gmail.com",
      role: "ADMIN",
    },
  });

  console.log("Usuário admin garantido:", admin.email);

  const slugs = fs.readdirSync(postsDirectory);

  for (const filename of slugs) {
    const slug = filename.replace(/\.mdx$/, "");
    const fullPath = join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const post = await prisma.post.upsert({
      where: { slug },
      update: {
        title: data.title,
        excerpt: data.excerpt,
        content,
        coverImage: data.coverImage,
        publishedAt: new Date(data.date),
        authorId: admin.id,
      },
      create: {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        content,
        coverImage: data.coverImage,
        publishedAt: new Date(data.date),
        authorId: admin.id,
      },
    });

    console.log("Post garantido:", post.slug);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });