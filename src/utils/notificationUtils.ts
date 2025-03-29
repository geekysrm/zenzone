
import { toast } from "@/hooks/use-toast";
import { getInitials } from "@/utils/avatarUtils";

type NotificationOptions = {
  channelName: string;
  senderName: string;
  messageContent: string;
  onClick?: () => void;
};

/**
 * Display a notification toast for a new message
 */
export const showMessageNotification = ({ 
  channelName, 
  senderName, 
  messageContent,
  onClick
}: NotificationOptions) => {
  toast({
    title: `New message in #${channelName}`,
    description: `${senderName}: ${messageContent}`,
    duration: 5000,
    action: onClick ? {
      altText: "View",
      children: "View",
      onClick
    } : undefined,
  });

  // Also play notification sound if browser supports it
  try {
    const audio = new Audio('/notification-sound.mp3');
    audio.volume = 0.5;
    audio.play().catch(error => {
      // Silently fail - browsers may block autoplay
      console.log("Could not play notification sound:", error);
    });
  } catch (error) {
    // Ignore errors with audio playback
  }
};
