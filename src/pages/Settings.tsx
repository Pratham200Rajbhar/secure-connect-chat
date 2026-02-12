import { useState } from 'react';
import { ArrowLeft, User, Shield, Bell, MessageSquare, Monitor, Database, HelpCircle, Camera, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/mockData';
import ChatAvatar from '@/components/chat/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const sections = [
  { id: 'account', icon: User, label: 'Account' },
  { id: 'privacy', icon: Shield, label: 'Privacy & Security' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'chats', icon: MessageSquare, label: 'Chats' },
  { id: 'devices', icon: Monitor, label: 'Devices' },
  { id: 'storage', icon: Database, label: 'Data & Storage' },
  { id: 'help', icon: HelpCircle, label: 'Help & Legal' },
];

const mockDevices = [
  { id: 'd1', name: 'Chrome on MacBook Pro', platform: 'Web', lastActive: 'Now', current: true },
  { id: 'd2', name: 'SecureChat iOS', platform: 'Mobile', lastActive: '2h ago', current: false },
  { id: 'd3', name: 'Firefox on Windows', platform: 'Web', lastActive: '3d ago', current: false },
];

export default function Settings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [displayName, setDisplayName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [lastSeen, setLastSeen] = useState('everyone');
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [msgNotif, setMsgNotif] = useState(true);
  const [callNotif, setCallNotif] = useState(true);
  const [groupNotif, setGroupNotif] = useState(true);
  const [sound, setSound] = useState(true);
  const [enterSends, setEnterSends] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ChatAvatar user={currentUser} size="lg" />
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={currentUser.username} disabled className="opacity-60" />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell people about yourself" />
              </div>
              <Separator />
              <Button variant="outline" className="w-full justify-start gap-2">
                <Lock className="w-4 h-4" /> Change Password
              </Button>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-5">
            <SettingRow label="Last seen" description="Who can see when you were last online">
              <select value={lastSeen} onChange={(e) => setLastSeen(e.target.value)} className="bg-secondary text-foreground text-sm rounded-md px-3 py-1.5 border border-border">
                <option value="everyone">Everyone</option>
                <option value="contacts">Contacts</option>
                <option value="nobody">Nobody</option>
              </select>
            </SettingRow>
            <Separator />
            <SettingRow label="Online status" description="Show when you're active">
              <Switch checked={onlineStatus} onCheckedChange={setOnlineStatus} />
            </SettingRow>
            <Separator />
            <SettingRow label="Read receipts" description="Let others know you've read their messages">
              <Switch checked={readReceipts} onCheckedChange={setReadReceipts} />
            </SettingRow>
            <Separator />
            <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
              <Shield className="w-4 h-4" /> Blocked Users (0)
            </Button>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-5">
            <SettingRow label="Message notifications"><Switch checked={msgNotif} onCheckedChange={setMsgNotif} /></SettingRow>
            <Separator />
            <SettingRow label="Call notifications"><Switch checked={callNotif} onCheckedChange={setCallNotif} /></SettingRow>
            <Separator />
            <SettingRow label="Group notifications"><Switch checked={groupNotif} onCheckedChange={setGroupNotif} /></SettingRow>
            <Separator />
            <SettingRow label="Sound"><Switch checked={sound} onCheckedChange={setSound} /></SettingRow>
          </div>
        );
      case 'chats':
        return (
          <div className="space-y-5">
            <SettingRow label="Font size">
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((s) => (
                  <button key={s} onClick={() => setFontSize(s)} className={cn('px-3 py-1.5 text-sm rounded-md border transition-colors capitalize', fontSize === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-accent')}>
                    {s}
                  </button>
                ))}
              </div>
            </SettingRow>
            <Separator />
            <SettingRow label="Enter key sends message"><Switch checked={enterSends} onCheckedChange={setEnterSends} /></SettingRow>
            <Separator />
            <Button variant="outline" className="w-full">Archive All Chats</Button>
          </div>
        );
      case 'devices':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Devices connected to your account (max 5).</p>
            {mockDevices.map((d) => (
              <div key={d.id} className={cn('flex items-center justify-between p-3 rounded-lg border', d.current ? 'border-primary/50 bg-primary/5' : 'border-border')}>
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.name} {d.current && <span className="text-xs text-primary">(This device)</span>}</p>
                    <p className="text-xs text-muted-foreground">{d.platform} · {d.lastActive}</p>
                  </div>
                </div>
                {!d.current && <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button>}
              </div>
            ))}
          </div>
        );
      case 'storage':
        return (
          <div className="space-y-5">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm font-medium text-foreground mb-2">Storage Usage</p>
              <div className="space-y-2">
                {[{ label: 'Messages', val: '12.4 MB' }, { label: 'Media', val: '245 MB' }, { label: 'Files', val: '89 MB' }].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="text-foreground">{val}</span></div>
                ))}
              </div>
            </div>
            <Button variant="outline" className="w-full">Clear Cache</Button>
            <SettingRow label="Auto-download media">
              <select className="bg-secondary text-foreground text-sm rounded-md px-3 py-1.5 border border-border">
                <option>Always</option>
                <option>WiFi only</option>
                <option>Never</option>
              </select>
            </SettingRow>
          </div>
        );
      case 'help':
        return (
          <div className="space-y-3">
            {['FAQ / Help Center', 'Contact Support', 'Terms of Service', 'Privacy Policy'].map((item) => (
              <button key={item} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors text-sm text-foreground">
                {item} <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
            <Separator />
            <Button variant="outline" className="w-full">Export Data (GDPR)</Button>
            <Button variant="destructive" className="w-full">Delete Account</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Settings sidebar */}
      <div className="w-full md:w-[320px] border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors', activeSection === s.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}
            >
              <s.icon className="w-5 h-5" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="hidden md:flex flex-1 flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">{sections.find((s) => s.id === activeSection)?.label}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}
