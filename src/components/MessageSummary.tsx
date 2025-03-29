
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageForSummary, summarizeMessages } from "@/utils/summaryUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Volume2, Volume, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { speakText, stopSpeech } from "@/utils/textToSpeechUtils";
import { toast } from "@/components/ui/use-toast";

interface MessageSummaryProps {
  messages: MessageForSummary[];
  channelName: string;
  channelId?: string;
  unreadCount?: number;
  buttonText?: string;
  summaryMode?: 'unread' | 'recent'; // New prop for summary mode
}

export default function MessageSummary({ 
  messages, 
  channelName,
  channelId,
  unreadCount = 0,
  buttonText = "Summarize Unread",
  summaryMode = 'unread' // Default to unread mode
}: MessageSummaryProps) {
  const [summary, setSummary] = useState<React.ReactNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [summaryText, setSummaryText] = useState<string>("");
  
  const hasMessages = messages.length > 0 || (unreadCount && unreadCount > 0);
  
  // Reset summary state when messages or channel changes
  useEffect(() => {
    setSummary(null);
    setIsGenerating(false);
    setSummaryText("");
  }, [messages, channelName, channelId, unreadCount]);
  
  // Stop speech when dialog closes
  useEffect(() => {
    if (!isOpen && isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    }
  }, [isOpen, isSpeaking]);
  
  // Generate summary when dialog is opened
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    
    // If dialog is closing, stop any speech
    if (!open && isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    
    // If opening the dialog, generate summary based on the mode
    if (open) {
      setIsGenerating(true);
      const summaryUI = summarizeMessages(
        messages, 
        channelName, 
        channelId, 
        summaryMode === 'unread' ? unreadCount : 20, // Use unreadCount for unread mode, or 20 for recent mode
        summaryMode,
        (text) => {
          // This callback receives the plaintext summary from summarizeMessages
          setSummaryText(text);
        }
      );
      setSummary(summaryUI);
      setIsGenerating(false);
    }
  };
  
  const handleSpeakSummary = async () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    
    if (!summaryText) {
      toast({
        title: "No Summary Available",
        description: "There is no summary text to read.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSpeaking(true);
    
    try {
      await speakText({ text: summaryText });
      // The speech will stop automatically when finished
    } catch (error) {
      setIsSpeaking(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {summaryMode === 'unread' 
                ? `Unread Messages Summary for #${channelName}` 
                : `Recent Messages Summary for #${channelName}`}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleSpeakSummary}
              disabled={!summaryText || isGenerating}
              title={isSpeaking ? "Stop speaking" : "Read summary aloud"}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <Volume className="h-4 w-4" />}
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto border rounded-md p-4 bg-gray-50">
            {summary ? (
              <div className="prose prose-sm max-w-none">
                {summary}
              </div>
            ) : (
              isGenerating ? (
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
                summaryMode === 'unread'
                  ? (hasMessages 
                      ? "Click to create a summary of unread messages."
                      : "No unread messages to summarize.")
                  : "Click to create a summary of recent messages."
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
