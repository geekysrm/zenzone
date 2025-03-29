
import React from 'react';
import { toast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

export function showMessageNotification({
  channelName,
  senderName,
  messageContent,
  onClick
}: {
  channelName: string;
  senderName: string;
  messageContent: string;
  onClick: () => void;
}) {
  try {
    // Play notification sound
    const audio = new Audio('/notification-sound.mp3');
    audio.play().catch(err => console.error('Failed to play notification sound:', err));
    
    // Show toast notification
    toast({
      title: (
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>{senderName} in #{channelName}</span>
        </div>
      ),
      description: messageContent,
      action: {
        label: "View",
        onClick: onClick,
      },
      duration: 5000,
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}
