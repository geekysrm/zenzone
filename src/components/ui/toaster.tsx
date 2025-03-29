
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastAction
} from "@/components/ui/toast"
import { getInitials, getAvatarUrl } from "@/utils/avatarUtils"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Generate initials for the notification
        const notificationTitle = title || "";
        const initials = getInitials(notificationTitle.includes("#") 
          ? notificationTitle.split("#")[1] 
          : "Notification");
        
        // Generate an avatar URL based on the notification title
        const avatarUrl = getAvatarUrl(notificationTitle);

        return (
          <Toast key={id} {...props}>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={avatarUrl} 
                  alt="notification" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle className="font-bold text-black">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-gray-700">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action && typeof action === 'object' && 'onClick' in action && (
              <ToastAction 
                altText={typeof action.children === 'string' ? action.children : "View"} 
                onClick={action.onClick}
              >
                {action.children}
              </ToastAction>
            )}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
