export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
  bio?: string;
  verified?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file' | 'system';
  replyTo?: string;
  reactions?: { emoji: string; count: number }[];
  deleted?: boolean;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participants: User[];
  name?: string;
  lastMessage?: { text: string; timestamp: Date; senderId: string };
  unreadCount: number;
  pinned: boolean;
  muted: boolean;
  encrypted: boolean;
  typing?: string[];
}

const avatarColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getAvatarColor(id: string): string {
  const idx = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % avatarColors.length;
  return avatarColors[idx];
}

export const currentUser: User = {
  id: 'current',
  name: 'Alex Morgan',
  username: 'alexm',
  avatar: '',
  online: true,
  bio: 'Privacy advocate. Building secure communication for everyone.',
  verified: true,
};

export const users: User[] = [
  { id: '1', name: 'Sarah Chen', username: 'sarahc', avatar: '', online: true, bio: 'Full-stack developer & coffee enthusiast', verified: true },
  { id: '2', name: 'Marcus Johnson', username: 'marcusj', avatar: '', online: false, lastSeen: '2h ago', bio: 'UI/UX Designer at Figma', verified: true },
  { id: '3', name: 'Elena Rodriguez', username: 'elenar', avatar: '', online: true, bio: 'Security researcher', verified: true },
  { id: '4', name: 'James Wright', username: 'jwright', avatar: '', online: false, lastSeen: '1d ago', bio: 'Backend engineer', verified: false },
  { id: '5', name: 'Aisha Patel', username: 'aishap', avatar: '', online: true, bio: 'Product Manager', verified: true },
  { id: '6', name: 'David Kim', username: 'davidk', avatar: '', online: false, lastSeen: '5m ago', bio: 'DevOps & Cloud', verified: false },
  { id: '7', name: 'Lisa Thompson', username: 'lisat', avatar: '', online: false, lastSeen: '3h ago', bio: 'Data scientist', verified: true },
];

export const conversations: Conversation[] = [
  {
    id: 'c1', type: 'direct', participants: [users[0]],
    lastMessage: { text: 'The new encryption protocol looks solid! 🔒', timestamp: new Date(Date.now() - 120000), senderId: '1' },
    unreadCount: 3, pinned: true, muted: false, encrypted: true, typing: ['1'],
  },
  {
    id: 'c2', type: 'group', participants: [users[1], users[2], users[4]],
    name: 'Project Phoenix',
    lastMessage: { text: 'Pushed the latest changes to staging', timestamp: new Date(Date.now() - 3600000), senderId: '2' },
    unreadCount: 0, pinned: true, muted: false, encrypted: true,
  },
  {
    id: 'c3', type: 'direct', participants: [users[2]],
    lastMessage: { text: 'Can you review my PR when you get a chance?', timestamp: new Date(Date.now() - 7200000), senderId: 'current' },
    unreadCount: 0, pinned: false, muted: false, encrypted: true,
  },
  {
    id: 'c4', type: 'direct', participants: [users[3]],
    lastMessage: { text: 'Meeting rescheduled to 3 PM', timestamp: new Date(Date.now() - 86400000), senderId: '4' },
    unreadCount: 1, pinned: false, muted: false, encrypted: true,
  },
  {
    id: 'c5', type: 'group', participants: [users[0], users[1], users[2], users[3], users[4], users[5]],
    name: 'Engineering Team',
    lastMessage: { text: 'Sprint retro at 4 PM today', timestamp: new Date(Date.now() - 43200000), senderId: '5' },
    unreadCount: 12, pinned: false, muted: true, encrypted: true,
  },
  {
    id: 'c6', type: 'direct', participants: [users[5]],
    lastMessage: { text: 'The deployment pipeline is green ✅', timestamp: new Date(Date.now() - 300000), senderId: '6' },
    unreadCount: 1, pinned: false, muted: false, encrypted: true,
  },
  {
    id: 'c7', type: 'direct', participants: [users[6]],
    lastMessage: { text: 'Here are the analysis results you asked for', timestamp: new Date(Date.now() - 172800000), senderId: '7' },
    unreadCount: 0, pinned: false, muted: false, encrypted: true,
  },
];

const now = Date.now();

export const messages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', conversationId: 'c1', senderId: 'current', text: 'Hey Sarah! How\'s the encryption module coming along?', timestamp: new Date(now - 3600000), status: 'read', type: 'text' },
    { id: 'm2', conversationId: 'c1', senderId: '1', text: 'Making great progress! Just finished implementing the key exchange protocol.', timestamp: new Date(now - 3500000), status: 'read', type: 'text' },
    { id: 'm3', conversationId: 'c1', senderId: 'current', text: 'That\'s awesome. Did you use X25519 for the key agreement?', timestamp: new Date(now - 3400000), status: 'read', type: 'text' },
    { id: 'm4', conversationId: 'c1', senderId: '1', text: 'Yes! X25519 with AES-256-GCM for the symmetric cipher. It\'s blazing fast.', timestamp: new Date(now - 3300000), status: 'read', type: 'text', reactions: [{ emoji: '🔥', count: 2 }, { emoji: '👍', count: 1 }] },
    { id: 'm5', conversationId: 'c1', senderId: 'current', text: 'Perfect choice. Have you run the benchmark tests?', timestamp: new Date(now - 600000), status: 'read', type: 'text' },
    { id: 'm6', conversationId: 'c1', senderId: '1', text: 'Running them now. Initial results show < 5ms per message encryption on mobile.', timestamp: new Date(now - 500000), status: 'read', type: 'text' },
    { id: 'm7', conversationId: 'c1', senderId: '1', text: 'The new encryption protocol looks solid! 🔒', timestamp: new Date(now - 120000), status: 'read', type: 'text' },
  ],
  c2: [
    { id: 'm8', conversationId: 'c2', senderId: '2', text: 'Team, the design mockups are ready for review', timestamp: new Date(now - 7200000), status: 'read', type: 'text' },
    { id: 'm9', conversationId: 'c2', senderId: '3', text: 'Looking good! I have some security feedback on the auth flow.', timestamp: new Date(now - 7000000), status: 'read', type: 'text' },
    { id: 'm10', conversationId: 'c2', senderId: 'current', text: 'Let\'s discuss in our standup tomorrow', timestamp: new Date(now - 6800000), status: 'read', type: 'text' },
    { id: 'm11', conversationId: 'c2', senderId: '2', text: 'Pushed the latest changes to staging', timestamp: new Date(now - 3600000), status: 'read', type: 'text' },
  ],
  c3: [
    { id: 'm12', conversationId: 'c3', senderId: '3', text: 'Found a potential vulnerability in the session handler', timestamp: new Date(now - 14400000), status: 'read', type: 'text' },
    { id: 'm13', conversationId: 'c3', senderId: 'current', text: 'Oh no, what kind?', timestamp: new Date(now - 14300000), status: 'read', type: 'text' },
    { id: 'm14', conversationId: 'c3', senderId: '3', text: 'Token refresh race condition. Already have a fix ready.', timestamp: new Date(now - 14200000), status: 'read', type: 'text', reactions: [{ emoji: '👏', count: 1 }] },
    { id: 'm15', conversationId: 'c3', senderId: 'current', text: 'Can you review my PR when you get a chance?', timestamp: new Date(now - 7200000), status: 'delivered', type: 'text' },
  ],
  c4: [
    { id: 'm16', conversationId: 'c4', senderId: '4', text: 'Meeting rescheduled to 3 PM', timestamp: new Date(now - 86400000), status: 'read', type: 'text' },
  ],
  c5: [
    { id: 'm17', conversationId: 'c5', senderId: '5', text: 'Sprint retro at 4 PM today', timestamp: new Date(now - 43200000), status: 'read', type: 'text' },
  ],
  c6: [
    { id: 'm18', conversationId: 'c6', senderId: '6', text: 'Hey, just deployed v2.4.1 to production', timestamp: new Date(now - 600000), status: 'read', type: 'text' },
    { id: 'm19', conversationId: 'c6', senderId: 'current', text: 'Any issues?', timestamp: new Date(now - 500000), status: 'read', type: 'text' },
    { id: 'm20', conversationId: 'c6', senderId: '6', text: 'The deployment pipeline is green ✅', timestamp: new Date(now - 300000), status: 'read', type: 'text' },
  ],
  c7: [
    { id: 'm21', conversationId: 'c7', senderId: '7', text: 'Here are the analysis results you asked for', timestamp: new Date(now - 172800000), status: 'read', type: 'text' },
  ],
};

export function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function getDateDivider(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
