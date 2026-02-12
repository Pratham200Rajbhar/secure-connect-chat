import { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { users, type User } from '@/data/mockData';
import ChatAvatar from './Avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  const toggle = (user: User) => {
    setSelected((prev) => prev.find((s) => s.id === user.id) ? prev.filter((s) => s.id !== user.id) : prev.length < 32 ? [...prev, user] : prev);
  };

  const handleCreate = () => {
    // mock create
    onClose();
    setStep(1);
    setSelected([]);
    setGroupName('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setStep(1); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{step === 1 ? 'Add Members' : 'Group Info'}</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <>
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selected.map((u) => (
                  <Badge key={u.id} variant="secondary" className="gap-1 pr-1">
                    {u.name}
                    <button onClick={() => toggle(u)}><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts" className="mb-2" />
            <p className="text-xs text-muted-foreground px-1 mb-1">{selected.length}/32 members</p>
            <div className="max-h-[250px] overflow-y-auto chat-scrollbar space-y-0.5">
              {filtered.map((u) => {
                const isSelected = selected.some((s) => s.id === u.id);
                return (
                  <button key={u.id} onClick={() => toggle(u)} className={cn('flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors', isSelected ? 'bg-primary/10' : 'hover:bg-accent')}>
                    <ChatAvatar user={u} size="sm" />
                    <span className="text-sm text-foreground">{u.name}</span>
                    {isSelected && <span className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
            <Button onClick={() => setStep(2)} disabled={selected.length < 1} className="w-full mt-3">
              Next ({selected.length} selected)
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Group Name *</Label>
              <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Enter group name" autoFocus />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
            </div>
            <p className="text-xs text-muted-foreground">{selected.length} members selected</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={handleCreate} disabled={!groupName.trim()} className="flex-1">Create Group</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
