/**
 * Caminho: src/components/PoliticaPrivacidade/index.tsx
 * Arquivo: index.tsx
 * Descrição: Conteúdo da Política de Privacidade, baseado no que o site realmente coleta hoje.
 */
import CookiePreferencesButton from "@/components/Consent/CookiePreferencesButton";

const PoliticaPrivacidade = () => {
  return (
    <section className="lg:py-28 py-16 bg-white dark:bg-dark">
      <div className="container mx-auto lg:max-w-(--breakpoint-md) px-4">
        <p className="text-dustGray dark:text-white/60 text-sm mb-10">
          Última atualização: 10 de outubro de 2026
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
              <li><strong className="text-midnight_text dark:text-white">Ficha de anamnese</strong> (página Terapia Tântrica): informações de saúde e bem-estar preenchidas voluntariamente pelo visitante, por meio de um formulário do Google. São dados pessoais sensíveis, usados apenas para preparar o atendimento, e ficam em uma conta Google de acesso restrito ao terapeuta.</li>
              <li><strong className="text-midnight_text dark:text-white">WhatsApp</strong>: ao iniciar uma conversa pelo WhatsApp, a troca de mensagens ocorre dentro da plataforma da Meta, sob a política de privacidade dela, não deste site.</li>
              <li><strong className="text-midnight_text dark:text-white">Área de autenticação</strong>: o site possui uma área técnica de login, reservada à administração interna de conteúdo (blog), não destinada ao público em geral. Caso utilizada, processa apenas nome e e-mail fornecidos pelo provedor de login (Google ou GitHub).</li>
              <li><strong className="text-midnight_text dark:text-white">Newsletter</strong>: o campo de inscrição existe na interface, mas não está em operação no momento. Esta política será atualizada antes de qualquer ativação.</li>
              <li><strong className="text-midnight_text dark:text-white">Cookies e rastreamento</strong>: o site pode usar cookies de análise e de marketing, mas somente depois que você aceitar no aviso exibido na tela. Detalhes na seção 3.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">3. Cookies e tecnologias de medição</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed mb-3">
              Cookies são pequenos arquivos guardados no seu navegador. Neste site eles têm três usos:
            </p>
            <ul className="text-dustGray dark:text-white/70 text-base leading-relaxed list-disc pl-5 space-y-3">
              <li><strong className="text-midnight_text dark:text-white">Essenciais</strong>: guardam o tema claro ou escuro, a sua escolha sobre cookies e, na área administrativa, a sessão de login. Não exigem consentimento e não são usados para medir audiência.</li>
              <li><strong className="text-midnight_text dark:text-white">Análise</strong>: Google Tag Manager e Google Analytics mostram, de forma agregada, quais páginas são mais visitadas e como o público chega ao site. Só são carregados se você aceitar.</li>
              <li><strong className="text-midnight_text dark:text-white">Marketing</strong>: o Meta Pixel (Meta, dona do Facebook e do Instagram) mede o resultado de anúncios e permite mostrar conteúdo relevante a quem já visitou o site. Só é carregado se você aceitar.</li>
            </ul>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed mt-3">
              Se você recusar, nenhum desses serviços é carregado e o site funciona normalmente. A escolha fica salva apenas no seu navegador e você pode mudá-la a qualquer momento:
            </p>
            <CookiePreferencesButton />
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">4. Base legal e finalidade</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Tratamos esses dados com base no consentimento (ao preencher voluntariamente um formulário, incluindo, no caso da ficha de anamnese, o consentimento específico para dados de saúde, conforme art. 11 da LGPD) e no legítimo interesse de responder a contatos recebidos, conforme art. 7º da Lei Geral de Proteção de Dados (Lei 13.709/2018).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">5. Compartilhamento com terceiros</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed mb-3">
              Utilizamos os seguintes serviços para operar o site, que podem processar dados em nosso nome:
            </p>
            <ul className="text-dustGray dark:text-white/70 text-base leading-relaxed list-disc pl-5 space-y-2">
              <li>formsubmit.co (envio do formulário de parceria)</li>
              <li>Google e GitHub (autenticação da área administrativa)</li>
              <li>Google Forms (recebimento da ficha de anamnese)</li>
              <li>Google (Tag Manager e Analytics) e Meta (Pixel), apenas se você aceitar os cookies, conforme a seção 3</li>
            </ul>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed mt-3">
              Não vendemos dados. O compartilhamento com Google e Meta ocorre somente por meio dos cookies que você autorizar.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">6. Por quanto tempo guardamos os dados</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Pelo tempo necessário para cumprir a finalidade do contato, ou até que você solicite a exclusão.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">7. Seus direitos</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Conforme o art. 18 da LGPD, você pode solicitar, a qualquer momento: confirmação do tratamento, acesso aos dados, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamento, e revogação do consentimento. Para exercer qualquer um desses direitos, entre em contato pelo e-mail <a href="mailto:karunodeva@gmail.com" className="text-primary hover:text-secondary">karunodeva@gmail.com</a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">8. Segurança</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Adotamos medidas razoáveis para proteger os dados que tratamos, mas nenhum sistema é 100% imune a falhas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">9. Menores de idade</h2>
            <p className="text-dustGray dark:text-white/70 text-base leading-relaxed">
              Este site não é destinado a menores de 18 anos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-3">10. Alterações nesta política</h2>
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