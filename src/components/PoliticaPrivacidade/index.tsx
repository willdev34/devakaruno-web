/**
 * Caminho: src/components/PoliticaPrivacidade/index.tsx
 * Arquivo: index.tsx
 * Descrição: Conteúdo da Política de Privacidade, baseado no que o site realmente coleta hoje.
 */
const PoliticaPrivacidade = () => {
  return (
    <section className="lg:py-28 py-16 bg-white dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-md) px-4">
        <p className="text-dustGray dark:text-white/60 text-sm mb-10">
          Última atualização: 25 de junho de 2026
        </p>

        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-medium mb-3">1. Quem somos</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Esta política se aplica ao site da Deva Karuno Terapias. O responsável pelo tratamento dos dados coletados é o próprio terapeuta, Deva Karuno, contato: <a href="mailto:karunodeva@gmail.com" className="text-primary hover:text-secondary">karunodeva@gmail.com</a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">2. Quais dados coletamos</h2>
            <ul className="text-dustGray dark:text-white/70 text-base leading-relaxed list-disc pl-5 space-y-3">
              <li><strong className="text-midnight_text dark:text-white">Formulário de Parceria</strong> (página Contato): nome, empresa/organização, e-mail, WhatsApp, tipo de parceria, mensagem. Usado exclusivamente para responder propostas de colaboração, imprensa ou divulgação.</li>
              <li><strong className="text-midnight_text dark:text-white">WhatsApp</strong>: ao iniciar uma conversa pelo WhatsApp, a troca de mensagens ocorre dentro da plataforma da Meta, sob a política de privacidade dela, não deste site.</li>
              <li><strong className="text-midnight_text dark:text-white">Área de autenticação</strong>: o site possui uma área técnica de login, reservada à administração interna de conteúdo (blog), não destinada ao público em geral. Caso utilizada, processa apenas nome e e-mail fornecidos pelo provedor de login (Google ou GitHub).</li>
              <li><strong className="text-midnight_text dark:text-white">Newsletter</strong>: o campo de inscrição existe na interface, mas não está em operação no momento. Esta política será atualizada antes de qualquer ativação.</li>
              <li><strong className="text-midnight_text dark:text-white">Cookies e rastreamento</strong>: atualmente não utilizamos cookies de análise ou rastreamento publicitário.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">3. Base legal e finalidade</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Tratamos esses dados com base no consentimento (ao preencher voluntariamente um formulário) e no legítimo interesse de responder a contatos recebidos, conforme art. 7º da Lei Geral de Proteção de Dados (Lei 13.709/2018).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">4. Compartilhamento com terceiros</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed mb-3">
              Utilizamos os seguintes serviços para operar o site, que podem processar dados em nosso nome:
            </p>
            <ul className="text-dustGray dark:text-white/70 text-base leading-relaxed list-disc pl-5 space-y-2">
              <li>formsubmit.co (envio do formulário de parceria)</li>
              <li>Google e GitHub (autenticação da área administrativa)</li>
            </ul>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed mt-3">
              Não vendemos nem compartilhamos dados com terceiros para fins de publicidade.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">5. Por quanto tempo guardamos os dados</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Pelo tempo necessário para cumprir a finalidade do contato, ou até que você solicite a exclusão.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">6. Seus direitos</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Conforme o art. 18 da LGPD, você pode solicitar, a qualquer momento: confirmação do tratamento, acesso aos dados, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamento, e revogação do consentimento. Para exercer qualquer um desses direitos, entre em contato pelo e-mail <a href="mailto:karunodeva@gmail.com" className="text-primary hover:text-secondary">karunodeva@gmail.com</a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">7. Segurança</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Adotamos medidas razoáveis para proteger os dados que tratamos, mas nenhum sistema é 100% imune a falhas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">8. Menores de idade</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Este site não é destinado a menores de 18 anos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">9. Alterações nesta política</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Esta política pode ser atualizada periodicamente. A data da última atualização está sempre indicada no topo desta página.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoliticaPrivacidade;