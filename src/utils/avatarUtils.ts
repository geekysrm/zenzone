
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

/**
 * Generate background and text colors for an avatar based on name
 * @param name The name to generate colors for
 * @returns Object with bg (background color) and text (text color) properties
 */
export const getAvatarColors = (name: string): { bg: string; text: string } => {
  if (!name) return { bg: "bg-gray-200", text: "text-gray-700" };
  
  // List of background and corresponding text colors
  const colorPairs = [
    { bg: "bg-red-100", text: "text-red-800" },
    { bg: "bg-blue-100", text: "text-blue-800" },
    { bg: "bg-green-100", text: "text-green-800" },
    { bg: "bg-yellow-100", text: "text-yellow-800" },
    { bg: "bg-purple-100", text: "text-purple-800" },
    { bg: "bg-pink-100", text: "text-pink-800" },
    { bg: "bg-indigo-100", text: "text-indigo-800" },
    { bg: "bg-gray-100", text: "text-gray-800" },
  ];
  
  // Simple hash function to get deterministic colors based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Select a color pair based on the hash
  const index = Math.abs(hash) % colorPairs.length;
  return colorPairs[index];
};
