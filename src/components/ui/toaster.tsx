
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
import { Bell } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-100">
                <Bell className="h-5 w-5 text-purple-500" />
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle className="font-bold text-black">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-gray-700">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action && (
              <ToastAction 
                altText={action.altText}
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
