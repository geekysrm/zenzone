
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials, getAvatarColors } from "@/utils/avatarUtils"
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
        const avatarColors = getAvatarColors(notificationTitle);

        return (
          <Toast key={id} {...props}>
            <div className="flex items-start gap-3">
              <div className={cn("h-9 w-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center", avatarColors.bg)}>
                <span className={cn("text-sm font-medium", avatarColors.text)}>{initials}</span>
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle className="font-bold text-black">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-gray-700">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action && typeof action === 'object' && 'label' in action && (
              <ToastAction 
                altText={typeof action.label === 'string' ? action.label : "View"} 
                onClick={() => {
                  if ('onClick' in action && typeof action.onClick === 'function') {
                    action.onClick();
                  }
                }}
              >
                {typeof action.label === 'string' ? action.label : "View"}
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
