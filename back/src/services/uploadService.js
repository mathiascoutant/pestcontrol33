import axios from "axios";
import FormData from "form-data";
import { MEDIA_CONFIG } from "../config/mediaConfig.js";

const generateRandomSixDigits = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const uploadFile = async (file, productId, fileIndex) => {
  try {
    const extension = file.originalname.split(".").pop();

    const randomNum = generateRandomSixDigits();

    const newFileName = `${productId}_${fileIndex}_${randomNum}.${extension}`;

    const formData = new FormData();
    formData.append("file", file.buffer, newFileName);

    const isImage = file.mimetype.startsWith("image/");
    const uploadPath = isImage
      ? MEDIA_CONFIG.PATHS.IMAGES
      : MEDIA_CONFIG.PATHS.VIDEOS;

    const response = await axios.post(
      `${MEDIA_CONFIG.BASE_URL}${uploadPath}/upload.php`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Échec de l'upload");
    }

    return {
      success: true,
      url: `${MEDIA_CONFIG.BASE_URL}${uploadPath}/${response.data.filename}`,
      filename: response.data.filename,
    };
  } catch (error) {
    console.error("Erreur upload:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
