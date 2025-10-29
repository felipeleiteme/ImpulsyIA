import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

interface LoginPageProps {
  isLightTheme: boolean;
  onLogin: (email: string, password: string) => void;
  onToggleTheme: () => void;
  onShowSignUp?: () => void;
  onShowForgotPassword?: () => void;
  onShowTerms?: () => void;
  onShowPrivacy?: () => void;
}

export function LoginPage({ isLightTheme, onLogin, onToggleTheme, onShowSignUp, onShowForgotPassword, onShowTerms, onShowPrivacy }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular delay de login
    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 1000);
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

      {/* Login Card - Centered */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border shadow-lg animate-fade-in-up">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground shadow-md">
                <span className="text-3xl">💎</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <CardTitle className="text-2xl">Bem-vindo ao ImpulsyIA</CardTitle>
              <CardDescription>
                Entre para se tornar a melhor versão de você
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Login Form */}
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

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10 bg-input-background"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={onShowForgotPassword}
                  className="text-sm text-primary hover:underline transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-11 gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs text-muted-foreground">
                  Não tem uma conta?
                </span>
              </div>
            </div>

            {/* Sign Up Button */}
            <Button
              type="button"
              variant="outline"
              onClick={onShowSignUp}
              className="w-full h-11"
            >
              Criar uma conta
            </Button>
          </CardContent>

          <CardFooter className="flex-col pt-0">
            <p className="text-center text-xs text-muted-foreground px-4">
              Ao continuar, você concorda com nossos{' '}
              <button 
                onClick={onShowTerms}
                className="underline hover:text-foreground transition-colors"
              >
                Termos de Uso
              </button>
              {' '}e{' '}
              <button 
                onClick={onShowPrivacy}
                className="underline hover:text-foreground transition-colors"
              >
                Política de Privacidade
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
