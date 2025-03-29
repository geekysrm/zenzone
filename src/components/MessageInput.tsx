
import { AtSign, Bold, FileInput, Italic, Mic, Paperclip, Send, Smile } from "lucide-react";
import { FormEvent, useState } from "react";

interface MessageInputProps {
  channelName: string;
  onSendMessage: (message: string) => void;
}

export default function MessageInput({ channelName, onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSubmitting) {
      try {
        setIsSubmitting(true);
        await onSendMessage(message);
        setMessage("");
      } catch (error) {
        console.error('Error in message submission:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="p-3 border-t">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message #${channelName}`}
          className="w-full border rounded-md px-4 py-2 pr-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1">
            <Bold size={16} />
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1">
            <Italic size={16} />
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1">
            <AtSign size={16} />
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1">
            <Smile size={16} />
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1">
            <Paperclip size={16} />
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1">
            <Mic size={16} />
          </button>
        </div>
      </form>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <div>
          Format with <span className="font-mono">Markdown</span>
        </div>
        <div>
          Ctrl+Enter to send
        </div>
      </div>
    </div>
  );
}
