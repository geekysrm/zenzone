
import React from "react";
import { createStreamableUI } from "ai/rsc";
import { toast } from "@/components/ui/use-toast";

// This will store any ongoing summarization tasks
let activeSummarization: ReturnType<typeof createStreamableUI> | null = null;

export type MessageForSummary = {
  senderName: string;
  content: string;
  timestamp: string;
}

export function summarizeMessages(
  messages: MessageForSummary[],
  channelName: string,
  apiKey: string
) {
  // Cancel any existing summarization
  if (activeSummarization) {
    activeSummarization.done();
    activeSummarization = null;
  }
  
  // Create a new streamable UI
  const streamable = createStreamableUI();
  activeSummarization = streamable;
  
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
      
      // Create the prompt for OpenAI
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
      
      // Call the OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes chat conversations."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const summary = data.choices[0].message.content;
      
      // Append the summary
      streamable.append(<div className="whitespace-pre-wrap">{summary}</div>);
      
      // Show success toast
      toast({
        title: "Summary Complete",
        description: `Summary of #${channelName} is ready.`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Error during summarization:", error);
      streamable.append(<div className="text-red-500">Error generating summary: {error.message}</div>);
      
      toast({
        title: "Summarization Failed",
        description: error.message || "Failed to generate summary",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      streamable.done();
      activeSummarization = null;
    }
  })();
  
  return streamable.value;
}
