export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export const validateImageFile = (file: File): ImageValidationResult => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de arquivo não suportado. Use JPG, PNG ou WebP.'
    };
  }

  return { valid: true };
};

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const resizeImage = (base64: string, maxSizeInBytes: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      let quality = 0.9;
      let resizedBase64 = base64;

      const attemptResize = () => {
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        resizedBase64 = canvas.toDataURL('image/jpeg', quality);

        const sizeInBytes = Math.round((resizedBase64.length * 3) / 4);

        if (sizeInBytes > maxSizeInBytes && quality > 0.1) {
          quality -= 0.1;
          attemptResize();
        } else if (sizeInBytes > maxSizeInBytes && width > 800) {
          const scale = 0.9;
          width = Math.floor(width * scale);
          height = Math.floor(height * scale);
          quality = 0.9;
          attemptResize();
        } else {
          resolve(resizedBase64);
        }
      };

      attemptResize();
    };

    img.onerror = () => reject(new Error('Failed to load image'));
  });
};

export const processImageFile = async (file: File): Promise<string> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  let base64 = await convertToBase64(file);

  const sizeInBytes = Math.round((base64.length * 3) / 4);
  if (sizeInBytes > MAX_FILE_SIZE) {
    base64 = await resizeImage(base64, MAX_FILE_SIZE);
  }

  return base64;
};
