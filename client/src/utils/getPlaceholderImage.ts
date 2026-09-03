/**
 * Generates a placeholder image URL using the free Lorem Picsum API.
 * 
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param seed - Optional seed string for deterministic images across re-renders
 * @returns Fully qualified image URL
 */
export function getPlaceholderImage(width: number, height: number, seed?: string | number): string {
  const safeW = Math.max(1, Math.round(width));
  const safeH = Math.max(1, Math.round(height));

  if (seed !== undefined && seed !== null && String(seed).trim() !== "") {
    const encodedSeed = encodeURIComponent(String(seed).trim());
    return `https://picsum.photos/seed/${encodedSeed}/${safeW}/${safeH}`;
  }

  return `https://picsum.photos/${safeW}/${safeH}`;
}

export default getPlaceholderImage;
