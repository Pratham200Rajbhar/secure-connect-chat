import { MessageSquare, Users, Phone, Settings, LogOut, Shield, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/mockData';
import ChatAvatar from './Avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const tabs = [
  { id: 'chats', icon: MessageSquare, label: 'Chats' },
  { id: 'groups', icon: Users, label: 'Groups' },
  { id: 'calls', icon: Phone, label: 'Calls' },
];

const bottomActions = [
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'logout', icon: LogOut, label: 'Logout' },
];

export default function Sidebar({ activeTab, onTabChange, className }: SidebarProps) {
  return (
    <div className={cn('w-16 flex flex-col items-center py-4 bg-card border-r border-border', className)}>
      {/* Logo */}
      <div className="mb-6">
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      {/* User Avatar */}
      <div className="mb-6">
        <ChatAvatar user={currentUser} size="sm" showStatus />
      </div>

      {/* New Chat */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-6 hover:bg-primary/90 transition-colors">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">New Chat</TooltipContent>
      </Tooltip>

      {/* Tabs */}
      <div className="flex-1 flex flex-col gap-1">
        {tabs.map((tab) => (
          <Tooltip key={tab.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <tab.icon className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{tab.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-1">
        {bottomActions.map((action) => (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200">
                <action.icon className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{action.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
