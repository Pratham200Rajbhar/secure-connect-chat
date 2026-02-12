import { useState } from 'react';
import { Search, Filter, Lock, Pin, VolumeX, Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Conversation, formatTime, currentUser } from '@/data/mockData';
import ChatAvatar from './Avatar';
import { Input } from '@/components/ui/input';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

export default function ConversationList({ conversations, selectedId, onSelect, className }: ConversationListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');

  const filtered = conversations.filter((c) => {
    const name = c.name || c.participants[0]?.name || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && c.unreadCount > 0) ||
      (filter === 'groups' && c.type === 'group');
    return matchesSearch && matchesFilter;
  });

  const pinned = filtered.filter((c) => c.pinned);
  const unpinned = filtered.filter((c) => !c.pinned);

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header */}
      <div className="p-4 pb-2">
        <h1 className="text-xl font-bold mb-3">Chats</h1>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="pl-9 bg-secondary border-0 h-9"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'unread', 'groups'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-full transition-colors capitalize',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {pinned.length > 0 && (
          <>
            <div className="px-4 py-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pinned</span>
            </div>
            {pinned.map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} selected={selectedId === conv.id} onSelect={onSelect} />
            ))}
          </>
        )}
        {unpinned.length > 0 && pinned.length > 0 && (
          <div className="px-4 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</span>
          </div>
        )}
        {unpinned.map((conv) => (
          <ConversationItem key={conv.id} conversation={conv} selected={selectedId === conv.id} onSelect={onSelect} />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationItem({
  conversation: conv,
  selected,
  onSelect,
}: {
  conversation: Conversation;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const participant = conv.participants[0];
  const name = conv.name || participant?.name || 'Unknown';
  const isTyping = conv.typing && conv.typing.length > 0;
  const isSentByMe = conv.lastMessage?.senderId === currentUser.id;

  return (
    <button
      onClick={() => onSelect(conv.id)}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 transition-colors text-left',
        selected ? 'bg-accent' : 'hover:bg-accent/50'
      )}
    >
      {conv.type === 'group' ? (
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
            {name.slice(0, 2).toUpperCase()}
          </div>
        </div>
      ) : (
        <ChatAvatar user={participant} showStatus />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-sm truncate">{name}</span>
            {conv.encrypted && <Lock className="w-3 h-3 text-success flex-shrink-0" />}
            {conv.pinned && <Pin className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
            {conv.muted && <VolumeX className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
          </div>
          {conv.lastMessage && (
            <span className={cn('text-[11px] flex-shrink-0', conv.unreadCount > 0 ? 'text-primary font-medium' : 'text-muted-foreground')}>
              {formatTime(conv.lastMessage.timestamp)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {isSentByMe && !isTyping && (
              <CheckCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            )}
            {isTyping ? (
              <span className="text-xs text-success italic">typing...</span>
            ) : (
              <p className="text-xs text-muted-foreground truncate">
                {conv.lastMessage?.text}
              </p>
            )}
          </div>
          {conv.unreadCount > 0 && (
            <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center flex-shrink-0">
              {conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
