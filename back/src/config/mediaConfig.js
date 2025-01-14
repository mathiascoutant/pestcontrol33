export const MEDIA_CONFIG = {
  BASE_URL: "https://pestcontrol33.com",
  PATHS: {
    IMAGES: "/media",
    VIDEOS: "/media",
  },
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ["image/jpeg", "image/png", "image/webp"],
    VIDEOS: ["video/mp4", "video/webm"],
  },
};
