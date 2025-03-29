
import { useState, useEffect, ReactNode } from "react";
import { Channel, Message, Section } from "@/types/chat";
import Sidebar from "@/components/Sidebar";
import ChannelHeader from "@/components/ChannelHeader";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface ChatLayoutProps {
  sections: Section[];
  activeChannel: Channel;
  messages: Message[];
  workspaceName: string;
  workspaceLogo: string;
  setActiveChannel: (channel: Channel) => void;
}

const ChatLayout = ({
  sections,
  activeChannel,
  messages: initialMessages,
  workspaceName,
  workspaceLogo,
  setActiveChannel,
}: ChatLayoutProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [participants, setParticipants] = useState<number>(0);
  const [channelTopic, setChannelTopic] = useState<string>("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const { user } = useAuth();

  // When active channel changes, fetch new messages
  useEffect(() => {
    if (!activeChannel) return;
    
    // Set channel topic based on channel name
    let topic = "";
    switch(activeChannel.name.toLowerCase()) {
      case "general":
        topic = "Company-wide announcements and work-based matters";
        break;
      case "random":
        topic = "Non-work banter and water cooler conversation";
        break;
      case "design":
        topic = "Design discussions, feedback, and resources";
        break;
      case "engineering":
        topic = "Technical discussions, code reviews, and help";
        break;
      case "marketing":
        topic = "Campaign planning, content strategy, and metrics";
        break;
      case "support":
        topic = "Customer issues, feedback, and resolution tracking";
        break;
      default:
        // For direct messages or other channels
        topic = activeChannel.type === "direct" 
          ? "Direct message conversation" 
          : `Discussions about ${activeChannel.name}`;
    }
    
    setChannelTopic(topic);
    setIsLoadingMessages(true);

    // Fetch messages for this channel
    fetchMessages();
    
    // Subscribe to realtime messages for this channel
    const subscription = supabase
      .channel(`messages:${activeChannel.id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `channel_id=eq.${activeChannel.id}`
        }, 
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Only add the message if it's not already in the list
          setMessages(currentMessages => {
            const exists = currentMessages.some(m => m.id === newMessage.id);
            if (exists) return currentMessages;
            return [...currentMessages, newMessage];
          });
        }
      )
      .subscribe();
      
    // Get participants count
    fetchParticipantsCount();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeChannel?.id, user]);

  const fetchMessages = async () => {
    try {
      setIsLoadingMessages(true);
      
      // Fetch messages from the database
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', activeChannel.id)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }
      
      // Need to fetch user profiles for these messages
      const userIds = [...new Set(data.map(msg => msg.user_id))];
      if (userIds.length > 0) {
        try {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);
            
          if (profilesError) {
            console.error("Error fetching user profiles:", profilesError);
          } else {
            // Add user data to messages
            const messagesWithUserData = data.map(message => {
              const userProfile = profiles.find(profile => profile.id === message.user_id);
              return {
                ...message,
                user: userProfile || { name: "Unknown User" }
              };
            });
            
            setMessages(messagesWithUserData);
          }
        } catch (err) {
          console.error("Error fetching user profiles:", err);
        }
      } else {
        setMessages(data);
      }
    } catch (err) {
      console.error("Error in fetchMessages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const fetchParticipantsCount = async () => {
    // This would typically be a database query to count distinct users in this channel
    // For now, we'll use a placeholder
    setParticipants(Math.floor(Math.random() * 20) + 5);
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      // Insert message into database
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            content,
            channel_id: activeChannel.id,
            user_id: user.id,
          }
        ])
        .select();
        
      if (error) {
        console.error("Error sending message:", error);
        return;
      }
      
      // No need to update local state since we're subscribed to changes
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
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
          topic={channelTopic}
          participantCount={participants}
        />
        <div className="flex-1 overflow-hidden">
          <MessageList 
            messages={messages} 
            isLoading={isLoadingMessages} 
          />
        </div>
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatLayout;
