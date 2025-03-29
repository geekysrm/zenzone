
import { useState } from "react";
import ChatLayout from "@/components/ChatLayout";
import { Channel } from "@/types/chat";
import { mockCurrentChannel, mockSections } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [activeChannel, setActiveChannel] = useState<Channel>(mockCurrentChannel);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  
  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
  };

  return (
    <div className="h-screen overflow-hidden">
      <ChatLayout
        sections={mockSections}
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
