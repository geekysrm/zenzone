import { AtSign, Bold, Italic, Mic, Paperclip, Send, Smile } from "lucide-react";
import { FormEvent, useState, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  channelName: string;
  onSendMessage: (message: string) => void;
}

export default function MessageInput({ channelName, onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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

  // Handle key press events (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid newline
      handleSubmit(e as unknown as FormEvent);
    }
  };

  // Simple Markdown renderer for preview
  const renderMarkdown = (text: string): string => {
    // Bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Headers
    formatted = formatted.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Lists
    formatted = formatted.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    
    // Links
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="p-3 border-t">
      <form onSubmit={handleSubmit} className="relative">
        {isPreviewMode ? (
          <div 
            className="w-full border rounded-md px-4 py-2 pr-24 min-h-[80px] bg-gray-50"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message) }}
          />
        ) : (
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`}
            className="w-full rounded-md pr-24 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
            disabled={isSubmitting}
          />
        )}

        <div className="absolute right-2 top-4 transform flex items-center space-x-1">
          <button 
            type="button" 
            className={cn(
              "text-gray-500 hover:text-gray-800 p-1",
              isPreviewMode && "bg-blue-100 text-blue-600 rounded"
            )}
            onClick={togglePreview}
            title={isPreviewMode ? "Edit" : "Preview"}
          >
            {isPreviewMode ? "Edit" : "Preview"}
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1" title="Bold" onClick={() => setMessage(message + '**bold**')}>
            <Bold size={16} />
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1" title="Italic" onClick={() => setMessage(message + '*italic*')}>
            <Italic size={16} />
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1" title="Mention">
            <AtSign size={16} />
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1" title="Emoji">
            <Smile size={16} />
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1" title="Attach file">
            <Paperclip size={16} />
          </button>
          <button type="button" className="text-gray-500 hover:text-gray-800 p-1" title="Voice message">
            <Mic size={16} />
          </button>
        </div>
      </form>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <div>
          Format with <span className="font-mono">Markdown</span> - <span className="italic">*italic*</span>, <span className="font-bold">**bold**</span>, <code className="bg-gray-100 px-1">`code`</code>
        </div>
        <div>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
