
export const getOptimizedImageUrl = (url: string, width: number = 800): string => {
  if (!url) return 'https://placehold.co/600x400?text=No+Image';
  
  // Optimize Unsplash URLs
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    // Add optimization params:
    // auto=format: Auto selects WebP/AVIF if supported
    // fit=crop: Smart cropping
    // q=80: Balanced quality/size
    // w={width}: Resize to needed width
    // fm=webp: Force WebP for better compression
    return `${baseUrl}?auto=format&fit=crop&q=80&w=${width}&fm=webp`;
  }
  
  return url;
};
