
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChannelHeader from "./ChannelHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Channel, Message } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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

  // Fetch messages from Supabase when active channel changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChannel) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', activeChannel.id)
          .order('timestamp', { ascending: true });
          
        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }
        
        if (data) {
          // Convert Supabase data to Message format
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            content: msg.content,
            timestamp: new Date(msg.timestamp).toLocaleString(),
            user: {
              id: msg.user_id,
              name: user?.user_metadata?.name || 'User',
              avatar: user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random',
            },
            isEvent: msg.is_event || false,
            eventDetails: msg.event_details,
            attachments: msg.attachments
          }));
          
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
        (payload) => {
          const newMessage = payload.new;
          
          // Add new message to state
          setMessages(prevMessages => [
            ...prevMessages,
            {
              id: newMessage.id,
              content: newMessage.content,
              timestamp: new Date(newMessage.timestamp).toLocaleString(),
              user: {
                id: newMessage.user_id,
                name: user?.user_metadata?.name || 'User',
                avatar: user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=random',
              },
              isEvent: newMessage.is_event || false,
              eventDetails: newMessage.event_details,
              attachments: newMessage.attachments
            }
          ]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannel, user]);

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
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
        duration: 2000,
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
        <ChannelHeader
          channel={activeChannel}
          topic={topic}
          participantCount={58}
        />
        <MessageList messages={messages} channelName={activeChannel.name} />
        <MessageInput 
          channelName={activeChannel.name} 
          onSendMessage={handleSendMessage} 
        />
      </div>
    </div>
  );
}
