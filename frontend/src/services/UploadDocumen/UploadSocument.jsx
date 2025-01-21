import ApiCall from "../../utility/ApiCall";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const uploadDocument = async (uploadDocumentPayload) => {
  try {
    const response = await ApiCall({
      method: "POST",
      url: `${baseURL}/uploadDocument`,
      uploadDocumentPayload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
