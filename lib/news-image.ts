export const NEWS_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
export const NEWS_IMAGE_MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function newsImageValidationError(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return `الصورة ${file.name} ليست بصيغة JPG أو PNG أو WebP.`;
  }
  if (file.size > NEWS_IMAGE_MAX_BYTES) {
    return `حجم الصورة ${file.name} يتجاوز 8 ميجابايت.`;
  }
  return null;
}

export function assertValidNewsImage(file: File): void {
  const validationError = newsImageValidationError(file);
  if (validationError) throw new Error(validationError);
}
