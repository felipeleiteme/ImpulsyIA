import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsOfServicePageProps {
  isLightTheme: boolean;
  onBack: () => void;
}

export function TermsOfServicePage({ isLightTheme, onBack }: TermsOfServicePageProps) {
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
                <FileText className="w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-1">
              <CardTitle className="text-2xl">Termos de Uso</CardTitle>
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
                    Bem-vindo ao ImpulsyIA. Ao acessar e usar nossa plataforma, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Por favor, leia estes termos cuidadosamente antes de usar nosso serviço.
                  </p>
                </section>

                <Separator />

                {/* Account */}
                <section className="space-y-3">
                  <h3 className="text-lg">2. Conta de Usuário</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      2.1. Você é responsável por manter a confidencialidade de sua conta e senha.
                    </p>
                    <p>
                      2.2. Você deve fornecer informações precisas, atuais e completas durante o processo de registro.
                    </p>
                    <p>
                      2.3. Você concorda em notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.
                    </p>
                    <p>
                      2.4. Você deve ter pelo menos 18 anos de idade para usar nossos serviços.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Use of Service */}
                <section className="space-y-3">
                  <h3 className="text-lg">3. Uso do Serviço</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      3.1. O ImpulsyIA é um assistente de IA projetado para ajudar no desenvolvimento pessoal e profissional.
                    </p>
                    <p>
                      3.2. Você concorda em não usar o serviço para qualquer finalidade ilegal ou não autorizada.
                    </p>
                    <p>
                      3.3. Você não deve transmitir vírus, worms ou qualquer código de natureza destrutiva.
                    </p>
                    <p>
                      3.4. Reservamo-nos o direito de recusar o serviço a qualquer pessoa por qualquer motivo a qualquer momento.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Subscription Plans */}
                <section className="space-y-3">
                  <h3 className="text-lg">4. Planos de Assinatura</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      4.1. Oferecemos planos Gratuito e Premium com diferentes recursos e limitações.
                    </p>
                    <p>
                      4.2. Os preços estão sujeitos a alterações mediante aviso prévio de 30 dias.
                    </p>
                    <p>
                      4.3. As assinaturas Premium são cobradas mensalmente e renovadas automaticamente.
                    </p>
                    <p>
                      4.4. Você pode cancelar sua assinatura a qualquer momento através das configurações da conta.
                    </p>
                    <p>
                      4.5. Não oferecemos reembolsos para períodos de assinatura não utilizados, exceto quando exigido por lei.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Intellectual Property */}
                <section className="space-y-3">
                  <h3 className="text-lg">5. Propriedade Intelectual</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      5.1. O serviço e seu conteúdo original, recursos e funcionalidade são de propriedade exclusiva do ImpulsyIA.
                    </p>
                    <p>
                      5.2. Nosso serviço é protegido por direitos autorais, marcas registradas e outras leis.
                    </p>
                    <p>
                      5.3. Você mantém todos os direitos sobre o conteúdo que criar ou enviar através do serviço.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* AI Generated Content */}
                <section className="space-y-3">
                  <h3 className="text-lg">6. Conteúdo Gerado por IA</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      6.1. O ImpulsyIA utiliza inteligência artificial para gerar respostas e sugestões.
                    </p>
                    <p>
                      6.2. Não garantimos a precisão, completude ou utilidade do conteúdo gerado por IA.
                    </p>
                    <p>
                      6.3. As respostas da IA são fornecidas apenas para fins informativos e não devem ser consideradas como aconselhamento profissional.
                    </p>
                    <p>
                      6.4. Você é responsável por verificar e validar qualquer informação antes de tomar decisões baseadas nela.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Limitations of Liability */}
                <section className="space-y-3">
                  <h3 className="text-lg">7. Limitação de Responsabilidade</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      7.1. O ImpulsyIA não será responsável por quaisquer danos indiretos, incidentais, especiais ou consequenciais.
                    </p>
                    <p>
                      7.2. Não garantimos que o serviço estará disponível ininterruptamente ou livre de erros.
                    </p>
                    <p>
                      7.3. Nossa responsabilidade total não excederá o valor pago por você nos últimos 12 meses.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Changes to Terms */}
                <section className="space-y-3">
                  <h3 className="text-lg">8. Alterações nos Termos</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Reservamo-nos o direito de modificar ou substituir estes termos a qualquer momento. Se uma revisão for material, forneceremos aviso prévio de pelo menos 30 dias antes de quaisquer novos termos entrarem em vigor. O uso continuado do serviço após quaisquer alterações constitui aceitação desses termos.
                  </p>
                </section>

                <Separator />

                {/* Termination */}
                <section className="space-y-3">
                  <h3 className="text-lg">9. Rescisão</h3>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      9.1. Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio, por violação destes Termos.
                    </p>
                    <p>
                      9.2. Você pode encerrar sua conta a qualquer momento através das configurações.
                    </p>
                    <p>
                      9.3. Após o encerramento, seu direito de usar o serviço cessará imediatamente.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Contact */}
                <section className="space-y-3">
                  <h3 className="text-lg">10. Contato</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco através do email: contato@impulsyia.com
                  </p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
