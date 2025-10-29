import { Sparkles, Rocket, Menu, Send, Edit2, Trash2, User, CreditCard, LogOut, Plus, X, Home, ChevronLeft, Settings } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { ThinkingIndicator } from './components/ThinkingIndicator';
import { ProfilePage } from './components/ProfilePage';
import { SubscriptionPage } from './components/SubscriptionPage';
import { CheckoutPage } from './components/CheckoutPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [currentChatId, setCurrentChatId] = useState(1);
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editingChatName, setEditingChatName] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Controla se o usuário tem plano Premium - altere para 'true' para testar o estado Premium
  
  const [chats, setChats] = useState([
    { id: 1, name: 'Mestre do Mapeamento', date: 'Hoje' },
    { id: 2, name: 'Objetivos de Carreira', date: 'Ontem' },
    { id: 3, name: 'Desenvolvimento Pessoal', date: '2 dias atrás' },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Olá! Bem-vindo ao Mestre do Mapeamento 🗺️',
    },
    {
      id: 2,
      type: 'assistant',
      content: 'Vou te ajudar a organizar seus objetivos de vida de forma holística. Para começar, me conte: qual é a área da sua vida que você mais gostaria de desenvolver agora?',
    },
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isLightTheme) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isLightTheme]);

  const handleLogin = (email: string, password: string) => {
    // Simular autenticação - em produção, fazer chamada API real
    console.log('Login com:', email);
    setIsAuthenticated(true);
    setShowSignUp(false);
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // Simular criação de conta - em produção, fazer chamada API real
    console.log('Criando conta para:', name, email);
    setIsAuthenticated(true);
    setShowSignUp(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setJourneyStarted(false);
    setShowProfile(false);
    setShowSubscription(false);
    setShowCheckout(false);
    setIsSidebarOpen(false);
    setShowSignUp(false);
    setShowForgotPassword(false);
    setShowTermsOfService(false);
    setShowPrivacyPolicy(false);
  };

  const handleBackToAuth = () => {
    setShowSignUp(false);
    setShowForgotPassword(false);
    setShowTermsOfService(false);
    setShowPrivacyPolicy(false);
  };

  // Se não estiver autenticado, mostrar página de login, sign up, forgot password, terms ou privacy
  if (!isAuthenticated) {
    if (showTermsOfService) {
      return (
        <TermsOfServicePage
          isLightTheme={isLightTheme}
          onBack={handleBackToAuth}
        />
      );
    }

    if (showPrivacyPolicy) {
      return (
        <PrivacyPolicyPage
          isLightTheme={isLightTheme}
          onBack={handleBackToAuth}
        />
      );
    }

    if (showForgotPassword) {
      return (
        <ForgotPasswordPage
          isLightTheme={isLightTheme}
          onBackToLogin={handleBackToAuth}
        />
      );
    }
    
    if (showSignUp) {
      return (
        <SignUpPage
          isLightTheme={isLightTheme}
          onSignUp={handleSignUp}
          onBackToLogin={handleBackToAuth}
          onShowTerms={() => setShowTermsOfService(true)}
          onShowPrivacy={() => setShowPrivacyPolicy(true)}
        />
      );
    }
    
    return (
      <LoginPage 
        isLightTheme={isLightTheme}
        onLogin={handleLogin}
        onToggleTheme={() => setIsLightTheme(!isLightTheme)}
        onShowSignUp={() => setShowSignUp(true)}
        onShowForgotPassword={() => setShowForgotPassword(true)}
        onShowTerms={() => setShowTermsOfService(true)}
        onShowPrivacy={() => setShowPrivacyPolicy(true)}
      />
    );
  }

  const features = [
    'Mapeie seus objetivos de vida',
    'Identifique desafios reais',
    'Aprenda com ciência comprovada',
    'Construa seu assistente personalizado'
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        type: 'user',
        content: message,
      }]);
      setMessage('');
      setIsThinking(true);
      
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'assistant',
          content: 'Entendi. Vamos explorar isso juntos. Você já tentou algo antes nessa área? O que funcionou e o que não funcionou?',
        }]);
      }, 2000);
    }
  };

  const handleDeleteChat = (chatId: number) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId && chats.length > 1) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setCurrentChatId(remainingChats[0].id);
    }
  };

  const handleEditChat = (chatId: number) => {
    setEditingChatId(chatId);
    const chat = chats.find(c => c.id === chatId);
    if (chat) setEditingChatName(chat.name);
  };

  const handleSaveEditChat = (chatId: number) => {
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, name: editingChatName } : chat
    ));
    setEditingChatId(null);
    setEditingChatName('');
  };

  const handleNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      name: `Nova Conversa ${chats.length + 1}`,
      date: 'Agora',
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: 'Olá! Como posso ajudá-lo hoje? 💎',
      },
    ]);
  };

  if (journeyStarted) {
    const currentChat = chats.find(chat => chat.id === currentChatId);
    
    // Render CheckoutPage outside the main wrapper to avoid background conflicts
    if (showCheckout) {
      return (
        <>
          <Toaster 
            theme={isLightTheme ? 'light' : 'dark'}
            position="top-right"
            richColors
          />
          <CheckoutPage 
            isLightTheme={isLightTheme}
            onBack={() => {
              setShowCheckout(false);
              setShowSubscription(true);
            }}
            selectedPlan="premium"
          />
        </>
      );
    }
    
    return (
      <>
        <Toaster 
          theme={isLightTheme ? 'light' : 'dark'}
          position="top-right"
          richColors
        />
        <div className={`h-screen flex transition-colors duration-700 ${
          isLightTheme 
            ? 'bg-white' 
            : 'bg-slate-950'
        }`}>
        {/* Left Sidebar - Chat History (hide when profile or subscription is shown) */}
        {!showProfile && !showSubscription && (
          <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-500 ease-in-out border-r overflow-hidden ${
            isLightTheme 
              ? 'border-slate-200 bg-white' 
              : 'border-slate-700/50 bg-slate-950'
          }`}>
            <div className={`w-72 h-full flex flex-col transition-all duration-500 ease-in-out ${
              isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              {isSidebarOpen && (
            <>
              {/* Sidebar Header */}
              <div className={`flex-shrink-0 p-4 border-b ${
                isLightTheme ? 'border-slate-200' : 'border-slate-700/50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setJourneyStarted(false)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-2xl">💎</span>
                    <span className={`${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>
                      ImpulsyIA
                    </span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`h-8 w-8 ${
                      isLightTheme 
                        ? 'text-slate-700 hover:bg-slate-100' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      setJourneyStarted(false);
                      setMessages([]);
                      setMessage('');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Conversa
                  </Button>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto space-y-1 p-[12px]">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                      currentChatId === chat.id
                        ? isLightTheme
                          ? 'bg-slate-100 shadow-sm'
                          : 'bg-slate-800 shadow-md'
                        : isLightTheme
                          ? 'hover:bg-slate-50 hover:shadow-sm'
                          : 'hover:bg-slate-900 hover:shadow-md'
                    }`}
                    onClick={() => {
                      setCurrentChatId(chat.id);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {editingChatId === chat.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingChatName}
                          onChange={(e) => setEditingChatName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSaveEditChat(chat.id);
                          }}
                          className={`h-8 text-sm ${
                            isLightTheme ? 'bg-white' : 'bg-slate-900'
                          }`}
                          autoFocus
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveEditChat(chat.id);
                          }}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className={`truncate ${
                              isLightTheme ? 'text-slate-900' : 'text-slate-100'
                            }`}>
                              {chat.name}
                            </div>
                            <div className={`text-xs mt-1 ${
                              isLightTheme ? 'text-slate-500' : 'text-slate-500'
                            }`}>
                              {chat.date}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditChat(chat.id);
                              }}
                              className={`p-1 rounded transition-colors ${
                                isLightTheme
                                  ? 'hover:bg-slate-200 text-slate-600'
                                  : 'hover:bg-slate-700 text-slate-400'
                              }`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChat(chat.id);
                              }}
                              className={`p-1 rounded transition-colors ${
                                isLightTheme
                                  ? 'hover:bg-red-100 text-red-600'
                                  : 'hover:bg-red-900/30 text-red-400'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Sidebar Footer - Subscription Link - Fixed at bottom */}
              <div className={`flex-shrink-0 border-t p-3 mt-auto ${
                isLightTheme ? 'border-slate-200 bg-white' : 'border-slate-700/50 bg-slate-950'
              }`}>
                <Button
                  onClick={() => {
                    setShowSubscription(true);
                    setShowProfile(false);
                    setIsSidebarOpen(false);
                  }}
                  variant="outline"
                  className={`w-full justify-start transition-all duration-200 ${
                    isPremium
                      ? isLightTheme
                        ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 shadow-sm hover:shadow-md'
                        : 'border-blue-800 bg-gradient-to-r from-blue-950 to-indigo-950 text-blue-300 hover:from-blue-900 hover:to-indigo-900 hover:border-blue-700 shadow-md hover:shadow-lg'
                      : isLightTheme
                        ? 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md'
                        : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isPremium ? (
                    <>
                      <span className="text-base mr-2">👑</span>
                      <span className="font-medium">Premium Ativo</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>Fazer Upgrade</span>
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header - Refined */}
          <div className={`sticky top-0 z-20 border-b transition-all duration-300 ${
            isLightTheme 
              ? 'border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm' 
              : 'border-slate-800/50 bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-black/5'
          }`}>
            <div className="px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4">
              
              {/* LEFT SECTION */}
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                {/* Menu Hamburguer - apenas para chat */}
                {!showProfile && !showSubscription && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`group relative shrink-0 h-10 w-10 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                      isLightTheme 
                        ? 'bg-slate-50/80 border border-slate-200/60 text-slate-700 hover:bg-slate-100 hover:border-slate-300 hover:shadow-md' 
                        : 'bg-slate-900/80 border border-slate-800/60 text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5'
                    }`}
                  >
                    <Menu className="w-5 h-5 transition-transform duration-200 group-hover:rotate-180" />
                  </Button>
                )}
                
                {/* Botão Voltar + Título para Profile/Subscription pages */}
                {(showProfile || showSubscription) && (
                  <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowProfile(false);
                        setShowSubscription(false);
                      }}
                      className={`group shrink-0 h-10 w-10 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                        isLightTheme 
                          ? 'hover:bg-slate-100 text-slate-700' 
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    </Button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
                          isLightTheme 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'bg-blue-950/50 text-blue-400'
                        }`}>
                          <span className="text-base">{showProfile ? '👤' : '💳'}</span>
                        </div>
                        <h1 className={`truncate text-lg font-semibold tracking-tight ${
                          isLightTheme ? 'text-slate-900' : 'text-slate-100'
                        }`}>
                          {showProfile ? 'Meu Perfil' : 'Assinatura'}
                        </h1>
                      </div>
                      <p className={`text-xs truncate leading-relaxed ${
                        isLightTheme ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {showProfile ? 'Gerencie suas informações e preferências' : 'Escolha o plano ideal para você'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Nome do chat para chat view */}
                {!showProfile && !showSubscription && (
                  <button 
                    onClick={() => setJourneyStarted(false)}
                    className={`group flex items-center gap-2.5 min-w-0 flex-1 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-[1.01] ${
                      isLightTheme 
                        ? 'hover:bg-slate-50' 
                        : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                      isLightTheme 
                        ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' 
                        : 'bg-blue-950/50 text-blue-400 group-hover:bg-blue-950'
                    }`}>
                      <span className="text-base">💎</span>
                    </div>
                    <span className={`truncate font-medium tracking-tight transition-colors duration-200 ${
                      isLightTheme 
                        ? 'text-slate-900 group-hover:text-blue-600' 
                        : 'text-slate-100 group-hover:text-blue-400'
                    }`}>
                      {currentChat?.name || 'Nova Conversa'}
                    </span>
                  </button>
                )}
              </div>

              {/* RIGHT SECTION */}
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                {/* Premium Badge - apenas para chat */}
                {isPremium && !showProfile && !showSubscription && (
                  <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                    isLightTheme
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/30'
                  }`}>
                    <span className="text-sm">👑</span>
                    <span className="text-sm font-medium">Premium</span>
                  </div>
                )}
                
                {/* Dropdown Menu - para todas as páginas */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`group flex items-center gap-2.5 md:gap-3 h-auto px-2 md:px-3 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                        isLightTheme 
                          ? 'hover:bg-slate-50 hover:shadow-md' 
                          : 'hover:bg-slate-900/50 hover:shadow-xl hover:shadow-blue-500/5'
                      }`}
                    >
                      <Avatar className={`w-9 h-9 md:w-10 md:h-10 ring-2 ring-offset-2 transition-all duration-300 group-hover:ring-[3px] ${
                        isPremium
                          ? isLightTheme 
                            ? 'ring-blue-300/60 ring-offset-white group-hover:ring-blue-400/80 group-hover:shadow-lg group-hover:shadow-blue-500/20' 
                            : 'ring-blue-700/60 ring-offset-slate-950 group-hover:ring-blue-600/80 group-hover:shadow-xl group-hover:shadow-blue-500/20'
                          : isLightTheme 
                            ? 'ring-slate-200/80 ring-offset-white group-hover:ring-slate-300' 
                            : 'ring-slate-800/80 ring-offset-slate-950 group-hover:ring-slate-700'
                      }`}>
                        <AvatarImage src="" />
                        <AvatarFallback className={`font-semibold transition-all duration-200 ${
                          isLightTheme ? 'bg-blue-100 text-blue-700' : 'bg-blue-900 text-blue-300'
                        }`}>
                          JS
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex md:flex-col text-left min-w-0 pr-1">
                        <div className={`text-sm font-medium truncate transition-colors duration-200 ${
                          isLightTheme ? 'text-slate-900' : 'text-slate-100'
                        }`}>
                          João Silva
                        </div>
                        {isPremium ? (
                          <div className={`text-xs flex items-center gap-1.5 mt-0.5 ${
                            isLightTheme ? 'text-blue-600' : 'text-blue-400'
                          }`}>
                            <span className="text-[10px]">👑</span>
                            <span className="font-medium">Premium</span>
                          </div>
                        ) : (
                          <div className={`text-xs mt-0.5 ${
                            isLightTheme ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            Plano Gratuito
                          </div>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    {/* User Info Header */}
                    <div className={`px-2 py-3 border-b ${
                      isLightTheme ? 'border-slate-200' : 'border-slate-700'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className={`${
                            isLightTheme ? 'bg-blue-100 text-blue-600' : 'bg-blue-900 text-blue-300'
                          }`}>
                            JS
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className={`truncate ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>
                            João Silva
                          </div>
                          <div className={`text-xs truncate ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                            joao.silva@email.com
                          </div>
                          {isPremium && (
                            <div className={`text-xs flex items-center gap-1 mt-1 ${
                              isLightTheme ? 'text-blue-600' : 'text-blue-400'
                            }`}>
                              <span>👑</span>
                              <span>Plano Premium</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation Items */}
                    {!showProfile && (
                      <DropdownMenuItem onClick={() => {
                        setShowProfile(true);
                        setShowSubscription(false);
                      }}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                      </DropdownMenuItem>
                    )}
                    {!showSubscription && (
                      <DropdownMenuItem onClick={() => {
                        setShowSubscription(true);
                        setShowProfile(false);
                      }}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Assinatura</span>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    
                    {/* Settings */}
                    <DropdownMenuItem onClick={() => setIsLightTheme(!isLightTheme)}>
                      <span className="mr-2 text-base">{isLightTheme ? '🌙' : '☀️'}</span>
                      <span>{isLightTheme ? 'Tema Escuro' : 'Tema Claro'}</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Logout */}
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                      <span>Sair da Conta</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Profile Page, Subscription Page or Messages Area */}
          {showProfile ? (
            <ProfilePage 
              isLightTheme={isLightTheme}
              isPremium={isPremium}
              chats={chats}
              currentChatId={currentChatId}
              editingChatId={editingChatId}
              editingChatName={editingChatName}
              onBack={() => {
                setShowProfile(false);
              }}
              onNavigateHome={() => {
                setShowProfile(false);
                setJourneyStarted(false);
              }}
              onNewChat={() => {
                handleNewChat();
                setShowProfile(false);
              }}
              onSelectChat={(chatId) => {
                setCurrentChatId(chatId);
                setShowProfile(false);
              }}
              onEditChat={handleEditChat}
              onSaveEditChat={handleSaveEditChat}
              onDeleteChat={handleDeleteChat}
              onEditNameChange={setEditingChatName}
              onOpenSubscription={() => {
                setShowProfile(false);
                setShowSubscription(true);
              }}
            />
          ) : showSubscription ? (
            <SubscriptionPage 
              isLightTheme={isLightTheme}
              isPremium={isPremium}
              chats={chats}
              currentChatId={currentChatId}
              editingChatId={editingChatId}
              editingChatName={editingChatName}
              onBack={() => {
                setShowSubscription(false);
              }}
              onNavigateHome={() => {
                setShowSubscription(false);
                setJourneyStarted(false);
              }}
              onNewChat={() => {
                handleNewChat();
                setShowSubscription(false);
              }}
              onSelectChat={(chatId) => {
                setCurrentChatId(chatId);
                setShowSubscription(false);
              }}
              onEditChat={handleEditChat}
              onSaveEditChat={handleSaveEditChat}
              onDeleteChat={handleDeleteChat}
              onEditNameChange={setEditingChatName}
              onOpenProfile={() => {
                setShowSubscription(false);
                setShowProfile(true);
              }}
              onOpenCheckout={() => {
                setShowSubscription(false);
                setShowCheckout(true);
              }}
            />
          ) : (
            <>
              {/* Messages Area - Clean and minimal */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-6 py-8"
              >
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    >
                      <div className={`max-w-[80%] ${msg.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                        {msg.type === 'assistant' && (
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isLightTheme ? 'bg-slate-100' : 'bg-slate-800'
                            }`}>
                              💎
                            </div>
                            <div className={`rounded-2xl px-4 py-3 ${
                              isLightTheme 
                                ? 'bg-slate-100 text-slate-900' 
                                : 'bg-slate-800 text-slate-100'
                            }`}>
                              <p className="leading-relaxed">{msg.content}</p>
                            </div>
                          </div>
                        )}
                        
                        {msg.type === 'user' && (
                          <div className={`rounded-2xl px-4 py-3 ${
                            isLightTheme 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-600 text-white'
                          }`}>
                            <p className="leading-relaxed">{msg.content}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Thinking Indicator */}
                  {isThinking && <ThinkingIndicator isLightTheme={isLightTheme} />}
                </div>
              </div>
            </>
          )}

          {/* Input Area - Clean and minimal (hide when profile or subscription is shown) */}
          {!showProfile && !showSubscription && (
            <div className={`border-t px-6 py-4 ${
              isLightTheme 
                ? 'border-slate-200' 
                : 'border-slate-700/50'
            }`}>
              <div className="max-w-3xl mx-auto space-y-3">
                {/* Message counter for free users */}
                {!isPremium && (
                  <div className="flex items-center justify-between px-1">
                    <span className={`text-sm ${
                      isLightTheme ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      Mensagens restantes hoje
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                        isLightTheme
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        <span className="text-sm font-medium">7</span>
                        <span className="text-xs">/</span>
                        <span className="text-sm">10</span>
                      </div>
                      <button
                        onClick={() => {
                          setShowSubscription(true);
                        }}
                        className={`text-sm px-2 py-1 rounded-lg transition-colors ${
                          isLightTheme
                            ? 'text-blue-600 hover:bg-blue-50'
                            : 'text-blue-400 hover:bg-blue-950'
                        }`}
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>
                )}
                
                <div className={`rounded-2xl p-1.5 transition-all duration-200 ${
                  isLightTheme 
                    ? 'bg-white border border-slate-200 shadow-lg' 
                    : 'bg-slate-800/80 border border-slate-700/50 shadow-xl'
                }`}>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Escreva sua mensagem..."
                      className={`flex-1 border-0 py-6 px-6 focus-visible:ring-0 bg-transparent ${
                        isLightTheme 
                        ? 'placeholder:text-slate-400 text-slate-900' 
                        : 'placeholder:text-slate-400 text-slate-50'
                    }`}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    size="icon"
                    className={`h-12 w-12 rounded-xl transition-all duration-200 mr-1.5 ${
                      message.trim() 
                        ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30' 
                        : isLightTheme 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <Toaster 
        theme={isLightTheme ? 'light' : 'dark'}
        position="top-right"
        richColors
      />
      <div className={`h-screen flex transition-colors duration-700 ${
        isLightTheme 
          ? 'bg-white' 
          : 'bg-slate-950'
      }`}>
        {/* Left Sidebar - Chat History */}
        <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} transition-all duration-500 ease-in-out border-r overflow-hidden relative z-30 ${
          isLightTheme 
            ? 'border-slate-200 bg-white' 
            : 'border-slate-700/50 bg-slate-950'
        }`}>
          <div className={`w-72 h-full flex flex-col transition-all duration-500 ease-in-out ${
            isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            {isSidebarOpen && (
              <>
                {/* Sidebar Header */}
                <div className={`flex-shrink-0 p-4 border-b ${
                  isLightTheme ? 'border-slate-200' : 'border-slate-700/50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💎</span>
                      <span className={`${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>
                        ImpulsyIA
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarOpen(false)}
                      className={`h-8 w-8 ${
                        isLightTheme 
                          ? 'text-slate-700 hover:bg-slate-100' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        currentChatId === chat.id
                          ? isLightTheme
                            ? 'bg-slate-100 shadow-sm'
                            : 'bg-slate-800 shadow-md'
                          : isLightTheme
                            ? 'hover:bg-slate-50 hover:shadow-sm'
                            : 'hover:bg-slate-900 hover:shadow-md'
                      }`}
                      onClick={() => {
                        setCurrentChatId(chat.id);
                        setJourneyStarted(true);
                        setIsSidebarOpen(false);
                      }}
                    >
                      {editingChatId === chat.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingChatName}
                            onChange={(e) => setEditingChatName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleSaveEditChat(chat.id);
                            }}
                            className={`h-8 text-sm ${
                              isLightTheme ? 'bg-white' : 'bg-slate-900'
                            }`}
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveEditChat(chat.id);
                            }}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className={`truncate ${
                                isLightTheme ? 'text-slate-900' : 'text-slate-100'
                              }`}>
                                {chat.name}
                              </div>
                              <div className={`text-xs mt-1 ${
                                isLightTheme ? 'text-slate-500' : 'text-slate-500'
                              }`}>
                                {chat.date}
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditChat(chat.id);
                                }}
                                className={`p-1 rounded transition-colors ${
                                  isLightTheme
                                    ? 'hover:bg-slate-200 text-slate-600'
                                    : 'hover:bg-slate-700 text-slate-400'
                                }`}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(chat.id);
                                }}
                                className={`p-1 rounded transition-colors ${
                                  isLightTheme
                                    ? 'hover:bg-red-100 text-red-600'
                                    : 'hover:bg-red-900/30 text-red-400'
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sidebar Footer - Subscription Link - Fixed at bottom */}
                <div className={`flex-shrink-0 border-t p-3 mt-auto ${
                  isLightTheme ? 'border-slate-200 bg-white' : 'border-slate-700/50 bg-slate-950'
                }`}>
                  <Button
                    onClick={() => {
                      setShowSubscription(true);
                      setShowProfile(false);
                      setJourneyStarted(true);
                      setIsSidebarOpen(false);
                    }}
                    variant="outline"
                    className={`w-full justify-start transition-all duration-200 ${
                      isPremium
                        ? isLightTheme
                          ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 shadow-sm hover:shadow-md'
                          : 'border-blue-800 bg-gradient-to-r from-blue-950 to-indigo-950 text-blue-300 hover:from-blue-900 hover:to-indigo-900 hover:border-blue-700 shadow-md hover:shadow-lg'
                        : isLightTheme
                          ? 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md'
                          : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isPremium ? (
                      <>
                        <span className="text-base mr-2">👑</span>
                        <span className="font-medium">Premium Ativo</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span>Fazer Upgrade</span>
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header - Clean (No BG) */}
          <div className={`absolute top-0 left-0 right-0 transition-all duration-300 ${
            isSidebarOpen ? 'z-10' : 'z-20'
          }`}>
            <div className="px-4 md:px-6 py-6 md:py-8 flex items-center justify-between gap-4">
              
              {/* LEFT SECTION */}
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                {/* Menu Hamburguer */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`group relative shrink-0 h-11 w-11 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isLightTheme 
                      ? 'bg-white/90 backdrop-blur-md border border-slate-200/60 text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-lg shadow-md' 
                      : 'bg-slate-900/90 backdrop-blur-md border border-slate-800/60 text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:shadow-2xl shadow-xl hover:shadow-blue-500/10'
                  }`}
                >
                  <Menu className="w-5 h-5 transition-transform duration-200 group-hover:rotate-180" />
                </Button>
                

              </div>

              {/* RIGHT SECTION */}
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                {/* Premium Badge */}
                {isPremium && (
                  <div className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                    isLightTheme
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-blue-500/40'
                  }`}>
                    <span className="text-sm">👑</span>
                    <span className="text-sm font-medium">Premium</span>
                  </div>
                )}
                
                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`group flex items-center gap-2.5 md:gap-3 h-auto px-2.5 md:px-3 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md ${
                        isLightTheme 
                          ? 'bg-white/90 backdrop-blur-md border border-slate-200/60 hover:bg-white hover:shadow-lg hover:border-slate-300' 
                          : 'bg-slate-900/90 backdrop-blur-md border border-slate-800/60 hover:bg-slate-800 hover:shadow-2xl hover:border-slate-700 hover:shadow-blue-500/10'
                      }`}
                    >
                      <Avatar className={`w-9 h-9 md:w-10 md:h-10 ring-2 ring-offset-0 transition-all duration-300 group-hover:ring-[3px] ${
                        isPremium
                          ? isLightTheme 
                            ? 'ring-blue-300/60 group-hover:ring-blue-400/80 group-hover:shadow-lg group-hover:shadow-blue-500/20' 
                            : 'ring-blue-700/60 group-hover:ring-blue-600/80 group-hover:shadow-xl group-hover:shadow-blue-500/20'
                          : isLightTheme 
                            ? 'ring-slate-200/80 group-hover:ring-slate-300' 
                            : 'ring-slate-800/80 group-hover:ring-slate-700'
                      }`}>
                        <AvatarImage src="" />
                        <AvatarFallback className={`font-semibold transition-all duration-200 ${
                          isLightTheme ? 'bg-blue-100 text-blue-700' : 'bg-blue-900 text-blue-300'
                        }`}>
                          JS
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex md:flex-col text-left min-w-0 pr-1">
                        <div className={`text-sm font-medium truncate transition-colors duration-200 ${
                          isLightTheme ? 'text-slate-900' : 'text-slate-100'
                        }`}>
                          João Silva
                        </div>
                        {isPremium ? (
                          <div className={`text-xs flex items-center gap-1.5 mt-0.5 ${
                            isLightTheme ? 'text-blue-600' : 'text-blue-400'
                          }`}>
                            <span className="text-[10px]">👑</span>
                            <span className="font-medium">Premium</span>
                          </div>
                        ) : (
                          <div className={`text-xs mt-0.5 ${
                            isLightTheme ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            Plano Gratuito
                          </div>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    {/* User Info Header */}
                    <div className={`px-2 py-3 border-b ${
                      isLightTheme ? 'border-slate-200' : 'border-slate-700'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className={`${
                            isLightTheme ? 'bg-blue-100 text-blue-600' : 'bg-blue-900 text-blue-300'
                          }`}>
                            JS
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className={`truncate ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>
                            João Silva
                          </div>
                          <div className={`text-xs truncate ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                            joao.silva@email.com
                          </div>
                          {isPremium && (
                            <div className={`text-xs flex items-center gap-1 mt-1 ${
                              isLightTheme ? 'text-blue-600' : 'text-blue-400'
                            }`}>
                              <span>👑</span>
                              <span>Plano Premium</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation Items */}
                    <DropdownMenuItem onClick={() => {
                      setShowProfile(true);
                      setShowSubscription(false);
                      setJourneyStarted(true);
                    }}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setShowSubscription(true);
                      setShowProfile(false);
                      setJourneyStarted(true);
                    }}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Assinatura</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Settings */}
                    <DropdownMenuItem onClick={() => setIsLightTheme(!isLightTheme)}>
                      <span className="mr-2 text-base">{isLightTheme ? '🌙' : '☀️'}</span>
                      <span>{isLightTheme ? 'Tema Escuro' : 'Tema Claro'}</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Logout */}
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                      <span>Sair da Conta</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Main Content - Welcome Screen */}
          <div className={`flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-700 ${
            isLightTheme 
              ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
              : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          }`}>
            {/* Background decorative elements with CSS animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div 
                className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float-slow ${
                  isLightTheme ? 'bg-blue-400/20' : 'bg-blue-500/10'
                }`}
              />
              <div 
                className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-medium ${
                  isLightTheme ? 'bg-cyan-400/20' : 'bg-cyan-500/10'
                }`}
              />
              <div 
                className={`absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl animate-float-fast ${
                  isLightTheme ? 'bg-purple-400/15' : 'bg-purple-500/8'
                }`}
              />

              {/* Static grid lines */}
              <svg className={`absolute inset-0 w-full h-full ${isLightTheme ? 'opacity-5' : 'opacity-10'}`}>
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path
                      d="M 50 0 L 0 0 0 50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className={isLightTheme ? 'text-blue-600' : 'text-blue-400'}
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-3xl w-full space-y-12">
              {/* Logo/Icon */}
              <div className="flex justify-center">
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full transition-all duration-300 group-hover:bg-blue-500/40 group-hover:blur-3xl"></div>
                  <div className="text-8xl relative z-10 transition-transform duration-300 group-hover:scale-110 animate-bounce-subtle">💎</div>
                </div>
              </div>

              {/* Title section */}
              <div className="text-center space-y-6">
                <h1 className={`text-6xl md:text-7xl bg-gradient-to-r tracking-tight bg-clip-text text-transparent ${
                  isLightTheme 
                    ? 'from-blue-600 via-cyan-600 to-blue-600' 
                    : 'from-blue-300 via-cyan-300 to-blue-300'
                }`}>
                  ImpulsyIA
                </h1>
                <p className={`text-xl max-w-xl mx-auto ${
                  isLightTheme ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  Transforme sua forma de aprender através de uma jornada personalizada com 7 agentes especializados de IA
                </p>
              </div>

              {/* Features list */}
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`px-5 py-2.5 backdrop-blur-sm rounded-full transition-all duration-200 cursor-default hover:scale-105 hover:shadow-lg ${
                      isLightTheme 
                        ? 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300' 
                        : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isLightTheme ? 'bg-blue-600' : 'bg-blue-400'
                      }`} />
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Message Input - Main CTA */}
              <div className="flex justify-center pt-4">
                <div className={`w-full max-w-2xl rounded-2xl p-1.5 transition-all duration-200 ${
                  isLightTheme 
                    ? 'bg-white border border-slate-200 shadow-lg' 
                    : 'bg-slate-800/80 border border-slate-700/50 shadow-xl'
                }`}>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && message.trim()) {
                          setJourneyStarted(true);
                          handleSendMessage();
                        }
                      }}
                      placeholder="Como posso te ajudar hoje?"
                      className={`flex-1 border-0 py-6 px-6 focus-visible:ring-0 bg-transparent ${
                        isLightTheme 
                          ? 'placeholder:text-slate-400 text-slate-900' 
                          : 'placeholder:text-slate-400 text-slate-50'
                      }`}
                    />
                    <Button 
                      onClick={() => {
                        if (message.trim()) {
                          setJourneyStarted(true);
                          handleSendMessage();
                        }
                      }}
                      disabled={!message.trim()}
                      size="icon"
                      className={`h-12 w-12 rounded-xl transition-all duration-200 mr-1.5 ${
                        message.trim() 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20' 
                          : isLightTheme 
                            ? 'bg-slate-100 text-slate-400' 
                            : 'bg-slate-700/50 text-slate-500'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
