import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { conversations as initialConversations, messages as initialMessages, currentUser, type Message } from '@/data/mockData';
import Sidebar from '@/components/chat/Sidebar';
import ConversationList from '@/components/chat/ConversationList';
import MessageThread from '@/components/chat/MessageThread';
import ProfilePanel from '@/components/chat/ProfilePanel';

const ChatApp = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedId, setSelectedId] = useState<string | null>('c1');
  const [showProfile, setShowProfile] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [msgs, setMsgs] = useState(initialMessages);

  const selectedConversation = initialConversations.find((c) => c.id === selectedId);

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedId(id);
    setMobileView('chat');
    setShowProfile(false);
  }, []);

  const handleBack = useCallback(() => {
    setMobileView('list');
  }, []);

  const handleSend = useCallback((text: string) => {
    if (!selectedId) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      conversationId: selectedId,
      senderId: currentUser.id,
      text,
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
    };
    setMsgs((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }));
    // Simulate delivery
    setTimeout(() => {
      setMsgs((prev) => ({
        ...prev,
        [selectedId]: prev[selectedId]?.map((m) =>
          m.id === newMsg.id ? { ...m, status: 'delivered' as const } : m
        ) || [],
      }));
    }, 800);
    // Simulate read
    setTimeout(() => {
      setMsgs((prev) => ({
        ...prev,
        [selectedId]: prev[selectedId]?.map((m) =>
          m.id === newMsg.id ? { ...m, status: 'read' as const } : m
        ) || [],
      }));
    }, 2000);
  }, [selectedId]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar — desktop only */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} className="hidden lg:flex" />

      {/* Conversation List */}
      <div
        className={cn(
          'w-full md:w-[380px] border-r border-border flex-shrink-0',
          mobileView === 'chat' ? 'hidden md:block' : 'block'
        )}
      >
        <ConversationList
          conversations={initialConversations}
          selectedId={selectedId}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* Message Thread */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0',
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        )}
      >
        {selectedConversation ? (
          <MessageThread
            conversation={selectedConversation}
            messages={msgs[selectedId!] || []}
            onBack={handleBack}
            onOpenProfile={() => setShowProfile(!showProfile)}
            onSend={handleSend}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl gradient-brand-subtle flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <p className="font-semibold mb-1">Select a conversation</p>
              <p className="text-sm">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Panel — desktop only */}
      {showProfile && selectedConversation && (
        <div className="hidden lg:block w-[340px] border-l border-border flex-shrink-0 animate-slide-in-right">
          <ProfilePanel
            conversation={selectedConversation}
            onClose={() => setShowProfile(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatApp;
