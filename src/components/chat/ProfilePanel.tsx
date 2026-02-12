import { X, Phone, Video, MessageSquare, Lock, Shield, ShieldCheck, Bell, BellOff, ImageIcon, FileText, Link2, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Conversation, type User, currentUser } from '@/data/mockData';
import ChatAvatar from './Avatar';
import { Button } from '@/components/ui/button';

interface ProfilePanelProps {
  conversation: Conversation;
  onClose: () => void;
  className?: string;
}

export default function ProfilePanel({ conversation, onClose, className }: ProfilePanelProps) {
  const isGroup = conversation.type === 'group';
  const participant = conversation.participants[0];
  const name = conversation.name || participant?.name || 'Unknown';

  return (
    <div className={cn('flex flex-col h-full bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm">{isGroup ? 'Group Info' : 'Contact Info'}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-6 px-4">
          {isGroup ? (
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold mb-3">
              {name.slice(0, 2).toUpperCase()}
            </div>
          ) : (
            <ChatAvatar user={participant} size="xl" showStatus />
          )}
          <h2 className="font-bold text-lg mt-3">{name}</h2>
          {!isGroup && (
            <>
              <p className="text-sm text-muted-foreground">@{participant?.username}</p>
              <div className="flex items-center gap-1.5 mt-1">
                {participant?.online ? (
                  <span className="text-xs text-success font-medium">Online</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Last seen {participant?.lastSeen}</span>
                )}
              </div>
            </>
          )}
          {isGroup && (
            <p className="text-sm text-muted-foreground">{conversation.participants.length} members</p>
          )}
        </div>

        {/* Bio */}
        {!isGroup && participant?.bio && (
          <div className="px-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">About</p>
            <p className="text-sm">{participant.bio}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pb-4">
          {[
            { icon: MessageSquare, label: 'Message' },
            { icon: Phone, label: 'Audio' },
            { icon: Video, label: 'Video' },
          ].map((action) => (
            <button key={action.label} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-[11px]">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Encryption Info */}
        <div className="mx-4 p-3 rounded-xl bg-success/10 border border-success/20 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Encrypted</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Messages are end-to-end encrypted. No one outside of this chat, not even SecureChat, can read or listen to them.
          </p>
        </div>

        {/* Verify */}
        {!isGroup && participant?.verified && (
          <div className="mx-4 mb-4">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-accent hover:bg-accent/80 transition-colors">
              <Shield className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">Verify Safety Number</p>
                <p className="text-xs text-muted-foreground">Confirm encryption identity</p>
              </div>
            </button>
          </div>
        )}

        {/* Media Tabs */}
        <div className="px-4 mb-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Shared</p>
          <div className="flex gap-1 mb-3">
            {[
              { icon: ImageIcon, label: 'Media', count: 24 },
              { icon: FileText, label: 'Files', count: 8 },
              { icon: Link2, label: 'Links', count: 15 },
            ].map((tab) => (
              <button key={tab.label} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-secondary text-xs font-medium hover:bg-accent transition-colors">
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className="text-muted-foreground">{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-secondary/60" />
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="px-4 mb-4 space-y-1">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors">
            <BellOff className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Mute Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Disappearing Messages</span>
          </button>
        </div>

        {/* Group Members */}
        {isGroup && (
          <div className="px-4 mb-4">
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
              Members · {conversation.participants.length}
            </p>
            <div className="space-y-1">
              {conversation.participants.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors">
                  <ChatAvatar user={member} size="sm" showStatus />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">@{member.username}</p>
                  </div>
                  {member.id === conversation.participants[0]?.id && (
                    <span className="text-[10px] font-semibold uppercase text-primary bg-primary/15 px-2 py-0.5 rounded-full">Admin</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="px-4 pb-6">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <Ban className="w-4 h-4 mr-2" />
            {isGroup ? 'Leave Group' : 'Block User'}
          </Button>
        </div>
      </div>
    </div>
  );
}
