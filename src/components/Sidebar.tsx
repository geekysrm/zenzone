
import { Channel, Section } from "@/types/chat";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { ChevronDown, Hash, Lock, LogOut, Plus, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface SidebarProps {
  sections: Section[];
  activeChannel: Channel;
  workspaceName: string;
  workspaceLogo: string;
  onChannelSelect: (channel: Channel) => void;
}

export default function Sidebar({
  sections,
  activeChannel,
  workspaceName,
  workspaceLogo,
  onChannelSelect,
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const renderChannelIcon = useCallback((channel: Channel) => {
    if (channel.type === "direct") {
      return <User size={16} />;
    } else {
      return channel.isPrivate ? <Lock size={16} /> : <Hash size={16} />;
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slack-purple text-white w-64 flex-shrink-0 overflow-y-auto">
      <div className="p-3 flex items-center justify-between border-b border-slack-divider">
        <div className="flex items-center space-x-2">
          <img src={workspaceLogo} alt={workspaceName} className="w-8 h-8 rounded" />
          <h1 className="font-semibold text-lg">{workspaceName}</h1>
        </div>
        <ChevronDown size={16} />
      </div>

      <div className="mt-4 flex-1">
        {sections.map((section) => (
          <div key={section.id} className="mb-4">
            <h2 className="px-4 mb-1 text-slack-gray text-sm uppercase">
              {section.title}
            </h2>
            <ul>
              {section.items.map((channel) => (
                <li key={channel.id}>
                  <button
                    onClick={() => onChannelSelect(channel)}
                    className={cn(
                      "flex items-center w-full px-4 py-1 text-left",
                      activeChannel.id === channel.id ? "bg-slack-highlight text-white" : "text-slack-gray hover:bg-gray-800"
                    )}
                  >
                    <span className="mr-2">{renderChannelIcon(channel)}</span>
                    <span className="flex-1 truncate">{channel.name}</span>
                    {channel.unreadCount && (
                      <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {channel.unreadCount}
                      </span>
                    )}
                  </button>
                </li>
              ))}
              {section.id === "channels" && (
                <li>
                  <button
                    className="flex items-center w-full px-4 py-1 text-left text-slack-gray hover:bg-gray-800"
                  >
                    <span className="mr-2"><Plus size={16} /></span>
                    <span className="flex-1">Add channels</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-3 mt-auto border-t border-slack-divider">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 w-full hover:bg-gray-800 p-2 rounded cursor-pointer">
              <div className="relative">
                <img
                  src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=3"} 
                  alt="Your avatar"
                  className="w-8 h-8 rounded"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slack-purple rounded-full"></span>
              </div>
              <span className="text-sm font-medium flex-1 text-left">{user?.user_metadata?.name || "You"}</span>
              <ChevronDown size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="top" 
            align="start" 
            className="w-56 bg-slack-purple text-white border-slack-divider"
          >
            <DropdownMenuItem className="text-sm cursor-pointer hover:bg-gray-800">
              Profile & Account
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm cursor-pointer hover:bg-gray-800">
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slack-divider" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-sm cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-red-400"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
