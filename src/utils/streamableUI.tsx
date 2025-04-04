
import React from "react";

export type StreamableUI = {
  value: React.ReactNode;
  append: (content: React.ReactNode) => void;
  done: () => void;
};

/**
 * Creates a simple streamable UI component that allows appending content
 * and signaling when the stream is complete.
 */
export function createStreamableUI(): StreamableUI {
  let content: React.ReactNode[] = [];
  let updateCallbacks: Array<() => void> = [];
  let isDone = false;

  // Create a component that will re-render when content is appended
  const StreamComponent = () => {
    const [_, setUpdateCounter] = React.useState(0);
    
    React.useEffect(() => {
      // Register a callback to trigger re-renders when content changes
      const callback = () => setUpdateCounter(prev => prev + 1);
      updateCallbacks.push(callback);
      
      return () => {
        updateCallbacks = updateCallbacks.filter(cb => cb !== callback);
      };
    }, []);
    
    // If there's no content, return null instead of an empty fragment
    if (content.length === 0) return null;
    
    return <>{content}</>;
  };
  
  return {
    value: <StreamComponent />,
    append: (newContent: React.ReactNode) => {
      if (isDone) return; // Don't append after done
      
      // For single content replacement
      if (newContent === null) {
        content = [];
      } else {
        content = [...content, newContent];
      }
      
      // Notify all registered components to update
      updateCallbacks.forEach(callback => callback());
    },
    done: () => {
      isDone = true;
      // Optional: clean up callbacks when done
      updateCallbacks = [];
    }
  };
}
