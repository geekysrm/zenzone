
/**
 * Utility functions for avatar generation
 */

/**
 * Get initials from a name (first letter of first and last word)
 * @param name The full name
 * @returns Two letter initials
 */
export const getInitials = (name: string): string => {
  if (!name) return "??";
  
  // Split the name into words
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    // If only one word, return first two letters
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  // Return first letter of first word and first letter of last word
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Generate avatar URL using multiavatar service
 * @param name The name to generate avatar for
 * @returns Avatar URL
 */
export const getAvatarUrl = (name: string): string => {
  if (!name) return "";
  
  // Create URL for multiavatar service
  return `https://multiavatar.com/${encodeURIComponent(name)}`;
};
