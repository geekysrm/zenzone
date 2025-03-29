
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { StreamableUI } from "ai/rsc";
import { MessageForSummary, summarizeMessages } from "@/utils/summaryUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MessageSummaryProps {
  messages: MessageForSummary[];
  channelName: string;
}

export default function MessageSummary({ messages, channelName }: MessageSummaryProps) {
  const [summary, setSummary] = useState<StreamableUI | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(true);
  
  const handleGenerateSummary = () => {
    if (!apiKey) return;
    // Save API key in localStorage for convenience
    localStorage.setItem("claude_api_key", apiKey);
    setShowApiInput(false);
    const summaryUI = summarizeMessages(messages, channelName, apiKey);
    setSummary(summaryUI);
  };
  
  // Try to load API key from localStorage on component mount
  React.useEffect(() => {
    const savedKey = localStorage.getItem("claude_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setShowApiInput(false);
    }
  }, []);
  
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
        
        {showApiInput ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Claude API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Claude API key"
              />
              <p className="text-sm text-gray-500">
                Your API key is stored locally in your browser and is never sent to our servers.
              </p>
            </div>
            <Button onClick={handleGenerateSummary} disabled={!apiKey}>
              Generate Summary
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="min-h-[200px] max-h-[400px] overflow-y-auto border rounded-md p-4 bg-gray-50">
              {summary ? summary : "Click 'Generate Summary' to create a summary of unread messages."}
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowApiInput(true)}
              >
                Change API Key
              </Button>
              <Button onClick={handleGenerateSummary}>
                Generate Summary
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
