
import { useState, useEffect } from "react";
import ChatLayout from "@/components/ChatLayout";
import { Channel } from "@/types/chat";
import { mockCurrentChannel, mockSections, mockUsers } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeChannel, setActiveChannel] = useState<Channel>(mockCurrentChannel);
  const [messages, setMessages] = useState([]);
  const { user, signOut } = useAuth();
  
  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
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
