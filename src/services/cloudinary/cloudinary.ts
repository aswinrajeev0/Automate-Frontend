import axios from "axios";
// import { authApi } from "../../api/auth.axios";
import { toast } from "sonner";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
// const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;


export const uploadImage = async (file: File | null): Promise<string | null> => {
    try {

        // const response = await authApi.get("/generate-signature");
        // const signature = response.data.signature;
        // const timestamp = response.data.timestamp;

        if(!file) return null

        const formData = new FormData();
        formData.append("file", file);
        // formData.append("api_key", CLOUDINARY_API_KEY);
        // formData.append("timestamp", timestamp);
        // formData.append("signature", signature);
        formData.append("upload_preset", UPLOAD_PRESET);

        const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
        return cloudinaryResponse.data.secure_url;

    } catch (error) {
        console.error("Error uploading to cloudinary", error);
        toast.error("Error uploading image");
        throw error;
    }
}