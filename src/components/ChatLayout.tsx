import { useState, useEffect } from "react";
import { Channel, Message, Section, Attachment } from "@/types/chat";
import Sidebar from "@/components/Sidebar";
import ChannelHeader from "@/components/ChannelHeader";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Json } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";

interface ChatLayoutProps {
  sections: Section[];
  activeChannel: Channel;
  messages: Message[];
  workspaceName: string;
  workspaceLogo: string;
  setActiveChannel: (channel: Channel) => void;
}

export function ChatLayout({
  sections,
  activeChannel,
  messages: initialMessages,
  workspaceName,
  workspaceLogo,
  setActiveChannel,
}: ChatLayoutProps) {
  const [participants, setParticipants] = useState<number>(0);
  const [channelTopic, setChannelTopic] = useState<string>("");
  const { user } = useAuth();

  // Query for fetching messages with caching
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', activeChannel.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', activeChannel.id)
        .order('timestamp', { ascending: true });
        
      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }

      // Fetch user profiles for these messages
      const userIds = [...new Set(data.map(msg => msg.user_id))];
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);
          
        if (profilesError) {
          console.error("Error fetching user profiles:", profilesError);
          return [];
        }

        // Transform database messages to match our Message type
        return data.map(message => {
          const userProfile = profiles.find(profile => profile.id === message.user_id);
          
          return {
            id: message.id,
            content: message.content,
            timestamp: message.timestamp,
            user: userProfile 
              ? {
                  id: userProfile.id,
                  name: userProfile.username || "Anonymous User",
                  avatar: userProfile.avatar_url || `https://i.pravatar.cc/150?u=${userProfile.id}`,
                  status: "online"
                }
              : {
                  id: message.user_id,
                  name: "Unknown User",
                  avatar: `https://i.pravatar.cc/150?u=${message.user_id}`,
                  status: "offline"
                },
            reactions: [],
            attachments: parseAttachments(message.attachments),
            isEvent: message.is_event || false,
            eventDetails: parseEventDetails(message.event_details),
          };
        });
      }
      
      return [];
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
  });

  // When active channel changes, update channel topic
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
    
    // Get participants count
    fetchParticipantsCount();
    
  }, [activeChannel]);

  const parseAttachments = (attachmentsData: Json | null): Attachment[] => {
    if (!attachmentsData) return [];
    
    // If it's an array, try to parse each item
    if (Array.isArray(attachmentsData)) {
      return attachmentsData.map((item, index) => {
        // If item is already in correct format, use it
        if (typeof item === 'object' && item !== null && 'id' in item && 'type' in item && 'name' in item && 'url' in item) {
          return item as Attachment;
        }
        
        // Otherwise create a default attachment
        return {
          id: `attachment-${index}`,
          type: "file",
          name: typeof item === 'string' ? item : `Attachment ${index}`,
          url: typeof item === 'string' ? item : "#"
        };
      });
    }
    
    // If it's a string (URL), create a single attachment
    if (typeof attachmentsData === 'string') {
      return [{
        id: 'attachment-1',
        type: 'file',
        name: 'Attachment',
        url: attachmentsData
      }];
    }
    
    // If it's an object but not in the correct format
    if (typeof attachmentsData === 'object' && attachmentsData !== null) {
      return Object.entries(attachmentsData).map(([key, value], index) => ({
        id: `attachment-${index}`,
        type: "file",
        name: key,
        url: typeof value === 'string' ? value : "#"
      }));
    }
    
    return [];
  };

  const parseEventDetails = (eventData: Json | null): { type: string; details: string; time?: string } => {
    if (!eventData) {
      return { type: "default", details: "Unknown event" };
    }
    
    // If it's already in the correct format
    if (typeof eventData === 'object' && eventData !== null && 
        'type' in eventData && 'details' in eventData) {
      const parsed = {
        type: String(eventData.type),
        details: String(eventData.details)
      };
      
      // Add time if available
      if ('time' in eventData && eventData.time) {
        return { ...parsed, time: String(eventData.time) };
      }
      
      return parsed;
    }
    
    // If it's a string, use it as details
    if (typeof eventData === 'string') {
      return { type: "info", details: eventData };
    }
    
    // Fallback
    return { type: "default", details: "Unknown event" };
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
            channelName={activeChannel.name}
            isLoading={isLoadingMessages}
          />
        </div>
        <MessageInput 
          onSendMessage={handleSendMessage} 
          channelName={activeChannel.name}
        />
      </div>
    </div>
  );
}

export { ChatLayout as default };
