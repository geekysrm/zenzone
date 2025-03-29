
import { useState } from "react";
import Sidebar from "./Sidebar";
import ChannelHeader from "./ChannelHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Channel, Message } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";

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
  messages,
  workspaceName,
  workspaceLogo,
  setActiveChannel,
}: ChatLayoutProps) {
  const handleSendMessage = (messageText: string) => {
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
      duration: 2000,
    });
  };

  const topic = "Track and coordinate social media";
  
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
