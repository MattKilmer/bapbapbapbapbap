/**
 * Gets the appropriate profile image URL, prioritizing custom images over OAuth images
 */
export function getProfileImageUrl(customImage?: string | null, image?: string | null): string | null {
  return customImage || image || null;
}

/**
 * Gets the fallback avatar text for a user
 */
export function getAvatarFallback(name?: string | null, username?: string | null, email?: string): string {
  return (name || username || email)?.[0]?.toUpperCase() || 'U';
}