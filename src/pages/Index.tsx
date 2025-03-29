
import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/ChatLayout";
import { Channel, Message } from "@/types/chat";
import { mockCurrentChannel, mockSections } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { showMessageNotification } from "@/utils/notificationUtils";

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
  
  // Listen for messages in all channels
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to all channels
    const allChannels = sections.flatMap(section => section.items);
    
    const messageSubscriptions = allChannels.map(channel => {
      // Skip the active channel (user is already viewing it)
      if (channel.id === activeChannel.id) return null;
      
      return supabase
        .channel(`messages:${channel.id}`)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `channel_id=eq.${channel.id}`
          }, 
          async (payload) => {
            // Skip notifications for messages sent by the current user
            if (payload.new.user_id === user.id) return;
            
            // Find the channel
            const targetChannel = allChannels.find(c => c.id === channel.id);
            if (!targetChannel) return;
            
            // Get sender's profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', payload.new.user_id)
              .single();
            
            // Show notification with click handler to navigate to channel
            showMessageNotification({
              channelName: targetChannel.name,
              senderName: profile?.username || 'Unknown user',
              messageContent: payload.new.content,
              onClick: () => handleChannelSelect(targetChannel)
            });
          }
        )
        .subscribe();
      
      return messageSubscriptions;
    }).filter(Boolean);
    
    return () => {
      messageSubscriptions.forEach(subscription => {
        if (subscription) supabase.removeChannel(subscription);
      });
    };
  }, [sections, activeChannel.id, user]);
  
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
        workspaceName="Lumon Industries"
        workspaceLogo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx3YKPIKk4yoghqGtF2yqzhEPXY0co1X2Fkw&s"
        setActiveChannel={handleChannelSelect}
      />
    </div>
  );
};

export default Index;
