
/**
 * Utility functions for avatar generation and styling
 */

// Colors for avatar backgrounds
const backgroundColors = [
  'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500'
];

// Colors for avatar text
const textColors = [
  'text-white', 'text-gray-100', 'text-gray-800'
];

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
 * Generate a consistent color pair based on a name string
 * @param name The name to generate colors for
 * @returns Object with background and text color classes
 */
export const getAvatarColors = (name: string): { bg: string, text: string } => {
  if (!name) {
    return { bg: 'bg-gray-500', text: 'text-white' };
  }
  
  // Use the sum of character codes as a simple hash
  const hash = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  // Select colors based on the hash
  const bgColor = backgroundColors[hash % backgroundColors.length];
  const txtColor = textColors[hash % textColors.length];
  
  return { bg: bgColor, text: txtColor };
};
