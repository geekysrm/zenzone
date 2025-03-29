
import { Channel } from "@/types/chat";
import { ChevronDown, Hash, Headphones, Search, Sparkles, Users } from "lucide-react";
import { MessageForSummary } from "@/utils/summaryUtils";
import { Button } from "@/components/ui/button";
import MessageSummary from "@/components/MessageSummary";

interface ChannelHeaderProps {
  channel: Channel;
  topic?: string;
  participantCount?: number;
}

export default function ChannelHeader({ channel, topic, participantCount }: ChannelHeaderProps) {
  // Create empty messages array for the summary component
  const dummyMessages: MessageForSummary[] = [];

  return (
    <div className="border-b flex items-center justify-between p-3">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Hash size={18} className="mr-2 text-gray-500" />
          <h2 className="font-semibold">{channel.name}</h2>
          <ChevronDown size={16} className="ml-1 text-gray-500" />
        </div>
        {topic && (
          <>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-gray-600 text-sm truncate max-w-md">{topic}</span>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {participantCount && (
          <div className="flex items-center text-gray-500">
            <Users size={16} className="mr-1" />
            <span className="text-sm">{participantCount}</span>
          </div>
        )}
        <button className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
          <Headphones size={16} />
        </button>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <Search size={14} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Acme Inc"
            className="bg-gray-100 text-sm rounded-md pl-8 pr-4 py-1.5 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <MessageSummary 
          messages={dummyMessages}
          channelName={channel.name}
          channelId={channel.id}
          unreadCount={channel.unreadCount}
          buttonText="Summarize Recent"
          summaryMode="recent"
        />
      </div>
    </div>
  );
}
