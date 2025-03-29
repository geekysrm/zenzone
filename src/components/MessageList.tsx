
import { Message } from "@/types/chat";
import { formatRelativeTime } from "@/lib/dateUtils";
import { Headphones, Paperclip } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          {message.isEvent ? (
            <EventMessage message={message} />
          ) : (
            <UserMessage message={message} isCurrentUser={message.user.id === user?.id} />
          )}
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
          <div className="w-10 h-10 flex-shrink-0">
            <img 
              src={message.user.avatar} 
              alt={message.user.name} 
              className="w-full h-full rounded"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-bold">{message.user.name}</span>
              <span className="text-xs text-gray-500">{message.timestamp}</span>
            </div>
            <p>{message.content}</p>
            <div className="mt-1 pl-4 border-l-2 border-blue-500">
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
  return (
    <div className={cn(
      "flex items-start gap-2 max-w-[80%]",
      isCurrentUser ? "ml-auto flex-row-reverse" : ""
    )}>
      <div className="w-10 h-10 flex-shrink-0">
        <img 
          src={message.user.avatar} 
          alt={message.user.name} 
          className="w-full h-full rounded"
        />
      </div>
      <div className={cn(
        "flex-1",
        isCurrentUser ? "text-right" : ""
      )}>
        <div className={cn(
          "flex items-baseline gap-2",
          isCurrentUser ? "flex-row-reverse" : ""
        )}>
          <span className="font-bold">{message.user.name}</span>
          <span className="text-xs text-gray-500">{message.timestamp}</span>
        </div>
        <div className={cn(
          "p-3 rounded-lg mt-1 inline-block",
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-100"
        )}>
          <p>{message.content}</p>
        </div>
        {message.attachments && message.attachments.length > 0 && (
          <div className={cn(
            "mt-2", 
            isCurrentUser ? "float-right clear-both" : ""
          )}>
            {message.attachments.map(attachment => (
              <div key={attachment.id} className={cn(
                "flex items-center gap-2 p-2 border rounded bg-gray-50 max-w-md",
                isCurrentUser ? "flex-row-reverse" : ""
              )}>
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
