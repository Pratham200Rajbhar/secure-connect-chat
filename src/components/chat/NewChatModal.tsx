import { useState } from 'react';
import { Search, Users as UsersIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { users } from '@/data/mockData';
import ChatAvatar from './Avatar';

interface NewChatModalProps {
  open: boolean;
  onClose: () => void;
  onStartChat: (userId: string) => void;
  onCreateGroup: () => void;
}

export default function NewChatModal({ open, onClose, onStartChat, onCreateGroup }: NewChatModalProps) {
  const [search, setSearch] = useState('');
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or username" className="pl-9" autoFocus />
        </div>
        <button onClick={onCreateGroup} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-accent transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
            <UsersIcon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Create New Group</span>
        </button>
        <div className="mt-2 max-h-[300px] overflow-y-auto chat-scrollbar space-y-0.5">
          <p className="text-xs text-muted-foreground px-3 py-1.5">Contacts</p>
          {filtered.map((u) => (
            <button key={u.id} onClick={() => { onStartChat(u.id); onClose(); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-accent transition-colors">
              <ChatAvatar user={u} size="sm" showStatus />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{u.name}</p>
                <p className="text-xs text-muted-foreground">@{u.username}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
