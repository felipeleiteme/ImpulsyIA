import { Mail, Infinity, Eye, EyeOff, Sparkles, CreditCard, User } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SectionCard } from './SectionCard';
import { InfoBanner } from './InfoBanner';

import { useState } from 'react';
import { toast } from 'sonner';
import { Sidebar } from './Sidebar';
import { supabase } from '../services/supabase';

interface Chat {
  id: string;
  name: string;
  description: string;
}

interface ProfilePageProps {
  isLightTheme: boolean;
  onBack: () => void;
  isPremium?: boolean;
  userName?: string | null;
  userEmail?: string | null;
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
  onOpenSubscription: () => void;
}

export function ProfilePage({ 
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
  onOpenSubscription,
  userName,
  userEmail,
}: ProfilePageProps) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const displayName = userName || userEmail || 'Usuário';
  const displayEmail = userEmail || 'Email não disponível';

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('A nova senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (!userEmail) {
      toast.error('Não foi possível validar o e-mail do usuário.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (reauthError) {
        throw new Error('Senha atual incorreta. Tente novamente.');
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast.success('Senha alterada com sucesso!');
      handleCloseDialog();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível alterar a senha no momento.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setIsChangePasswordOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

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
          onOpenSubscription();
          setIsSidebarOpen(false);
        }}
      />

      <div className="flex-1 flex flex-col overflow-y-auto animate-fade-in-up">
        {/* Content */}
        <div className="flex-1 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-3xl mx-auto space-y-5 md:space-y-6">

        {/* Estatísticas de Uso */}
        <SectionCard
          title="Estatísticas de Uso"
          icon={Sparkles}
          isLightTheme={isLightTheme}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`${
                  isLightTheme ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  Mensagens hoje
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-3xl ${
                    isLightTheme ? 'text-slate-900' : 'text-slate-100'
                  }`}>
                    {isPremium ? '47' : '3'}
                  </span>
                  <span className={`${
                    isLightTheme ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    /
                  </span>
                  {isPremium ? (
                    <Infinity className={`w-7 h-7 ${
                      isLightTheme ? 'text-blue-600' : 'text-blue-400'
                    }`} />
                  ) : (
                    <span className={`text-3xl ${
                      isLightTheme ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      10
                    </span>
                  )}
                </div>
              </div>
              
              {/* Progress Bar for Free Users */}
              {!isPremium && (
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${
                  isLightTheme ? 'bg-slate-200' : 'bg-slate-700'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
                    style={{ width: '30%' }}
                  />
                </div>
              )}
            </div>
            
            {!isPremium ? (
              <InfoBanner
                variant="warning"
                isLightTheme={isLightTheme}
                emoji="💡"
              >
                <p className="text-sm">
                  Faça upgrade para Premium e tenha mensagens ilimitadas!
                </p>
              </InfoBanner>
            ) : (
              <InfoBanner
                variant="success"
                isLightTheme={isLightTheme}
                emoji="✨"
              >
                <p className="text-sm">
                  Você tem mensagens ilimitadas com o plano Premium!
                </p>
              </InfoBanner>
            )}
          </div>
        </SectionCard>

        {/* Plano Atual */}
        <SectionCard
          title="Plano Atual"
          icon={CreditCard}
          isLightTheme={isLightTheme}
          variant={isPremium ? 'premium' : 'default'}
        >
          <div className="flex items-center gap-3">
            <div className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
              isPremium
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : isLightTheme
                  ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}>
              {isPremium && <span className="text-lg">👑</span>}
              <span>{isPremium ? 'Premium' : 'Gratuito'}</span>
            </div>
          </div>
        </SectionCard>

        {/* Informações Pessoais */}
        <SectionCard
          title="Informações Pessoais"
          icon={User}
          isLightTheme={isLightTheme}
          subtitle={displayName}
        >
          <div className="space-y-4">
            <div className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
              isLightTheme
                ? 'bg-slate-50 hover:bg-slate-100'
                : 'bg-slate-800/50 hover:bg-slate-800'
            }`}>
              <div className={`p-2.5 rounded-lg ${
                isLightTheme
                  ? 'bg-white shadow-sm'
                  : 'bg-slate-900'
              }`}>
                <Mail className={`w-5 h-5 ${
                  isLightTheme ? 'text-slate-600' : 'text-slate-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs mb-1 ${
                  isLightTheme ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Email
                </div>
                <div className={`truncate ${
                  isLightTheme ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  {displayEmail}
                </div>
              </div>
            </div>

            <Separator className={`${
              isLightTheme ? 'bg-slate-200' : 'bg-slate-700'
            }`} />

            <Button
              variant="outline"
              onClick={() => setIsChangePasswordOpen(true)}
              className={`w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isLightTheme
                  ? 'border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700'
                  : 'border-slate-600 hover:bg-slate-800 hover:border-slate-500 text-slate-300'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
          </div>
        </SectionCard>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className={`sm:max-w-[500px] ${
          isLightTheme
            ? 'bg-white border-slate-200'
            : 'bg-slate-900 border-slate-700'
        }`}>
          <DialogHeader>
            <DialogTitle className={`${
              isLightTheme ? 'text-slate-900' : 'text-slate-100'
            }`}>
              Alterar Senha
            </DialogTitle>
            <DialogDescription className={`${
              isLightTheme ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Digite sua senha atual e escolha uma nova senha segura.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Senha Atual */}
            <div className="space-y-2">
              <Label htmlFor="current-password" className={`${
                isLightTheme ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Senha Atual
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`pr-10 ${
                    isLightTheme
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-800 border-slate-600 text-slate-100'
                  }`}
                  placeholder="Digite sua senha atual"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isLightTheme ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="new-password" className={`${
                isLightTheme ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`pr-10 ${
                    isLightTheme
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-800 border-slate-600 text-slate-100'
                  }`}
                  placeholder="Digite sua nova senha (mín. 8 caracteres)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isLightTheme ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className={`${
                isLightTheme ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Confirmar Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pr-10 ${
                    isLightTheme
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-800 border-slate-600 text-slate-100'
                  }`}
                  placeholder="Digite novamente sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isLightTheme ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
              className={`${
                isLightTheme
                  ? 'border-slate-300 hover:bg-slate-50 text-slate-700'
                  : 'border-slate-600 hover:bg-slate-800 text-slate-300'
              }`}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isSubmitting}
              className={`${
                isLightTheme
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}
