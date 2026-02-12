import { ArrowLeft, Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { users } from '@/data/mockData';
import ChatAvatar from '@/components/chat/Avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CallEntry {
  id: string;
  user: typeof users[0];
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  duration?: string;
  timestamp: string;
}

const callHistory: CallEntry[] = [
  { id: '1', user: users[0], type: 'video', direction: 'outgoing', duration: '12:34', timestamp: '2m ago' },
  { id: '2', user: users[2], type: 'audio', direction: 'incoming', duration: '5:02', timestamp: '1h ago' },
  { id: '3', user: users[3], type: 'audio', direction: 'missed', timestamp: '3h ago' },
  { id: '4', user: users[1], type: 'video', direction: 'incoming', duration: '28:15', timestamp: 'Yesterday' },
  { id: '5', user: users[4], type: 'audio', direction: 'outgoing', duration: '1:45', timestamp: 'Yesterday' },
  { id: '6', user: users[5], type: 'audio', direction: 'missed', timestamp: 'Dec 10' },
];

const directionConfig = {
  incoming: { icon: PhoneIncoming, color: 'text-success', label: 'Incoming' },
  outgoing: { icon: PhoneOutgoing, color: 'text-muted-foreground', label: 'Outgoing' },
  missed: { icon: PhoneMissed, color: 'text-destructive', label: 'Missed call' },
};

export default function CallHistory() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background">
      <div className="w-full md:w-[420px] border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">Calls</h2>
        </div>
        <div className="flex-1 overflow-y-auto chat-scrollbar">
          {callHistory.map((call) => {
            const dir = directionConfig[call.direction];
            const DirIcon = dir.icon;
            return (
              <div key={call.id} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer">
                <ChatAvatar user={call.user} size="md" showStatus />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium', call.direction === 'missed' ? 'text-destructive' : 'text-foreground')}>{call.user.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <DirIcon className={cn('w-3.5 h-3.5', dir.color)} />
                    <span className="text-xs text-muted-foreground">{call.duration || dir.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{call.timestamp}</span>
                  {call.type === 'video' ? <Video className="w-4 h-4 text-muted-foreground" /> : <Phone className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Phone className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Select a call to view details</p>
        </div>
      </div>
    </div>
  );
}
