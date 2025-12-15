
/**
 * Optimizes an image file by resizing and compressing it using the HTML5 Canvas API.
 * @param file The original File object
 * @param maxWidth Maximum width for the output image
 * @param quality JPEG quality (0 to 1)
 * @returns Promise<Blob>
 */
export const optimizeImage = (
    file: File, 
    maxWidth: number = 1920, 
    quality: number = 0.85
  ): Promise<Blob> => {
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
  
          // Calculate new dimensions
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
  
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
  
          // Smoother resizing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas compression failed'));
              }
            },
            'image/jpeg',
            quality
          );
        };
  
        img.onerror = (err) => reject(err);
      };
  
      reader.onerror = (err) => reject(err);
    });
  };
