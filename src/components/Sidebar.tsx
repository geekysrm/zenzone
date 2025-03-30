import { Channel, Section } from "@/types/chat";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { ChevronDown, Hash, Lock, LogOut, Plus, User, Sparkles, BellOff, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { getInitials } from "@/utils/avatarUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { MessageForSummary } from "@/utils/summaryUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { summarizeMessages } from "@/utils/summaryUtils";
import { Switch } from "@/components/ui/switch";

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
  const { mode, toggleMode, isDnd } = useNotification();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Add summary dialog state
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [summaryContent, setSummaryContent] = useState<React.ReactNode | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [currentSummaryChannel, setCurrentSummaryChannel] = useState<Channel | null>(null);

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

  // Get user's display name and initials
  const userName = user?.user_metadata?.name || "Anonymous";
  const userInitials = getInitials(userName);
  // Generate avatar URL using email or ID
  const userEmail = user?.email || "";
  const avatarUrl =  `https://i.pravatar.cc/150?u=${user?.id || "anonymous"}`;

  const handleSummarizeChannel = (e: React.MouseEvent, channel: Channel) => {
    e.stopPropagation(); // Prevent triggering channel selection
    
    // Don't do anything if there are no unread messages
    if (!channel.unreadCount || channel.unreadCount === 0) {
      toast({
        title: "No unread messages",
        description: `There are no unread messages in #${channel.name} to summarize.`,
        duration: 3000,
      });
      return;
    }
    
    // Open the dialog with loading state
    setSummaryDialogOpen(true);
    setIsGeneratingSummary(true);
    setSummaryContent(null);
    setCurrentSummaryChannel(channel);
    
    console.log("Generating summary for channel:", channel.name);
    
    // Generate summary with empty messages array (will be filled on the backend)
    const dummyMessages: MessageForSummary[] = [];
    const summaryContent = summarizeMessages(dummyMessages, channel.name, channel.id, channel.unreadCount);
    
    // Set the summary content after a short delay to ensure dialog is rendered
    setTimeout(() => {
      setSummaryContent(summaryContent);
      setIsGeneratingSummary(false);
    }, 100);
  };

  return (
    <>
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
                    <div className="group relative">
                      <button
                        onClick={() => onChannelSelect(channel)}
                        className={cn(
                          "flex items-center w-full px-4 py-1 text-left",
                          activeChannel.id === channel.id ? "bg-slack-highlight text-white" : "text-slack-gray hover:bg-gray-800"
                        )}
                      >
                        <span className="mr-2">{renderChannelIcon(channel)}</span>
                        <span className="flex-1 truncate">{channel.name}</span>
                        {channel.unreadCount > 0 && (
                          <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {channel.unreadCount}
                          </span>
                        )}
                      </button>
                      
                      {/* Sparkle icon with tooltip for summarization - updated tooltip text here */}
                      {channel.unreadCount > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={(e) => handleSummarizeChannel(e, channel)}
                                className={cn(
                                  "absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white",
                                  "focus:opacity-100 focus:outline-none z-10",
                                  activeChannel.id === channel.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )}
                                aria-label="Summarize recent messages"
                              >
                                <Sparkles size={14} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p className="text-xs">Summarize Recent</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
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
          {/* Add notification toggle before the dropdown */}
          <div className="flex items-center justify-between mb-3 px-2 py-1 rounded hover:bg-gray-800">
            <div className="flex items-center">
              {isDnd ? (
                <BellOff className="h-5 w-5 text-red-400 mr-2" />
              ) : (
                <Bell className="h-5 w-5 text-green-400 mr-2" />
              )}
              <span className="text-sm">Notifications</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch 
                    checked={!isDnd} 
                    onCheckedChange={() => {
                      toggleMode();
                      toast({
                        title: isDnd ? "Notifications enabled" : "Do Not Disturb enabled",
                        description: isDnd 
                          ? "You will now receive message notifications" 
                          : "You will not receive message notifications",
                        duration: 3000,
                      });
                    }} 
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{isDnd ? "Enable notifications" : "Enable Do Not Disturb"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 w-full hover:bg-gray-800 p-2 rounded cursor-pointer">
                <div className="relative">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Your avatar"
                      className="w-8 h-8 rounded"
                    />
                  ) : (
                    <img
                      src={avatarUrl}
                      alt="Your avatar"
                      className="w-8 h-8 rounded"
                    />
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slack-purple rounded-full"></span>
                </div>
                <span className="text-sm font-medium flex-1 text-left">{userName}</span>
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
      
      {/* Summary Dialog - updating title text here */}
      <Dialog open={summaryDialogOpen} onOpenChange={setSummaryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentSummaryChannel && `Unread Messages Summary for #${currentSummaryChannel.name}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="min-h-[200px] max-h-[400px] overflow-y-auto border rounded-md p-4 bg-gray-50">
              {summaryContent ? (
                <div className="prose prose-sm max-w-none">
                  {summaryContent}
                </div>
              ) : (
                isGeneratingSummary ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    
                    <div className="pt-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    
                    <div className="pt-2">
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    
                    <div className="pt-2">
                      <Skeleton className="h-4 w-11/12" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ) : (
                  currentSummaryChannel && currentSummaryChannel.unreadCount > 0
                    ? "Creating summary of recent messages..." 
                    : "No recent messages to summarize."
                )
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
