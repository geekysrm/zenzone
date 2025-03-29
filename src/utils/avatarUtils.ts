
/**
 * Utility functions for avatar generation and styling
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
 * Generate an avatar URL using pravatar.cc
 * @param email The email to generate avatar for
 * @returns URL for the avatar image
 */
export const getAvatarUrl = (email: string): string => {
  if (!email) return "https://i.pravatar.cc/150";
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;
};

/**
 * Generate avatar colors (keeping this for backward compatibility)
 */
export const getAvatarColors = (): { bg: string, text: string } => {
  return { bg: 'bg-gray-500', text: 'text-white' };
};
