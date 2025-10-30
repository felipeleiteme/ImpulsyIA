import { Check, Crown, Zap, Star, Shield, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { SectionCard } from './SectionCard';
import { InfoBanner } from './InfoBanner';
import { toast } from 'sonner@2.0.3';
import { Sidebar } from './Sidebar';
import { useState } from 'react';

interface Chat {
  id: string;
  name: string;
  description: string;
}

interface SubscriptionPageProps {
  isLightTheme: boolean;
  onBack: () => void;
  isPremium?: boolean;
  chats: Chat[];
  currentChatId: string | null;
  onNavigateHome: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onEditChat: (chatId: string) => void;
  onSaveEditChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  editingChatId: string | null;
  editingChatName: string;
  onEditNameChange: (name: string) => void;
  onOpenProfile: () => void;
  onOpenCheckout: () => void;
}

export function SubscriptionPage({ 
  isLightTheme, 
  onBack, 
  isPremium = false,
  chats,
  currentChatId,
  onNavigateHome,
  onNewChat,
  onSelectChat,
  onEditChat,
  onSaveEditChat,
  onDeleteChat,
  editingChatId,
  editingChatName,
  onEditNameChange,
  onOpenProfile,
  onOpenCheckout
}: SubscriptionPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleUpgrade = () => {
    onOpenCheckout();
  };

  const handleManageSubscription = () => {
    toast.success('Redirecionando para gerenciar sua assinatura...');
    // Aqui você implementaria o gerenciamento da assinatura
  };

  const freePlanFeatures = [
    '10 mensagens por dia',
    'Acesso aos 7 GEMs',
    'Histórico de conversas'
  ];

  const premiumPlanFeatures = [
    'Mensagens ilimitadas',
    'Acesso prioritário',
    'Suporte prioritário',
    'Novos recursos primeiro'
  ];

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        isLightTheme={isLightTheme}
        isPremium={isPremium}
        chats={chats}
        currentChatId={currentChatId}
        editingChatId={editingChatId}
        editingChatName={editingChatName}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={() => {
          onNewChat();
          setIsSidebarOpen(false);
        }}
        onSelectChat={(chatId) => {
          onSelectChat(chatId);
          setIsSidebarOpen(false);
        }}
        onEditChat={onEditChat}
        onSaveEditChat={onSaveEditChat}
        onDeleteChat={onDeleteChat}
        onEditNameChange={onEditNameChange}
        onNavigateHome={() => {
          onNavigateHome();
          setIsSidebarOpen(false);
        }}
        onOpenSubscription={() => {
          setIsSidebarOpen(false);
        }}
      />

      <div className="flex-1 flex flex-col overflow-y-auto animate-fade-in-up">
        {/* Content */}
        <div className="flex-1 px-4 md:px-6 py-6 md:py-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          {/* Promotional Banner for Free Users */}
          {!isPremium && (
            <InfoBanner
              variant="premium"
              icon={Star}
              isLightTheme={isLightTheme}
            >
              <div>
                <h4 className={`mb-1 ${
                  isLightTheme ? 'text-blue-900' : 'text-blue-100'
                }`}>
                  Desbloqueie todo o potencial do ImpulsyIA
                </h4>
                <p className="text-sm">
                  Faça upgrade para Premium e tenha acesso a mensagens ilimitadas, suporte prioritário e muito mais!
                </p>
              </div>
            </InfoBanner>
          )}
          
          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan Card */}
            <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
              isLightTheme
                ? 'bg-white border-slate-200 hover:shadow-xl hover:border-slate-300'
                : 'bg-slate-900 border-slate-700 hover:shadow-2xl hover:border-slate-600'
            } ${!isPremium ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
              <div className="p-6">
                {/* Plan Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`text-xl ${
                      isLightTheme ? 'text-slate-900' : 'text-slate-100'
                    }`}>
                      Gratuito
                    </h3>
                    {!isPremium && (
                      <Badge 
                        variant="outline" 
                        className={`mt-2 ${
                          isLightTheme
                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                            : 'border-blue-800 bg-blue-950 text-blue-300'
                        }`}
                      >
                        Plano Atual
                      </Badge>
                    )}
                  </div>
                  <Zap className={`w-8 h-8 ${
                    isLightTheme ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl ${
                      isLightTheme ? 'text-slate-900' : 'text-slate-100'
                    }`}>
                      R$ 0
                    </span>
                    <span className={`text-base ${
                      isLightTheme ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      /mês
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${
                    isLightTheme ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Para sempre gratuito
                  </p>
                </div>

                <Separator className={`my-6 ${
                  isLightTheme ? 'bg-slate-200' : 'bg-slate-700'
                }`} />

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {freePlanFeatures.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 transition-transform duration-200 hover:translate-x-1"
                    >
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isLightTheme ? 'text-green-600' : 'text-green-500'
                      }`} />
                      <span className={`${
                        isLightTheme ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                {!isPremium && (
                  <Button
                    variant="outline"
                    className={`w-full cursor-default ${
                      isLightTheme
                        ? 'border-slate-300 text-slate-700 bg-slate-50'
                        : 'border-slate-600 text-slate-300 bg-slate-800'
                    }`}
                    disabled
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Seu Plano Atual
                  </Button>
                )}
              </div>
            </Card>

            {/* Premium Plan Card */}
            <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
              isLightTheme
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-2xl hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300'
                : 'bg-gradient-to-br from-blue-950 to-indigo-950 border-blue-800 hover:shadow-2xl hover:from-blue-900 hover:to-indigo-900 hover:border-blue-700'
            } ${isPremium ? 'ring-2 ring-blue-500 shadow-xl' : 'shadow-lg'}`}>
              <div className="p-6">
                {/* Plan Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`text-xl ${
                      isLightTheme ? 'text-slate-900' : 'text-slate-100'
                    }`}>
                      Premium
                    </h3>
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 mt-2">
                      <Star className="w-3 h-3 mr-1" />
                      Recomendado
                    </Badge>
                    {isPremium && (
                      <Badge 
                        variant="outline" 
                        className={`mt-2 ${
                          isLightTheme
                            ? 'border-blue-300 bg-blue-100 text-blue-700'
                            : 'border-blue-700 bg-blue-900 text-blue-300'
                        }`}
                      >
                        Plano Atual
                      </Badge>
                    )}
                  </div>
                  <Crown className={`w-8 h-8 ${
                    isLightTheme ? 'text-blue-600' : 'text-blue-400'
                  }`} />
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl ${
                      isLightTheme ? 'text-slate-900' : 'text-slate-100'
                    }`}>
                      R$ 29,90
                    </span>
                    <span className={`text-base ${
                      isLightTheme ? 'text-slate-600' : 'text-slate-300'
                    }`}>
                      /mês
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${
                    isLightTheme ? 'text-blue-600' : 'text-blue-400'
                  }`}>
                    Cancele quando quiser
                  </p>
                </div>

                <Separator className={`my-6 ${
                  isLightTheme ? 'bg-blue-200' : 'bg-blue-800'
                }`} />

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {premiumPlanFeatures.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 transition-transform duration-200 hover:translate-x-1"
                    >
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isLightTheme ? 'text-blue-600' : 'text-blue-400'
                      }`} />
                      <span className={`${
                        isLightTheme ? 'text-slate-700' : 'text-slate-200'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                {isPremium ? (
                  <Button
                    onClick={handleManageSubscription}
                    variant="outline"
                    className={`w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      isLightTheme
                        ? 'border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400'
                        : 'border-blue-700 text-blue-300 hover:bg-blue-900 hover:border-blue-600'
                    }`}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Gerenciar Assinatura
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Fazer Upgrade
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Additional Info */}
          <InfoBanner
            variant="success"
            icon={Shield}
            isLightTheme={isLightTheme}
          >
            <div>
              <h4 className={`mb-1 ${
                isLightTheme ? 'text-green-900' : 'text-green-100'
              }`}>
                Pagamento Seguro
              </h4>
              <p className="text-sm">
                Todas as transações são criptografadas e seguras. Cancele a qualquer momento sem taxas adicionais.
              </p>
            </div>
          </InfoBanner>

          {/* FAQ Section */}
          <SectionCard
            title="Perguntas Frequentes"
            icon={HelpCircle}
            isLightTheme={isLightTheme}
          >
            <div className="space-y-4">
              <div className={`p-4 rounded-lg transition-all duration-200 hover:shadow-md ${
                isLightTheme
                  ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
              }`}>
                <h4 className={`mb-2 flex items-start gap-2 ${
                  isLightTheme ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  <span className={`${isLightTheme ? 'text-blue-600' : 'text-blue-400'}`}>•</span>
                  Como funciona o período de teste?
                </h4>
                <p className={`text-sm ml-4 ${
                  isLightTheme ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  Você pode experimentar o plano Premium gratuitamente por 7 dias. Cancele antes do fim do período e não será cobrado.
                </p>
              </div>
              <div className={`p-4 rounded-lg transition-all duration-200 hover:shadow-md ${
                isLightTheme
                  ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
              }`}>
                <h4 className={`mb-2 flex items-start gap-2 ${
                  isLightTheme ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  <span className={`${isLightTheme ? 'text-blue-600' : 'text-blue-400'}`}>•</span>
                  Posso cancelar a qualquer momento?
                </h4>
                <p className={`text-sm ml-4 ${
                  isLightTheme ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais. Seu acesso continuará até o fim do período pago.
                </p>
              </div>
              <div className={`p-4 rounded-lg transition-all duration-200 hover:shadow-md ${
                isLightTheme
                  ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
              }`}>
                <h4 className={`mb-2 flex items-start gap-2 ${
                  isLightTheme ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  <span className={`${isLightTheme ? 'text-blue-600' : 'text-blue-400'}`}>•</span>
                  O que acontece quando o limite de mensagens acaba?
                </h4>
                <p className={`text-sm ml-4 ${
                  isLightTheme ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  No plano gratuito, o limite é reiniciado diariamente às 00h. Com Premium, você tem mensagens ilimitadas sem restrições.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
      </div>
    </>
  );
}
