import { useState } from 'react';
import { CreditCard, Check, ArrowLeft, Shield, Lock, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface CheckoutPageProps {
  isLightTheme: boolean;
  onBack: () => void;
  selectedPlan?: 'free' | 'premium';
}

export function CheckoutPage({ isLightTheme, onBack, selectedPlan = 'premium' }: CheckoutPageProps) {
  const [plan, setPlan] = useState<'free' | 'premium'>(selectedPlan);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simulação de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (plan === 'free') {
      toast.success('Plano Gratuito ativado com sucesso! 🎉');
    } else {
      toast.success('Pagamento processado com sucesso! 💎');
    }
    
    setIsProcessing(false);
    onBack();
  };

  const planPrice = plan === 'premium' ? 29.90 : 0;
  
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
    <div className={`min-h-screen transition-colors duration-700 ${
      isLightTheme 
        ? 'bg-slate-50' 
        : 'bg-slate-950'
    }`}>
      {/* Content */}
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="text-center mb-2">
            <div className="inline-block mb-4">
              <span className="text-6xl animate-bounce-subtle">💎</span>
            </div>
            <h1 className="mb-2">Checkout ImpulsyIA</h1>
            <p className={`${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
              Complete sua assinatura e comece a transformar sua vida
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Selection */}
            <Card className={`p-6 ${
              isLightTheme 
                ? 'border-slate-200' 
                : 'border-slate-700'
            }`}>
              <h2 className="mb-4">Escolha seu Plano</h2>
              
              <RadioGroup value={plan} onValueChange={(value) => setPlan(value as 'free' | 'premium')}>
                {/* Free Plan */}
                <label className={`flex items-start space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  plan === 'free'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    : isLightTheme 
                      ? 'border-slate-200 hover:border-slate-300' 
                      : 'border-slate-700 hover:border-slate-600'
                }`}>
                  <RadioGroupItem value="free" id="free" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3>Plano Gratuito</h3>
                        <p className={`${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                          R$ 0/mês
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {freePlanFeatures.map((feature, index) => (
                        <li key={index} className={`flex items-center gap-2 ${
                          isLightTheme ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </label>

                {/* Premium Plan */}
                <label className={`flex items-start space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  plan === 'premium'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    : isLightTheme 
                      ? 'border-slate-200 hover:border-slate-300' 
                      : 'border-slate-700 hover:border-slate-600'
                }`}>
                  <RadioGroupItem value="premium" id="premium" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3>Plano Premium</h3>
                          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                            Popular
                          </Badge>
                        </div>
                        <p className={`${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                          R$ 29,90/mês
                        </p>
                      </div>
                      <Zap className="w-8 h-8 text-blue-500" />
                    </div>
                    <ul className="space-y-1">
                      {premiumPlanFeatures.map((feature, index) => (
                        <li key={index} className={`flex items-center gap-2 ${
                          isLightTheme ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </label>
              </RadioGroup>
            </Card>

            {/* Payment Method - Only show for Premium */}
            {plan === 'premium' && (
              <Card className={`p-6 ${
                isLightTheme 
                  ? 'border-slate-200' 
                  : 'border-slate-700'
              }`}>
                <h2 className="mb-4">Método de Pagamento</h2>
                
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'pix' | 'boleto')}>
                  <div className="space-y-3">
                    <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                        : isLightTheme 
                          ? 'border-slate-200 hover:border-slate-300' 
                          : 'border-slate-700 hover:border-slate-600'
                    }`}>
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="w-5 h-5" />
                      <span>Cartão de Crédito</span>
                    </label>

                    <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                        : isLightTheme 
                          ? 'border-slate-200 hover:border-slate-300' 
                          : 'border-slate-700 hover:border-slate-600'
                    }`}>
                      <RadioGroupItem value="pix" id="pix" />
                      <span className="text-xl">💳</span>
                      <span>PIX (Aprovação imediata)</span>
                    </label>

                    <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'boleto'
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                        : isLightTheme 
                          ? 'border-slate-200 hover:border-slate-300' 
                          : 'border-slate-700 hover:border-slate-600'
                    }`}>
                      <RadioGroupItem value="boleto" id="boleto" />
                      <span className="text-xl">🧾</span>
                      <span>Boleto Bancário</span>
                    </label>
                  </div>
                </RadioGroup>

                {/* Payment Details */}
                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4 animate-fade-in-up">
                    <div>
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Validade</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardName">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        placeholder="Como está no cartão"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className={`mt-6 p-4 rounded-lg animate-fade-in-up ${
                    isLightTheme ? 'bg-blue-50' : 'bg-blue-900/20'
                  }`}>
                    <p className={`${isLightTheme ? 'text-slate-700' : 'text-slate-300'}`}>
                      Após confirmar, você receberá um QR Code para pagamento via PIX. 
                      O acesso será liberado imediatamente após a confirmação do pagamento.
                    </p>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div className={`mt-6 p-4 rounded-lg animate-fade-in-up ${
                    isLightTheme ? 'bg-blue-50' : 'bg-blue-900/20'
                  }`}>
                    <p className={`${isLightTheme ? 'text-slate-700' : 'text-slate-300'}`}>
                      O boleto será gerado após a confirmação. O prazo para pagamento é de até 3 dias úteis 
                      e a liberação do acesso ocorre em até 2 dias úteis após a confirmação.
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Billing Information - Only show for Premium */}
            {plan === 'premium' && (
              <Card className={`p-6 ${
                isLightTheme 
                  ? 'border-slate-200' 
                  : 'border-slate-700'
              }`}>
                <h2 className="mb-4">Informações de Cobrança</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        placeholder="Seu nome"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        placeholder="Seu sobrenome"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF/CNPJ</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      className="mt-1"
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className={`p-6 ${
                isLightTheme 
                  ? 'border-slate-200' 
                  : 'border-slate-700'
              }`}>
                <h2 className="mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={isLightTheme ? 'text-slate-600' : 'text-slate-400'}>
                      Plano {plan === 'premium' ? 'Premium' : 'Gratuito'}
                    </span>
                    <span>
                      R$ {planPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {plan === 'premium' && (
                    <>
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span className={isLightTheme ? 'text-slate-600' : 'text-slate-400'}>
                          Subtotal
                        </span>
                        <span>R$ {planPrice.toFixed(2).replace('.', ',')}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span>Total</span>
                        <span className="text-2xl">R$ {planPrice.toFixed(2).replace('.', ',')}</span>
                      </div>

                      <div className={`text-xs ${isLightTheme ? 'text-slate-500' : 'text-slate-500'}`}>
                        Cobrado mensalmente. Cancele quando quiser.
                      </div>
                    </>
                  )}

                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processando...
                      </span>
                    ) : (
                      <>
                        {plan === 'free' ? 'Ativar Plano Gratuito' : 'Confirmar Pagamento'}
                      </>
                    )}
                  </Button>

                  {/* Security Badges */}
                  <div className={`pt-4 border-t space-y-2 ${
                    isLightTheme ? 'border-slate-200' : 'border-slate-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-green-500" />
                      <span className={`text-xs ${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                        Pagamento 100% seguro
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className={`text-xs ${isLightTheme ? 'text-slate-600' : 'text-slate-400'}`}>
                        Dados criptografados
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Guarantee Badge */}
              {plan === 'premium' && (
                <Card className={`mt-4 p-4 ${
                  isLightTheme 
                    ? 'border-green-200' 
                    : 'border-green-800'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <span className="text-2xl">✓</span>
                    </div>
                    <div>
                      <h3 className={`mb-1 ${isLightTheme ? 'text-green-900' : 'text-green-400'}`}>
                        Garantia de 7 dias
                      </h3>
                      <p className={`text-xs ${isLightTheme ? 'text-green-700' : 'text-green-300'}`}>
                        Não gostou? Devolvemos 100% do seu dinheiro sem perguntas.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
