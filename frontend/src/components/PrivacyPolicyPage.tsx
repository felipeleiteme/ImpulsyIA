import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPolicyPageProps {
  isLightTheme: boolean;
  onBack: () => void;
}

export function PrivacyPolicyPage({ isLightTheme, onBack }: PrivacyPolicyPageProps) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float-slow"
          style={{
            background: isLightTheme 
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-medium"
          style={{
            background: isLightTheme 
              ? 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      {/* Content */}
      <div className="min-h-screen flex items-center justify-center p-4 pt-20 pb-8">
        <Card className="w-full max-w-4xl border shadow-lg animate-fade-in-up">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-1">
              <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
              <p className="text-sm text-muted-foreground">
                Última atualização: 28 de outubro de 2025
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {/* Introduction */}
                <section className="space-y-3">
                  <h3 className="text-lg">1. Introdução</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    O ImpulsyIA ("nós", "nosso" ou "nos") está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nosso serviço de assistente de IA.
                  </p>
                </section>

                <Separator />

                {/* Information We Collect */}
                <section className="space-y-3">
                  <h3 className="text-lg">2. Informações que Coletamos</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">2.1. Informações Fornecidas por Você</h4>
                      <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                        <li>Nome completo e endereço de email (ao criar uma conta)</li>
                        <li>Informações de perfil opcionais (foto, bio, etc.)</li>
                        <li>Conteúdo de conversas e mensagens com o assistente de IA</li>
                        <li>Informações de pagamento (processadas por terceiros seguros)</li>
                        <li>Feedback e comunicações com nossa equipe de suporte</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">2.2. Informações Coletadas Automaticamente</h4>
                      <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                        <li>Informações de log (endereço IP, tipo de navegador, páginas visitadas)</li>
                        <li>Dados de uso (recursos utilizados, tempo de sessão, frequência de uso)</li>
                        <li>Informações do dispositivo (tipo de dispositivo, sistema operacional)</li>
                        <li>Cookies e tecnologias similares de rastreamento</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* How We Use Your Information */}
                <section className="space-y-3">
                  <h3 className="text-lg">3. Como Usamos Suas Informações</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Usamos as informações coletadas para:
                    </p>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                      <li>Fornecer, manter e melhorar nossos serviços</li>
                      <li>Personalizar sua experiência e fornecer respostas relevantes</li>
                      <li>Processar transações e enviar notificações relacionadas</li>
                      <li>Enviar atualizações, comunicações de marketing e outras informações (com seu consentimento)</li>
                      <li>Detectar, prevenir e resolver problemas técnicos e de segurança</li>
                      <li>Treinar e melhorar nossos modelos de inteligência artificial</li>
                      <li>Cumprir obrigações legais e regulatórias</li>
                    </ul>
                  </div>
                </section>

                <Separator />

                {/* AI Training */}
                <section className="space-y-3">
                  <h3 className="text-lg">4. Uso de Dados para Treinamento de IA</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      4.1. Podemos usar suas conversas de forma anonimizada para melhorar nossos modelos de IA.
                    </p>
                    <p>
                      4.2. Removemos informações pessoalmente identificáveis antes de usar dados para treinamento.
                    </p>
                    <p>
                      4.3. Você pode optar por não participar do uso de dados para treinamento nas configurações da conta.
                    </p>
                    <p>
                      4.4. Nunca compartilhamos seus dados brutos de conversação com terceiros para fins de treinamento.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Data Sharing */}
                <section className="space-y-3">
                  <h3 className="text-lg">5. Compartilhamento de Informações</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Podemos compartilhar suas informações nas seguintes situações:
                    </p>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                      <li><span className="font-medium">Provedores de Serviço:</span> Com empresas terceirizadas que nos auxiliam (hospedagem, análise, processamento de pagamentos)</li>
                      <li><span className="font-medium">Conformidade Legal:</span> Quando exigido por lei ou para proteger direitos legais</li>
                      <li><span className="font-medium">Transferências de Negócios:</span> Em caso de fusão, aquisição ou venda de ativos</li>
                      <li><span className="font-medium">Com Seu Consentimento:</span> Quando você nos autorizar explicitamente</li>
                    </ul>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                      Nunca vendemos suas informações pessoais a terceiros.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Data Security */}
                <section className="space-y-3">
                  <h3 className="text-lg">6. Segurança dos Dados</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      6.1. Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações.
                    </p>
                    <p>
                      6.2. Usamos criptografia SSL/TLS para transmissão de dados.
                    </p>
                    <p>
                      6.3. Armazenamos dados em servidores seguros com acesso restrito.
                    </p>
                    <p>
                      6.4. Realizamos auditorias de segurança regulares.
                    </p>
                    <p>
                      6.5. No entanto, nenhum método de transmissão ou armazenamento é 100% seguro.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Data Retention */}
                <section className="space-y-3">
                  <h3 className="text-lg">7. Retenção de Dados</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      7.1. Mantemos suas informações pessoais apenas pelo tempo necessário para os fins descritos nesta política.
                    </p>
                    <p>
                      7.2. Quando você exclui sua conta, removemos suas informações pessoais dentro de 30 dias.
                    </p>
                    <p>
                      7.3. Podemos reter alguns dados por períodos mais longos quando exigido por lei ou para fins legítimos de negócios.
                    </p>
                    <p>
                      7.4. Dados anonimizados podem ser retidos indefinidamente para análise e melhoria do serviço.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Your Rights */}
                <section className="space-y-3">
                  <h3 className="text-lg">8. Seus Direitos</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:
                    </p>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                      <li>Acessar suas informações pessoais</li>
                      <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                      <li>Solicitar a exclusão de seus dados pessoais</li>
                      <li>Portabilidade de dados para outro provedor de serviço</li>
                      <li>Revogar consentimento para processamento de dados</li>
                      <li>Obter informações sobre compartilhamento de dados</li>
                      <li>Opor-se ao processamento de dados em certas circunstâncias</li>
                    </ul>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                      Para exercer esses direitos, entre em contato conosco através do email: privacidade@impulsyia.com
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Cookies */}
                <section className="space-y-3">
                  <h3 className="text-lg">9. Cookies e Tecnologias de Rastreamento</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      9.1. Usamos cookies para melhorar a funcionalidade e experiência do usuário.
                    </p>
                    <p>
                      9.2. Você pode configurar seu navegador para recusar cookies, mas isso pode limitar funcionalidades.
                    </p>
                    <p>
                      9.3. Usamos cookies de sessão (temporários) e cookies persistentes (armazenados no dispositivo).
                    </p>
                    <p>
                      9.4. Também usamos ferramentas de análise de terceiros (como Google Analytics) que usam cookies.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Children's Privacy */}
                <section className="space-y-3">
                  <h3 className="text-lg">10. Privacidade de Menores</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nosso serviço não é destinado a pessoas com menos de 18 anos. Não coletamos intencionalmente informações pessoais de menores. Se descobrirmos que coletamos dados de um menor, tomaremos medidas para excluir essas informações.
                  </p>
                </section>

                <Separator />

                {/* International Transfers */}
                <section className="space-y-3">
                  <h3 className="text-lg">11. Transferências Internacionais</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      11.1. Suas informações podem ser transferidas e mantidas em servidores fora do Brasil.
                    </p>
                    <p>
                      11.2. Garantimos que quaisquer transferências internacionais sigam padrões adequados de proteção de dados.
                    </p>
                    <p>
                      11.3. Ao usar nosso serviço, você consente com essas transferências.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Changes to Privacy Policy */}
                <section className="space-y-3">
                  <h3 className="text-lg">12. Alterações na Política de Privacidade</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas através de email ou aviso em nosso serviço. A data da "Última atualização" no topo desta página indica quando a política foi revisada pela última vez.
                  </p>
                </section>

                <Separator />

                {/* Contact */}
                <section className="space-y-3">
                  <h3 className="text-lg">13. Contato</h3>
                  <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <p>
                      Se você tiver dúvidas sobre esta Política de Privacidade ou sobre nossas práticas de dados, entre em contato:
                    </p>
                    <div className="pl-3 space-y-1">
                      <p>Email: privacidade@impulsyia.com</p>
                      <p>Email (Encarregado de Dados): dpo@impulsyia.com</p>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
