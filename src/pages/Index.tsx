
import { useState, useEffect } from "react";
import ChatLayout from "@/components/ChatLayout";
import { Channel, Message } from "@/types/chat";
import { mockCurrentChannel, mockSections } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeChannel, setActiveChannel] = useState<Channel>(mockCurrentChannel);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sections, setSections] = useState(mockSections);
  const { user } = useAuth();
  
  // Update sections with unread counts
  useEffect(() => {
    if (!user) return;

    // Subscribe to all channels to track unread messages
    const subscriptions = mockSections.flatMap(section => 
      section.items.map(channel => {
        if (channel.id === activeChannel.id) return null;
        
        return supabase
          .channel(`unread:${channel.id}`)
          .on('postgres_changes', 
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'messages',
              filter: `channel_id=eq.${channel.id}`
            }, 
            (payload) => {
              // Skip messages sent by the current user
              if (payload.new.user_id === user.id) return;
              
              // Update the unread count for this channel
              setSections(currentSections => 
                currentSections.map(s => ({
                  ...s,
                  items: s.items.map(item => 
                    item.id === channel.id
                      ? { ...item, unreadCount: (item.unreadCount || 0) + 1 }
                      : item
                  )
                }))
              );
            }
          )
          .subscribe();
          
        return subscriptions;
      }).filter(Boolean)
    );
    
    return () => {
      subscriptions.forEach(subscription => {
        if (subscription) supabase.removeChannel(subscription);
      });
    };
  }, [activeChannel.id, user]);
  
  // Clear unread count when changing to a channel
  const handleChannelSelect = (channel: Channel) => {
    // Clear unread count for this channel
    setSections(currentSections => 
      currentSections.map(s => ({
        ...s,
        items: s.items.map(item => 
          item.id === channel.id
            ? { ...item, unreadCount: 0 }
            : item
        )
      }))
    );
    
    setActiveChannel(channel);
  };

  return (
    <div className="h-screen overflow-hidden">
      <ChatLayout
        sections={sections}
        activeChannel={activeChannel}
        messages={messages}
        workspaceName={user?.user_metadata?.name || "Acme Inc"}
        workspaceLogo="/lovable-uploads/4184efd4-0e69-4a98-b2e4-59ef0a1dbe06.png"
        setActiveChannel={handleChannelSelect}
      />
    </div>
  );
};

export default Index;
