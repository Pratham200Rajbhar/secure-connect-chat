import { useState } from 'react';
import { ArrowLeft, Search as SearchIcon, FileText, Image, Link2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { conversations, messages } from '@/data/mockData';
import ChatAvatar from '@/components/chat/Avatar';

const filters = [
  { id: 'all', label: 'All', icon: SearchIcon },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'files', label: 'Files', icon: FileText },
  { id: 'links', label: 'Links', icon: Link2 },
];

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Simple search across messages
  const results = query.length >= 2
    ? Object.entries(messages).flatMap(([convId, msgs]) =>
        msgs.filter((m) => m.text.toLowerCase().includes(query.toLowerCase())).map((m) => ({
          ...m,
          conversation: conversations.find((c) => c.id === convId),
        }))
      )
    : [];

  return (
    <div className="flex h-screen bg-background">
      <div className="w-full md:w-[460px] border-r border-border flex flex-col">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/app')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground">Search</h2>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages, media, files..."
              className="pl-9"
              autoFocus
            />
          </div>
          <div className="flex gap-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors', activeFilter === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground')}
              >
                <f.icon className="w-3 h-3" />
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto chat-scrollbar">
          {query.length < 2 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <SearchIcon className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Search across all conversations</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : (
            results.map((r) => (
              <div key={r.id} className="px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  {r.conversation && r.conversation.participants[0] && (
                    <ChatAvatar user={r.conversation.participants[0]} size="sm" />
                  )}
                  <span className="text-xs font-medium text-foreground">{r.conversation?.name || r.conversation?.participants[0]?.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{r.timestamp.toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{
                  __html: r.text.replace(
                    new RegExp(`(${query})`, 'gi'),
                    '<mark class="bg-primary/30 text-foreground rounded px-0.5">$1</mark>'
                  ),
                }} />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Click a result to jump to the message</p>
        </div>
      </div>
    </div>
  );
}
