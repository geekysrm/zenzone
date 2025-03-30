
import React from 'react';
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

// Import the notification context
import { useNotification } from '@/context/NotificationContext';

// Create a component that wraps the toast functionality and respects DND mode
export function NotificationHandler() {
  // This component doesn't render anything
  return null;
}

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
    // Check if DND mode is enabled via localStorage
    // We need to check directly as we can't use hooks in a regular function
    const notificationMode = localStorage.getItem("notification_mode");
    const isDnd = notificationMode === "dnd";
    
    // If in DND mode, don't show any notifications
    if (isDnd) {
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
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}
