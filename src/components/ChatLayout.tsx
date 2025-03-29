import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChannelHeader from "./ChannelHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import MessageSummary from "./MessageSummary";
import { Channel, Message, Attachment } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { showMessageNotification } from "@/utils/notificationUtils";
import { MessageForSummary } from "@/utils/summaryUtils";

interface ChatLayoutProps {
  sections: any[];
  activeChannel: Channel;
  messages: Message[];
  workspaceName: string;
  workspaceLogo: string;
  setActiveChannel: (channel: Channel) => void;
}

export default function ChatLayout({
  sections,
  activeChannel,
  messages: initialMessages,
  workspaceName,
  workspaceLogo,
  setActiveChannel,
}: ChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { user } = useAuth();
  const topic = "Track and coordinate social media";

  // Convert messages to the format required for summarization
  const messagesForSummary: MessageForSummary[] = messages.map(msg => ({
    senderName: msg.user.name,
    content: msg.content,
    timestamp: msg.timestamp
  }));

  // Fetch messages from Supabase when active channel changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChannel) return;
      
      try {
        // Fetch messages for the active channel
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', activeChannel.id)
          .order('timestamp', { ascending: true });
          
        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          return;
        }
        
        // Collect all unique user IDs from messages
        const userIds = [...new Set(messagesData.map(msg => msg.user_id))];
        
        // Fetch all relevant user profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);
          
        if (profilesError) {
          console.error('Error fetching user profiles:', profilesError);
        }
        
        // Create a lookup map for quick access to user profiles
        const userProfiles = profilesData?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {}) || {};
        
        if (messagesData) {
          // Convert Supabase data to Message format, matching each message with its sender's profile
          const formattedMessages: Message[] = messagesData.map(msg => {
            const userProfile = userProfiles[msg.user_id] || {};
            
            return {
              id: msg.id,
              content: msg.content,
              timestamp: new Date(msg.timestamp).toISOString(),
              user: {
                id: msg.user_id,
                name: userProfile.username || 'Unknown User',
                avatar: `https://i.pravatar.cc/150?u=${msg.user_id}`,
                email: userProfile.username,
              },
              isEvent: msg.is_event || false,
              eventDetails: msg.event_details && typeof msg.event_details === 'object' ? {
                type: (msg.event_details as any).type || 'generic',
                details: (msg.event_details as any).details || '',
                time: (msg.event_details as any).time || undefined
              } : undefined,
              attachments: msg.attachments ? 
                Array.isArray(msg.attachments) ? 
                  msg.attachments.map((att: any) => ({
                    id: att.id || `att-${Date.now()}`,
                    type: att.type || 'file',
                    name: att.name || 'File',
                    url: att.url || '#',
                    previewUrl: att.previewUrl || 'No preview'
                  })) : [] 
                : [],
            };
          });
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error in fetching messages:', error);
      }
    };

    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `channel_id=eq.${activeChannel.id}`
        }, 
        async (payload) => {
          const newMessage = payload.new;
          
          // Fetch the user profile for this message
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newMessage.user_id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error('Error fetching user profile:', profileError);
          }
          
          // Add new message to state
          setMessages(prevMessages => [
            ...prevMessages,
            {
              id: newMessage.id,
              content: newMessage.content,
              timestamp: new Date(newMessage.timestamp).toISOString(),
              user: {
                id: newMessage.user_id,
                name: userProfile?.username || 'Unknown User',
                avatar: `https://i.pravatar.cc/150?u=${newMessage.user_id}`,
                email: userProfile?.username,
              },
              isEvent: newMessage.is_event || false,
              eventDetails: newMessage.event_details && typeof newMessage.event_details === 'object' ? {
                type: (newMessage.event_details as any).type || 'generic',
                details: (newMessage.event_details as any).details || '',
                time: (newMessage.event_details as any).time || undefined
              } : undefined,
              attachments: newMessage.attachments ? 
                Array.isArray(newMessage.attachments) ? 
                  newMessage.attachments.map((att: any) => ({
                    id: att.id || `att-${Date.now()}`,
                    type: att.type || 'file',
                    name: att.name || 'File',
                    url: att.url || '#',
                    previewUrl: att.previewUrl || 'No preview'
                  })) : [] 
                : [],
            }
          ]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannel, user]);

  // Subscribe to notifications for all channels except the active one
  useEffect(() => {
    if (!user) return;
    
    // Get all channel IDs except the active one
    const allChannelIds = sections.flatMap(section => 
      section.items.map((item: Channel) => item.id)
    ).filter(id => id !== activeChannel.id);
    
    if (allChannelIds.length === 0) return;
    
    // Create subscriptions for all other channels
    const channels = allChannelIds.map(channelId => {
      return supabase
        .channel(`public:messages:channel:${channelId}`)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `channel_id=eq.${channelId}`
          }, 
          (payload) => {
            const newMessage = payload.new;
            
            // Skip notifications for messages sent by the current user
            if (newMessage.user_id === user.id) return;
            
            // Find channel name
            const channelInfo = sections.flatMap(section => section.items)
              .find((item: Channel) => item.id === channelId);
            
            if (!channelInfo) return;
            
            // Show notification
            showMessageNotification({
              channelName: channelInfo.name,
              senderName: 'New message', // Will be replaced with actual name when available
              messageContent: newMessage.content,
              onClick: () => setActiveChannel(channelInfo)
            });
          }
        )
        .subscribe();
    });
    
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [sections, activeChannel.id, user, setActiveChannel]);

  const handleSendMessage = async (messageText: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to send messages.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Save message to Supabase
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          channel_id: activeChannel.id,
          content: messageText,
        });
        
      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Show a success toast to the sender
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
        duration: 2000,
      });
      
      // Broadcast to channel members (this will be picked up by all subscribers to this channel)
      // The notification will be shown to all members except the sender
      // The sender has already received a "Message sent" notification
      const broadcastChannel = supabase.channel(`broadcast:${activeChannel.id}`);
      broadcastChannel.send({
        type: 'broadcast',
        event: 'message',
        payload: {
          sender_id: user.id,
          sender_name: user?.user_metadata?.name || 'User',
          channel_id: activeChannel.id,
          channel_name: activeChannel.name,
          message: messageText
        }
      });
      
    } catch (error) {
      console.error('Error in sending message:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex h-screen">
      <Sidebar
        sections={sections}
        activeChannel={activeChannel}
        workspaceName={workspaceName}
        workspaceLogo={workspaceLogo}
        onChannelSelect={setActiveChannel}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <ChannelHeader
            channel={activeChannel}
            topic={topic}
            participantCount={58}
          />
          <div className="mr-4 flex items-center">
            <MessageSummary 
              messages={messagesForSummary} 
              channelName={activeChannel.name}
              channelId={activeChannel.id}
              unreadCount={activeChannel.unreadCount}
            />
          </div>
        </div>
        <MessageList messages={messages} channelName={activeChannel.name} />
        <MessageInput 
          channelName={activeChannel.name} 
          onSendMessage={handleSendMessage} 
        />
      </div>
    </div>
  );
}
