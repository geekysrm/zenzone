
import { Message } from "@/types/chat";
import { formatRelativeTime } from "@/lib/dateUtils";
import { Headphones, Paperclip } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MessageListProps {
  messages: Message[];
  channelName: string;
}

export default function MessageList({ messages, channelName }: MessageListProps) {
  const { user } = useAuth();
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">No messages in #{channelName} yet</p>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach(message => {
    // Ensure we have a valid date object
    const messageDate = new Date(message.timestamp);
    if (!isNaN(messageDate.getTime())) {
      const date = messageDate.toLocaleDateString();
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
    } else {
      // Handle invalid dates by using current date as fallback
      const today = new Date().toLocaleDateString();
      if (!groupedMessages[today]) {
        groupedMessages[today] = [];
      }
      groupedMessages[today].push(message);
    }
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <div className="px-3 text-xs text-gray-500 font-medium">{date}</div>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>
          
          {dateMessages.map((message) => (
            <div key={message.id} className="mb-2">
              {message.isEvent ? (
                <EventMessage message={message} />
              ) : (
                <UserMessage message={message} isCurrentUser={message.user.id === user?.id} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function EventMessage({ message }: { message: Message }) {
  if (!message.eventDetails) return null;
  
  return (
    <div className="flex items-center pl-12 py-1">
      {message.eventDetails.type === "huddle" ? (
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded">
            <Headphones size={18} className="text-gray-600" />
          </div>
          <div>
            <p className="font-medium">{message.content}</p>
            <p className="text-sm text-gray-600">
              {message.eventDetails.details}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <Avatar className="w-9 h-9 flex-shrink-0 mt-1">
            <AvatarImage
              src={message.user.avatar}
              alt={message.user.name}
            />
            <AvatarFallback>{message.user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-gray-800">{message.user.name}</span>
              <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
            </div>
            <p>{message.content}</p>
            <div className="mt-1 pl-4 border-l-2 border-gray-300">
              <p className="font-medium">{message.eventDetails.details}</p>
              {message.eventDetails.time && (
                <p className="text-sm text-gray-600">{message.eventDetails.time}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserMessage({ message, isCurrentUser }: { message: Message; isCurrentUser: boolean }) {
  // Format the timestamp properly
  const timestamp = formatTimestamp(message.timestamp);
  
  return (
    <div className={cn(
      "flex items-start gap-2 hover:bg-gray-50 px-2 py-1 rounded",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="w-9 h-9 flex-shrink-0 mt-1">
        <AvatarImage
          src={message.user.avatar}
          alt={message.user.name}
        />
        <AvatarFallback>{message.user.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex-1 max-w-[85%]",
        isCurrentUser ? "text-right" : "text-left"
      )}>
        <div className={cn(
          "flex items-baseline gap-2",
          isCurrentUser ? "justify-end" : "justify-start"
        )}>
          {isCurrentUser ? (
            <>
              <span className="text-xs text-gray-500">{timestamp}</span>
              <span className="font-bold text-gray-800">{message.user.name}</span>
            </>
          ) : (
            <>
              <span className="font-bold text-gray-800">{message.user.name}</span>
              <span className="text-xs text-gray-500">{timestamp}</span>
            </>
          )}
        </div>
        
        <div className="text-gray-800">
          <p>{message.content}</p>
        </div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className={cn(
            "mt-2",
            isCurrentUser ? "flex justify-end" : ""
          )}>
            {message.attachments.map(attachment => (
              <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded bg-gray-50 max-w-md">
                <div className="bg-purple-100 p-2 rounded">
                  <Paperclip size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">{attachment.name}</p>
                  <p className="text-xs text-gray-500">{attachment.previewUrl}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to safely format timestamps
function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "just now";
    }
    
    // Format time as HH:MM AM/PM
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit'
    });
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "just now";
  }
}
