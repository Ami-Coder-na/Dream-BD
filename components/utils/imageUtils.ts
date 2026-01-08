
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

/**
 * Client-side image compression to save database space while maintaining high quality.
 */
export const compressImage = (file: File, maxSize: number = 1200, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          reject(new Error('Canvas context not available'));
        }
      };
      img.onerror = () => reject(new Error('Image load failed'));
    };
    reader.onerror = () => reject(new Error('File read failed'));
  });
};
