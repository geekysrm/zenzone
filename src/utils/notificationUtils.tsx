
import React from 'react';
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

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
    // Play notification sound
    const audio = new Audio('/notification-sound.mp3');
    audio.play().catch(err => console.error('Failed to play notification sound:', err));
    
    // Show toast notification
    toast({
      title: `${senderName} in #${channelName}`,
      description: messageContent,
      action: {
        label: "View",
        onClick: onClick
      },
      duration: 5000,
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}
