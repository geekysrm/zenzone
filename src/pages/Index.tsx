
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
              console.log("Received message for channel:", channel.name, payload);
              
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
      }).filter(Boolean)
    );
    
    // Clean up subscriptions when component unmounts or activeChannel changes
    return () => {
      subscriptions.forEach(subscription => {
        if (subscription) {
          console.log("Removing channel subscription");
          supabase.removeChannel(subscription);
        }
      });
    };
  }, [activeChannel.id, user]);
  
  // Listen for messages in all channels
  useEffect(() => {
    if (!user) return;
    
    console.log("Setting up message notifications for all channels");
    
    // Subscribe to all channels
    const allChannels = sections.flatMap(section => section.items);
    
    const messageSubscriptions = allChannels.map(channel => {
      // Skip the active channel (user is already viewing it)
      if (channel.id === activeChannel.id) return null;
      
      const subscription = supabase
        .channel(`messages:${channel.id}`)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `channel_id=eq.${channel.id}`
          }, 
          async (payload) => {
            console.log("Message received for notification:", channel.name, payload);
            
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
            
            const senderName = profile?.username || 'Unknown user';
            
            // Show notification with click handler that will navigate to the channel
            showMessageNotification({
              channelName: targetChannel.name,
              senderName: senderName,
              messageContent: payload.new.content,
              channelId: targetChannel.id,
              onClick: () => handleChannelSelect(targetChannel)
            });
          }
        )
        .subscribe();
        
      return subscription;
    }).filter(Boolean);
    
    // Clean up message subscriptions when component unmounts or dependencies change
    return () => {
      messageSubscriptions.forEach(subscription => {
        if (subscription) {
          console.log("Removing message subscription");
          supabase.removeChannel(subscription);
        }
      });
    };
  }, [sections, activeChannel.id, user]);
  
  // Clear unread count when changing to a channel
  const handleChannelSelect = (channel: Channel) => {
    console.log("Selecting channel:", channel.name);
    
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
