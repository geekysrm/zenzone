
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
  formatted = formatted.replace(/<li>.*?<\/li>/gs, match => `<ul>${match}</ul>`);
  
  // Links
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
  
  // Line breaks
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}

// Remove HTML tags to get plain text
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '');
}

export function summarizeMessages(
  messages: MessageForSummary[],
  channelName: string,
  channelId?: string,
  messageCount?: number,
  mode: 'unread' | 'recent' = 'unread',
  onSummaryText?: (text: string) => void
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
      
      // If we have a channelId and messageCount, fetch the messages from the database
      let messagesToSummarize: MessageForSummary[] = messages;
      
      if (channelId && messageCount && messageCount > 0) {
        // The query will be different based on the mode
        let query = supabase
          .from('messages')
          .select('content, timestamp, user_id')
          .eq('channel_id', channelId);
          
        if (mode === 'recent') {
          // For recent mode, get the most recent messages
          query = query.order('timestamp', { ascending: false }).limit(messageCount);
        } else if (mode === 'unread') {
          // For unread mode, the logic remains the same (gets the most recent unread messages)
          query = query.order('timestamp', { ascending: false }).limit(messageCount);
        }
          
        const { data: messageData, error: messageError } = await query;
          
        if (messageError) {
          throw new Error(`Error fetching messages: ${messageError.message}`);
        }
        
        if (messageData && messageData.length > 0) {
          // Get all the user IDs from the messages
          const userIds = messageData.map(msg => msg.user_id);
          
          // Fetch user profiles for those IDs
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', userIds);
            
          if (profilesError) {
            throw new Error(`Error fetching profiles: ${profilesError.message}`);
          }
          
          // Create a map of user IDs to usernames
          const userMap = new Map();
          if (profilesData) {
            profilesData.forEach(profile => {
              userMap.set(profile.id, profile.username || 'Unknown User');
            });
          }
          
          // Transform the message data into the correct format
          messagesToSummarize = messageData.map(msg => ({
            senderName: userMap.get(msg.user_id) || 'Unknown User',
            content: msg.content,
            timestamp: msg.timestamp
          })).reverse(); // Reverse to get chronological order
        }
      }
      
      if (messagesToSummarize.length === 0) {
        streamable.append(
          <div className="text-gray-500 italic">
            {mode === 'unread' 
              ? "No unread messages to summarize. The channel might be empty or all messages have been read."
              : "No recent messages to summarize. The channel might be empty."}
          </div>
        );
        streamable.done();
        return;
      }
      
      // Format messages for the prompt
      const formattedMessages = messagesToSummarize.map(msg => 
        `${new Date(msg.timestamp).toLocaleTimeString()} - ${msg.senderName}: ${msg.content}`
      ).join('\n');
      
      // Create the prompt for OpenAI
      const prompt = `
Here are the ${mode === 'unread' ? 'unread' : 'recent'} messages from a channel named #${channelName} ${mode === 'unread' ? 'that I missed' : ''}:

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
      
      // Initial UI feedback
      streamable.append(
        <div className="text-gray-600">
          Summarizing {messagesToSummarize.length} {mode === 'unread' ? 'unread' : 'recent'} messages from #{channelName}...
        </div>
      );
      
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
      
      const responseData = await response.json();
      const summary = responseData.choices[0].message.content;
      
      // If there's a callback for the plain text summary, call it
      if (onSummaryText) {
        onSummaryText(summary);
      }
      
      // Clear initial feedback
      streamable.value = null;
      
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
        description: `Summary of ${mode === 'unread' ? 'unread' : 'recent'} messages in #${channelName} is ready.`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error("Error during summarization:", error);
      streamable.append(
        <div className="text-red-500">Error generating summary: {error.message}</div>
      );
      
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
