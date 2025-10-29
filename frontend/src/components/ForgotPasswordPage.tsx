import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ForgotPasswordPageProps {
  isLightTheme: boolean;
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({ isLightTheme, onBackToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor, insira seu email');
      return;
    }

    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);
    
    // Simular envio de email
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      toast.success('Email de recuperação enviado!');
    }, 1500);
  };

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
          onClick={onBackToLogin}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      {/* Forgot Password Card - Centered */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border shadow-lg animate-fade-in-up">
          {!emailSent ? (
            <>
              <CardHeader className="text-center space-y-4 pb-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary">
                    <Mail className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <CardTitle className="text-2xl">Esqueci minha senha</CardTitle>
                  <CardDescription>
                    Digite seu email para receber um link de recuperação
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 bg-input-background"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full h-11 gap-2 mt-6"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Enviar link de recuperação</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex-col pt-0">
                <p className="text-center text-xs text-muted-foreground">
                  Lembrou sua senha?{' '}
                  <button 
                    onClick={onBackToLogin}
                    className="text-primary underline hover:no-underline transition-colors"
                  >
                    Fazer login
                  </button>
                </p>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="text-center space-y-4 pb-6">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <CardTitle className="text-2xl">Email enviado!</CardTitle>
                  <CardDescription>
                    Verifique sua caixa de entrada
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Enviamos um link de recuperação para:
                  </p>
                  <p className="text-sm">
                    {email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    O link expira em 1 hora. Não se esqueça de verificar sua pasta de spam.
                  </p>
                </div>

                <Button
                  onClick={onBackToLogin}
                  variant="outline"
                  className="w-full h-11 mt-4"
                >
                  Voltar para o login
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Não recebeu o email? Tentar novamente
                  </button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
