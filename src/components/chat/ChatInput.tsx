import { useState, useRef, useEffect } from 'react';
import { Paperclip, Smile, Send, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-end gap-2">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent flex-shrink-0 mb-0.5">
          <Paperclip className="w-5 h-5" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent flex-shrink-0 mb-0.5">
          <Smile className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full resize-none bg-secondary rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
          />
        </div>

        <button
          onClick={text.trim() ? handleSend : undefined}
          className={cn(
            'p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 mb-0.5',
            text.trim()
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 scale-100'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
        >
          {text.trim() ? <Send className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
