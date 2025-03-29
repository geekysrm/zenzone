
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageForSummary, summarizeMessages } from "@/utils/summaryUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MessageSummaryProps {
  messages: MessageForSummary[];
  channelName: string;
}

export default function MessageSummary({ messages, channelName }: MessageSummaryProps) {
  const [summary, setSummary] = useState<React.ReactNode | null>(null);
  
  const handleGenerateSummary = () => {
    const summaryUI = summarizeMessages(messages, channelName);
    setSummary(summaryUI);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Summarize Unread
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Channel Summary for #{channelName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto border rounded-md p-4 bg-gray-50">
            {summary ? summary : "Click 'Generate Summary' to create a summary of unread messages."}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGenerateSummary}>
              Generate Summary
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
