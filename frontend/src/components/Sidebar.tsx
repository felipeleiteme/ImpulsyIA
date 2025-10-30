import { useEffect, useMemo, useState } from 'react';
import { X, Edit2, Trash2, CreditCard, Search, ChevronDown, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface Chat {
  id: string;
  name: string;
  description: string;
}

interface SidebarProps {
  isOpen: boolean;
  isLightTheme: boolean;
  isPremium: boolean;
  chats: Chat[];
  currentChatId: string | null;
  editingChatId: string | null;
  editingChatName: string;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
  onEditChat: (chatId: string) => void;
  onSaveEditChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onEditNameChange: (name: string) => void;
  onNavigateHome: () => void;
  onOpenSubscription: () => void;
}

const AGENT_ICONS: Record<string, string> = {
  mestre_mapeamento: '🗺️',
  diagnosticador_foco: '🔍',
  validador_estrategico: '✓',
  laboratorio_cientifico: '🔬',
  tutor_socratico: '💭',
  arquiteto_implementacao: '📐',
  construtor_sistemas: '⚙️',
};

export function Sidebar({
  isOpen,
  isLightTheme,
  isPremium,
  chats,
  currentChatId,
  editingChatId,
  editingChatName,
  onClose,
  onSelectChat,
  onEditChat,
  onSaveEditChat,
  onDeleteChat,
  onEditNameChange,
  onNavigateHome,
  onOpenSubscription,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAgentsOpen(false);
      setIsHistoryOpen(false);
    }
  }, [isOpen]);

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) =>
      chat.name.toLowerCase().includes(query) ||
      chat.description.toLowerCase().includes(query)
    );
  }, [chats, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 w-72 z-30 border-r flex flex-col transition-transform duration-300 ${
        isLightTheme
          ? 'border-slate-200 bg-white'
          : 'border-slate-700/50 bg-slate-950'
      }`}
    >
      {/* Sidebar Header */}
      <div
        className={`flex-shrink-0 p-4 border-b ${
          isLightTheme ? 'border-slate-200' : 'border-slate-700/50'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onNavigateHome}
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
            onClick={onClose}
            className={`h-8 w-8 ${
              isLightTheme
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Campo de Busca */}
        <div className="relative mb-3">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isLightTheme ? 'text-slate-400' : 'text-slate-500'
            }`}
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className={`pl-9 !pl-9 h-9 ${
              isLightTheme
                ? 'bg-slate-50 border-slate-200 focus-visible:ring-blue-500'
                : 'bg-slate-900 border-slate-700 focus-visible:ring-blue-500'
            }`}
          />
        </div>

      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* Agentes de IA */}
        <Collapsible open={isAgentsOpen} onOpenChange={setIsAgentsOpen}>
          <CollapsibleTrigger
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              isLightTheme
                ? 'hover:bg-slate-100 text-slate-700'
                : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Agentes de IA</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isAgentsOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 space-y-1">
            {filteredChats.length > 0 ? (
              filteredChats.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => onSelectChat(agent.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    currentChatId === agent.id
                      ? isLightTheme
                        ? 'bg-slate-100 shadow-sm'
                        : 'bg-slate-800 shadow-md'
                      : isLightTheme
                        ? 'hover:bg-slate-100 hover:shadow-sm'
                        : 'hover:bg-slate-900 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base mt-0.5">
                      {AGENT_ICONS[agent.id] ?? '🤖'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm truncate ${
                          isLightTheme ? 'text-slate-900' : 'text-slate-100'
                        }`}
                      >
                        {agent.name}
                      </div>
                      <div
                        className={`text-xs mt-0.5 truncate ${
                          isLightTheme ? 'text-slate-500' : 'text-slate-500'
                        }`}
                      >
                        {agent.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p
                className={`text-xs px-3 py-2 ${
                  isLightTheme ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Nenhum agente encontrado
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Histórico de Conversas */}
        <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <CollapsibleTrigger
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              isLightTheme
                ? 'hover:bg-slate-100 text-slate-700'
                : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Histórico de Conversas</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isHistoryOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 space-y-1">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 ${
                    currentChatId === chat.id
                      ? isLightTheme
                        ? 'bg-slate-100 shadow-sm'
                        : 'bg-slate-800 shadow-md'
                      : isLightTheme
                        ? 'hover:bg-slate-50 hover:shadow-sm'
                        : 'hover:bg-slate-900 hover:shadow-md'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  {editingChatId === chat.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingChatName}
                        onChange={(e) => onEditNameChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') onSaveEditChat(chat.id);
                        }}
                        className={`h-8 text-sm ${
                          isLightTheme ? 'bg-white' : 'bg-slate-900'
                        }`}
                        autoFocus
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveEditChat(chat.id);
                        }}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm truncate ${
                            isLightTheme ? 'text-slate-900' : 'text-slate-100'
                          }`}
                        >
                          {chat.name}
                        </div>
                        <div
                          className={`text-xs mt-0.5 truncate ${
                            isLightTheme ? 'text-slate-500' : 'text-slate-500'
                          }`}
                        >
                          {chat.description || 'Conversa pronta para começar'}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditChat(chat.id);
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
                            onDeleteChat(chat.id);
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
                  )}
                </div>
              ))
            ) : (
              <p
                className={`text-xs px-3 py-2 ${
                  isLightTheme ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {searchQuery
                  ? 'Nenhuma conversa encontrada'
                  : 'Nenhuma conversa ainda'}
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Sidebar Footer - Subscription Link */}
      <div
        className={`flex-shrink-0 border-t p-3 ${
          isLightTheme ? 'border-slate-200 bg-white' : 'border-slate-700/50 bg-slate-950'
        }`}
      >
        <Button
          onClick={onOpenSubscription}
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
    </div>
  );
}
