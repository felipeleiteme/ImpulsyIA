import { Plus, X, Edit2, Trash2, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Chat {
  id: number;
  name: string;
  date: string;
}

interface SidebarProps {
  isOpen: boolean;
  isLightTheme: boolean;
  isPremium: boolean;
  chats: Chat[];
  currentChatId: number;
  editingChatId: number | null;
  editingChatName: string;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: number) => void;
  onEditChat: (chatId: number) => void;
  onSaveEditChat: (chatId: number) => void;
  onDeleteChat: (chatId: number) => void;
  onEditNameChange: (name: string) => void;
  onNavigateHome: () => void;
  onOpenSubscription: () => void;
}

export function Sidebar({
  isOpen,
  isLightTheme,
  isPremium,
  chats,
  currentChatId,
  editingChatId,
  editingChatName,
  onClose,
  onNewChat,
  onSelectChat,
  onEditChat,
  onSaveEditChat,
  onDeleteChat,
  onEditNameChange,
  onNavigateHome,
  onOpenSubscription,
}: SidebarProps) {
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
      <div className={`flex-shrink-0 p-4 border-b ${
        isLightTheme ? 'border-slate-200' : 'border-slate-700/50'
      }`}>
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
        <div className="space-y-2">
          <Button 
            onClick={onNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Conversa
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
            onClick={() => onSelectChat(chat.id)}
          >
            {editingChatId === chat.id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editingChatName}
                  onChange={(e) => onEditNameChange(e.target.value)}
                  onKeyPress={(e) => {
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
              </>
            )}
          </div>
        ))}
      </div>

      {/* Sidebar Footer - Subscription Link - Fixed at bottom */}
      <div className={`flex-shrink-0 border-t p-3 ${
        isLightTheme ? 'border-slate-200 bg-white' : 'border-slate-700/50 bg-slate-950'
      }`}>
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
