
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Convert to minutes
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) {
    return "just now";
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else {
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      if (days === 1) {
        return "yesterday";
      } else {
        return `${days}d ago`;
      }
    }
  }
}
