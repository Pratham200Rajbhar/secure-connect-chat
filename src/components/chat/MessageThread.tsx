import { useRef, useEffect } from 'react';
import { ArrowLeft, Lock, Phone, Video, Search, MoreVertical, Check, CheckCheck, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Message, type Conversation, currentUser, formatMessageTime, getDateDivider } from '@/data/mockData';
import ChatAvatar from './Avatar';
import ChatInput from './ChatInput';

interface MessageThreadProps {
  conversation: Conversation;
  messages: Message[];
  onBack: () => void;
  onOpenProfile: () => void;
  onSend: (text: string) => void;
  className?: string;
}

export default function MessageThread({ conversation, messages, onBack, onOpenProfile, onSend, className }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const participant = conversation.participants[0];
  const name = conversation.name || participant?.name || 'Unknown';
  const isTyping = conversation.typing && conversation.typing.length > 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <button onClick={onBack} className="lg:hidden p-1 -ml-1 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button onClick={onOpenProfile} className="flex items-center gap-3 flex-1 min-w-0">
          {conversation.type === 'group' ? (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold flex-shrink-0">
              {name.slice(0, 2).toUpperCase()}
            </div>
          ) : (
            <ChatAvatar user={participant} showStatus />
          )}
          <div className="min-w-0">
            <h2 className="font-semibold text-sm truncate">{name}</h2>
            <div className="flex items-center gap-1.5">
              {isTyping ? (
                <span className="text-xs text-success">typing...</span>
              ) : participant?.online ? (
                <span className="text-xs text-success">online</span>
              ) : participant?.lastSeen ? (
                <span className="text-xs text-muted-foreground">last seen {participant.lastSeen}</span>
              ) : (
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-success" />
                  <span className="text-xs text-muted-foreground">end-to-end encrypted</span>
                </div>
              )}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1">
          {[Phone, Video, Search, MoreVertical].map((Icon, i) => (
            <button key={i} className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </header>

      {/* Encryption Banner */}
      <div className="flex items-center justify-center gap-2 py-2 text-[11px] text-muted-foreground bg-card/30">
        <Shield className="w-3 h-3 text-success" />
        <span>Messages are end-to-end encrypted. No one outside of this chat can read them.</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scrollbar px-4 py-4 space-y-1">
        {messages.map((msg, i) => {
          const prevMsg = messages[i - 1];
          const showDate =
            !prevMsg || getDateDivider(msg.timestamp) !== getDateDivider(prevMsg.timestamp);
          const isOwn = msg.senderId === currentUser.id;
          const showAvatar = !isOwn && (!messages[i + 1] || messages[i + 1].senderId !== msg.senderId);

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex items-center justify-center py-3">
                  <span className="text-[11px] text-muted-foreground bg-card px-3 py-1 rounded-full font-medium">
                    {getDateDivider(msg.timestamp)}
                  </span>
                </div>
              )}
              <div className={cn('flex gap-2 animate-slide-up', isOwn ? 'justify-end' : 'justify-start')}>
                {!isOwn && (
                  <div className="w-6 flex-shrink-0">
                    {showAvatar && conversation.type === 'group' && (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground mt-1">
                        {(conversation.participants.find(p => p.id === msg.senderId)?.name || '?')[0]}
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[70%] px-3 py-2 rounded-2xl relative group',
                    isOwn
                      ? 'bg-chat-sent text-chat-sent-foreground rounded-br-md'
                      : 'bg-chat-received text-chat-received-foreground rounded-bl-md'
                  )}
                >
                  {msg.deleted ? (
                    <p className="text-sm italic opacity-60">This message was deleted</p>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                  )}
                  <div className={cn('flex items-center gap-1 mt-0.5', isOwn ? 'justify-end' : 'justify-start')}>
                    <span className={cn('text-[10px]', isOwn ? 'text-chat-sent-foreground/60' : 'text-muted-foreground')}>
                      {formatMessageTime(msg.timestamp)}
                    </span>
                    {isOwn && (
                      msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-chat-sent-foreground/80" />
                      ) : msg.status === 'delivered' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-chat-sent-foreground/40" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-chat-sent-foreground/40" />
                      )
                    )}
                  </div>
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1 -mb-1">
                      {msg.reactions.map((r, ri) => (
                        <span key={ri} className="text-xs bg-background/20 rounded-full px-1.5 py-0.5">
                          {r.emoji} {r.count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-6" />
            <div className="bg-chat-received text-chat-received-foreground px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={onSend} />
    </div>
  );
}
