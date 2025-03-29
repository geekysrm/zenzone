
import { useState } from "react";
import ChatLayout from "@/components/ChatLayout";
import { Channel } from "@/types/chat";
import { mockCurrentChannel, mockMessages, mockSections, mockUsers } from "@/data/mockData";

const Index = () => {
  const [activeChannel, setActiveChannel] = useState<Channel>(mockCurrentChannel);
  const messages = mockMessages[activeChannel.id] || [];
  
  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
  };

  return (
    <div className="h-screen overflow-hidden">
      <ChatLayout
        sections={mockSections}
        activeChannel={activeChannel}
        messages={messages}
        workspaceName="Acme Inc"
        workspaceLogo="/lovable-uploads/4184efd4-0e69-4a98-b2e4-59ef0a1dbe06.png"
        setActiveChannel={handleChannelSelect}
      />
    </div>
  );
};

export default Index;
