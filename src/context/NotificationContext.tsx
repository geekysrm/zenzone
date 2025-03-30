
import React, { createContext, useContext, useState, useEffect } from "react";

type NotificationMode = "available" | "dnd";

interface NotificationContextType {
  mode: NotificationMode;
  setMode: (mode: NotificationMode) => void;
  toggleMode: () => void;
  isDnd: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // Get initial mode from localStorage or default to "available"
  const [mode, setModeState] = useState<NotificationMode>(() => {
    const savedMode = localStorage.getItem("notification_mode");
    return (savedMode as NotificationMode) || "available";
  });

  // Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("notification_mode", mode);
  }, [mode]);

  const setMode = (newMode: NotificationMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState(prevMode => prevMode === "available" ? "dnd" : "available");
  };

  const isDnd = mode === "dnd";

  return (
    <NotificationContext.Provider value={{ mode, setMode, toggleMode, isDnd }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
