
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageForSummary, summarizeMessages } from "@/utils/summaryUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

interface MessageSummaryProps {
  messages: MessageForSummary[];
  channelName: string;
}

export default function MessageSummary({ messages, channelName }: MessageSummaryProps) {
  const [summary, setSummary] = useState<React.ReactNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const hasMessages = messages.length > 0;
  
  // Reset summary state when messages or channel changes
  useEffect(() => {
    setSummary(null);
    setIsGenerating(false);
  }, [messages, channelName]);
  
  // Generate summary when dialog is opened
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    
    // If opening the dialog and we have messages, generate summary
    if (open && hasMessages && !summary) {
      setIsGenerating(true);
      const summaryUI = summarizeMessages(messages, channelName);
      setSummary(summaryUI);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={!hasMessages}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Summarize Unread
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Channel Summary for #{channelName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto border rounded-md p-4 bg-gray-50">
            {summary ? (
              <div className="prose prose-sm max-w-none">
                {summary}
              </div>
            ) : (
              isGenerating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin mb-2">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <p>Generating summary...</p>
                  </div>
                </div>
              ) : (
                hasMessages 
                  ? "Click to create a summary of unread messages." 
                  : "No unread messages to summarize."
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
