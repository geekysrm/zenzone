
import * as React from "react"

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action && (
              <ToastAction 
                altText="Action"
                onClick={() => {
                  // Check if action has onClick property and is an object
                  if (action && typeof action === 'object' && 'onClick' in action) {
                    const actionObj = action as { onClick: () => void };
                    actionObj.onClick();
                  }
                }}
              >
                {typeof action === 'object' && 'label' in action 
                  ? (action as { label: string }).label 
                  : 'Action'}
              </ToastAction>
            )}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
