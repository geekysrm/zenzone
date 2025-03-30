
import React, { useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

// Import the notification context
import { useNotification } from '@/context/NotificationContext';

// Create a global notification handler component that can be used to show notifications
// based on the current notification mode
export const NotificationHandler = ({ children }: { children: React.ReactNode }) => {
  // We use the useNotification hook to access the notification context
  const { isDnd } = useNotification();
  
  // Expose the notification state to the window object so it can be accessed from outside React components
  useEffect(() => {
    // @ts-ignore - adding a custom property to window
    window.notificationState = {
      isDnd
    };
    
    // Also store in localStorage as a fallback
    localStorage.setItem("notification_mode", isDnd ? "dnd" : "available");
  }, [isDnd]);
  
  return <>{children}</>;
};

export function showMessageNotification({
  channelName,
  senderName,
  messageContent,
  onClick,
  channelId
}: {
  channelName: string;
  senderName: string;
  messageContent: string;
  onClick: () => void;
  channelId?: string;
}) {
  try {
    // First try to get DND state from window object
    // @ts-ignore - accessing custom property on window
    const isDnd = window.notificationState?.isDnd;
    
    // If it's not available from the context (which it might not be outside of React components),
    // fall back to localStorage
    const fallbackIsDnd = localStorage.getItem("notification_mode") === "dnd";
    
    // Use the context value if available, otherwise use the fallback
    const shouldSuppressNotification = isDnd !== undefined ? isDnd : fallbackIsDnd;
    
    // Debug log
    console.log("Notification state check:", { 
      fromContext: isDnd, 
      fromLocalStorage: fallbackIsDnd,
      finalDecision: shouldSuppressNotification,
      message: `${senderName} in #${channelName}: ${messageContent}`
    });
    
    // If in DND mode, don't show any notifications
    if (shouldSuppressNotification) {
      console.log("Notification suppressed (DND mode active):", { channelName, senderName, messageContent });
      return;
    }
    
    // Play notification sound
    const audio = new Audio('/notification-sound.mp3');
    audio.play().catch(err => console.error('Failed to play notification sound:', err));
    
    // Show toast notification
    toast({
      title: `${senderName} in #${channelName}`,
      description: messageContent,
      action: (
        <ToastAction altText="View message" onClick={onClick}>
          View
        </ToastAction>
      ),
      duration: 5000,
    });
    
    console.log("Notification displayed for:", { channelName, senderName, messageContent });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}
