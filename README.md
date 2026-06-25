<p align="center">
  <img src="./public/images/logo/logo.svg" alt="Deva Karuno Terapias" width="220" />
</p>

# Deva Karuno Terapias — Site institucional

Site institucional da Deva Karuno Terapias, prática de terapia tântrica e desenvolvimento pessoal. Construído sobre o template Endeavor Next.js Pro, sendo transformado de forma sistemática de conteúdo placeholder pra conteúdo real da marca, em português.

Objetivo do site: converter visita em agendamento, com o WhatsApp como canal principal, não formulários.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- TailwindCSS v4
- NextAuth v4 (autenticação, ainda não totalmente implementada)
- MDX para o blog (`markdown/blog/`)
- date-fns, react-slick (carrosséis), @iconify/react (ícones)

## Como rodar localmente

Ambiente de desenvolvimento: WSL2 Ubuntu, Node via `nvm`.

```bash
nvm use
npm install
npm run dev
```

Abre `http://localhost:3000`.

Requer um arquivo `.env` local (nunca commitado, está no `.gitignore`), com credenciais OAuth do Google e do GitHub e um `NEXTAUTH_SECRET`. Esse arquivo não existe no repositório, precisa ser criado e preenchido manualmente.

## Estrutura de pastas relevante

src/

├── app/(site)/         # Rotas públicas (Home, blog, quem-e-o-karuno, etc.)

├── app/api/data.tsx    # Dados estáticos (mock), sem banco de dados ainda

├── components/Home/    # Seções da Home

├── components/QuemEOKaruno/  # Seções da página /quem-e-o-karuno

├── components/Layout/   # Header, Footer

markdown/blog/           # Posts do blog, em MDX

public/images/           # Imagens, separadas por contexto (help, services, blog, sobre, background, logo)

## Status atual

### Pronto

- Home completa: Hero, Benefícios, Serviços, Cursos e Vivências, Newsletter, Depoimentos, CTA WhatsApp
- Página `/quem-e-o-karuno`: biografia, formação/credenciais, depoimentos extra
- Menu principal simplificado, sem submenus, sem rota Documentation
- Footer com dados reais de contato e redes sociais
- Página 404 customizada, com animação própria

### Pendente / próximas etapas

- Reconstrução de `/cause` e `/cause/[slug]`: ainda tem formulário de doação real por trás, campos Raised/Goal, texto lorem ipsum. Vira base futura da página Terapia Tântrica
- Reconstrução de `/events` e `/events/[slug]`: campos de Info genéricos, texto lorem. Vira base futura da página completa de Cursos e Vivências
- Reconstrução do formulário de Contato (hoje envia pro e-mail do autor do template via formsubmit.co, tem bug de reset, sem validação)
- Página "O que é Tantra?" (educacional)
- Seção "Agenda" (locais e datas de atendimento, multi-cidade), formato e posição ainda em definição
- Página Política de Privacidade
- Seções da Home ainda sem conteúdo: Como funciona, Sobre Deva Karuno (preview), Instagram, FAQ

## Decisões de arquitetura

- **WhatsApp como canal de conversão primário**: praticamente todo CTA do site linka direto pro WhatsApp, em vez de formulário ou página de detalhe ainda não pronta
- **Sem banco de dados ainda**: dados mockados em `src/app/api/data.tsx`. Prisma/PostgreSQL estão no roadmap, não implementados
- **Blog sem CMS**: conteúdo em arquivos `.mdx` locais (`markdown/blog/`)
- **Privacidade de imagem**: toda foto de pessoa real passa por remoção de metadado EXIF antes de entrar no repositório
- **Lógica de doação do template original** (`DonationFormContext`) foi removida do Header, Hero e Home. Ainda existe em `/cause`, `/events` e componentes ligados a eles, de propósito, até a reconstrução dessas rotas
- **3 vulnerabilidades moderadas conhecidas** no `npm audit` (js-yaml via gray-matter, postcss via next, uuid via next-auth), decisão consciente de não fazer downgrade

## Convenção de commits

Commits semânticos (`feat`, `fix`, `refactor`, `docs`, `chore`). Branches `main` e `develop`.