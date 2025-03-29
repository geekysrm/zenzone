
import { toast } from "@/components/ui/use-toast";

// Define a type for the toast action
type ToastAction = {
  onClick: () => void;
  label: string;
};

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
      title: `${senderName} in #${channelName}`,
      description: messageContent,
      // Cast the action to any to work around the type compatibility issues
      action: {
        label: "View",
        onClick: onClick
      } as any,
      duration: 5000,
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}
