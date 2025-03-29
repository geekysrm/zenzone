
import { createStreamableUI, StreamableUI } from "ai/rsc";
import { toast } from "@/components/ui/use-toast";

// This will store any ongoing summarization tasks
let activeSummarization: StreamableUI | null = null;

export type MessageForSummary = {
  senderName: string;
  content: string;
  timestamp: string;
}

export function summarizeMessages(
  messages: MessageForSummary[],
  channelName: string,
  apiKey: string
): StreamableUI {
  // Cancel any existing summarization
  if (activeSummarization) {
    activeSummarization.done();
    activeSummarization = null;
  }
  
  // Create a new streamable UI
  const { ui, append, done, isCompleted } = createStreamableUI();
  activeSummarization = ui;
  
  // Show loading toast
  toast({
    title: "Summarizing messages",
    description: `Creating a summary of messages in #${channelName}...`,
    duration: 2000,
  });
  
  // Start the summarization process
  (async () => {
    try {
      // Format messages for the prompt
      const formattedMessages = messages.map(msg => 
        `${new Date(msg.timestamp).toLocaleTimeString()} - ${msg.senderName}: ${msg.content}`
      ).join('\n');
      
      // Create the prompt for Claude
      const prompt = `
Here are messages from a channel named #${channelName} that I missed:

${formattedMessages}

Please provide a concise summary of the important points discussed. Focus on:
- Key decisions made
- Questions asked that need answers
- Action items assigned to people
- Important announcements

Keep the summary brief but informative.
      `;
      
      // Call the Claude API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const summary = data.content[0].text;
      
      // Append the summary
      append(<div className="whitespace-pre-wrap">{summary}</div>);
      
      // Show success toast
      toast({
        title: "Summary Complete",
        description: `Summary of #${channelName} is ready.`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Error during summarization:", error);
      append(<div className="text-red-500">Error generating summary: {error.message}</div>);
      
      toast({
        title: "Summarization Failed",
        description: error.message || "Failed to generate summary",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      done();
      activeSummarization = null;
    }
  })();
  
  return ui;
}
