/**
 * Caminho: src/components/Home/NewsLetter/NewsletterForm.test.tsx
 * Arquivo: NewsletterForm.test.tsx
 * Descrição: Testes do formulário da Newsletter: action do formsubmit, campos hidden (_subject, _autoresponse, _next) e campos obrigatórios.
 */
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// O siteUrl é lido no carregamento do módulo, então cada teste reimporta o componente
async function renderForm() {
  vi.resetModules();
  const { default: NewsletterForm } = await import("./NewsletterForm");
  return render(<NewsletterForm />);
}

function hiddenValue(container: HTMLElement, name: string) {
  return container.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`)?.value;
}

describe("Home/NewsLetter/NewsletterForm", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("envia via POST para o formsubmit", async () => {
    const { container } = await renderForm();

    const form = container.querySelector("form");
    expect(form).toHaveAttribute("action", "https://formsubmit.co/karunodeva@gmail.com");
    expect(form).toHaveAttribute("method", "POST");
  });

  it("preenche os campos hidden de assunto e resposta automática", async () => {
    const { container } = await renderForm();

    expect(hiddenValue(container, "_subject")).toBe("Nova inscrição na Newsletter - Deva Karuno Terapias");
    expect(hiddenValue(container, "_autoresponse")).toMatch(/^Olá! Obrigado por se inscrever na newsletter/);
  });

  it("redireciona para /newsletter-obrigado no localhost quando NEXTAUTH_URL não existe", async () => {
    vi.stubEnv("NEXTAUTH_URL", "");
    const { container } = await renderForm();

    expect(hiddenValue(container, "_next")).toBe("http://localhost:3000/newsletter-obrigado");
  });

  it("usa a NEXTAUTH_URL no redirecionamento quando definida", async () => {
    vi.stubEnv("NEXTAUTH_URL", "https://exemplo.com.br");
    const { container } = await renderForm();

    expect(hiddenValue(container, "_next")).toBe("https://exemplo.com.br/newsletter-obrigado");
  });

  it("exige nome e e-mail válidos", async () => {
    await renderForm();

    const name = screen.getByPlaceholderText("Seu nome");
    const email = screen.getByPlaceholderText("Seu e-mail");
    expect(name).toBeRequired();
    expect(name).toHaveAttribute("name", "name");
    expect(email).toBeRequired();
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute("name", "email");
    expect(screen.getByRole("button", { name: "Inscrever-se" })).toHaveAttribute("type", "submit");
  });
});
