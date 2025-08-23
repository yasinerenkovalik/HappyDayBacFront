import { API_CONFIG } from './constants';

export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/image/placeholder.jpg';
  
  // Eğer tam URL ise olduğu gibi döndür
  if (imagePath.startsWith('http')) return imagePath;
  
  // Relative path ise base URL ile birleştir
  return `${API_CONFIG.IMAGE_BASE_URL}${imagePath}`;
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Sadece JPEG, PNG ve WebP formatları desteklenmektedir.'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Dosya boyutu 5MB\'dan küçük olmalıdır.'
    };
  }
  
  return { isValid: true };
};

export const compressImage = async (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};