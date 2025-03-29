
import React from "react";
import { createStreamableUI, StreamableUI } from "@/utils/streamableUI";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// This will store any ongoing summarization tasks
let activeSummarization: StreamableUI | null = null;

export type MessageForSummary = {
  senderName: string;
  content: string;
  timestamp: string;
}

// Helper function to render Markdown
function renderMarkdown(text: string): string {
  // Bold
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code
  formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
  
  // Headers
  formatted = formatted.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold">$1</h3>');
  formatted = formatted.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-semibold">$1</h2>');
  formatted = formatted.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-semibold">$1</h1>');
  
  // Lists
  formatted = formatted.replace(/^\- (.*?)$/gm, '<li>$1</li>');
  formatted = formatted.replace(/^\* (.*?)$/gm, '<li>$1</li>');
  
  // Links
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
  
  // Line breaks
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}

export function summarizeMessages(
  messages: MessageForSummary[],
  channelName: string,
  channelId?: string,
  unreadCount?: number
) {
  // Cancel any existing summarization
  if (activeSummarization) {
    activeSummarization.done();
    activeSummarization = null;
  }
  
  // Create a new streamable UI
  const streamable = createStreamableUI();
  activeSummarization = streamable;
  
  // Start the summarization process
  (async () => {
    try {
      // Get the API key from Supabase
      const { data: supabaseData } = await supabase.functions.invoke("get-api-key", {
        body: { key: "AI_API_KEY" }
      });
      
      const apiKey = supabaseData?.apiKey;
      
      if (!apiKey) {
        throw new Error("Failed to retrieve API key from Supabase");
      }
      
      // If we have a channelId and unreadCount, fetch the unread messages from the database
      let unreadMessages: MessageForSummary[] = messages;
      
      if (channelId && unreadCount && unreadCount > 0) {
        // Fetch the most recent 'unreadCount' messages for the channel
        const { data: messageData, error: messageError } = await supabase
          .from('messages')
          .select('content, timestamp, user:user_id(name)')
          .eq('channel_id', channelId)
          .order('timestamp', { ascending: false })
          .limit(unreadCount);
          
        if (messageError) {
          throw new Error(`Error fetching messages: ${messageError.message}`);
        }
        
        if (messageData && messageData.length > 0) {
          // Transform the message data into the correct format
          unreadMessages = messageData.map(msg => ({
            senderName: msg.user?.name || 'Unknown User',
            content: msg.content,
            timestamp: msg.timestamp
          })).reverse(); // Reverse to get chronological order
        }
      }
      
      if (unreadMessages.length === 0) {
        streamable.append(
          <div className="text-gray-500 italic">
            No messages to summarize. The channel might be empty or the messages cannot be retrieved.
          </div>
        );
        return;
      }
      
      // Format messages for the prompt
      const formattedMessages = unreadMessages.map(msg => 
        `${new Date(msg.timestamp).toLocaleTimeString()} - ${msg.senderName}: ${msg.content}`
      ).join('\n');
      
      // Create the prompt for OpenAI
      const prompt = `
Here are the unread messages from a channel named #${channelName} that I missed:

${formattedMessages}

Please provide a concise summary of the important points discussed. Focus on:
- Key decisions made
- Questions asked that need answers
- Action items assigned to people
- Important announcements

Format your response with Markdown:
- Use **bold** for important categories
- Use - for bullet points
- Use proper headings for sections

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
      
      // Append the summary with markdown formatting
      streamable.append(
        <div 
          className="whitespace-pre-wrap prose prose-sm max-w-none" 
          dangerouslySetInnerHTML={{ __html: renderMarkdown(summary) }}
        />
      );
      
      // Show success toast
      toast({
        title: "Summary Complete",
        description: `Summary of unread messages in #${channelName} is ready.`,
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
