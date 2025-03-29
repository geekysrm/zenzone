
import { Message } from "@/types/chat";
import { formatRelativeTime } from "@/lib/dateUtils";
import { Headphones, Paperclip } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  channelName: string;
}

export default function MessageList({ messages, channelName }: MessageListProps) {
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
            <UserMessage message={message} />
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

function UserMessage({ message }: { message: Message }) {
  return (
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
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2">
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
