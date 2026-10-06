/**
 * Caminho: src/components/Home/NewsLetter/NewsletterForm.tsx
 * Arquivo: NewsletterForm.tsx
 * Descrição: Formulário de inscrição da Newsletter, via POST tradicional ao formsubmit.co (não-AJAX), para habilitar o envio automático de e-mail de boas-vindas (_autoresponse). Redireciona para /newsletter-obrigado após o envio.
 */
const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

const welcomeMessage =
  "Olá! Obrigado por se inscrever na newsletter de Deva Karuno Terapias. " +
  "Em breve você vai receber conteúdos sobre autoconhecimento, relacionamentos " +
  "e bem-estar direto no seu e-mail. Um abraço, Deva Karuno.";

const NewsletterForm = () => {
    return (
        <form action="https://formsubmit.co/karunodeva@gmail.com" method="POST">
            <input type="hidden" name="_subject" value="Nova inscrição na Newsletter - Deva Karuno Terapias" />
            <input type="hidden" name="_autoresponse" value={welcomeMessage} />
            <input type="hidden" name="_next" value={`${siteUrl}/newsletter-obrigado`} />
            <input type="hidden" name="_template" value="table" />

            <div className="mb-6">
                <input
                    type="text"
                    name="name"
                    placeholder="Seu nome"
                    required
                    className="w-full p-4 border border-border dark:border-dark_border focus:border-primary dark:focus:border-primary dark:bg-dark rounded-sm focus-visible:outline-hidden"
                />
            </div>
            <div className="mb-6">
                <input
                    type="email"
                    name="email"
                    placeholder="Seu e-mail"
                    required
                    className="w-full p-4 border border-border dark:border-dark_border focus:border-primary dark:focus:border-primary dark:bg-dark rounded-sm focus-visible:outline-hidden"
                />
            </div>
            <div className="flex justify-center mb-6">
                <button
                    type="submit"
                    className="text-white  bg-linear-to-r from-primary to-secondary px-7 py-4 dark:hover:from-dark hover:from-white hover:to-white dark:hover:to-dark border border-transparent hover:border-primary hover:text-primary rounded-sm w-full cursor-pointer"
                >
                    Inscrever-se
                </button>
            </div>
        </form>
    );
};

export default NewsletterForm;