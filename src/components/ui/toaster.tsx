
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

interface ActionWithClick {
  label: string;
  onClick: () => void;
}

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
                  // Type guard to check if action has onClick property
                  if (typeof action === 'object' && 'onClick' in action) {
                    (action as ActionWithClick).onClick();
                  }
                }}
              >
                {typeof action === 'object' && 'label' in action 
                  ? (action as ActionWithClick).label 
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
