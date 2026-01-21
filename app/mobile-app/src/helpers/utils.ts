import { API_URL } from "@/constants/api_keys";
import { File, Paths } from "expo-file-system/next";
import moment from "moment";
import { Log } from "./Logger";

export const formatDateOrTime = (date: Date | undefined, format: string) => {
  return date ? moment(date).format(format) : "";
};

export const base64ToBlob = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
};

export const uploadImage = async (uri: string) => {
  const sourceFile = new File(uri);
  try {
    // Check if the URI is already a URL (starts with http/https)
    if (uri.startsWith("http://") || uri.startsWith("https://")) {
      return uri;
    }

    Log("Processing URI:", uri);

    // Check if file exists before uploading
    const fileInfo = sourceFile.info();
    Log("File info:", fileInfo);

    if (!fileInfo.exists) {
      Log("File does not exist:", uri);
      throw new Error(`File does not exist: ${uri}`);
    }

    // Try to copy the file to a temporary location if it's in cache
    let uploadUri = uri;
    let fileName = uri.split("/").pop() || `upload_${Date.now()}.jpg`;

    if (uri.includes("/cache/")) {
      // Create cache directory if it doesn't exist
      try {
        Paths.cache.create();
      } catch (error: any) {
        // Ignore error if directory already exists
        if (!error?.message?.includes("already exists")) {
          throw error;
        }
      }

      const tempFile = new File(Paths.cache, `temp_${fileName}`);

      Log("Copying file from cache to temp location");
      sourceFile.copy(tempFile);

      uploadUri = tempFile.uri;
      fileName = `temp_${fileName}`;
      Log("File copied to:", uploadUri);
    }

    Log("Uploading file:", uploadUri);

    // Use fetch + FormData for multipart upload
    const formData = new FormData();
    formData.append(
      "fileToUpload",
      {
        uri: uploadUri,
        name: fileName,
        type: "image/jpeg",
      } as any
    );

    const response = await fetch(`${API_URL}/common/upload-file`, {
      method: "POST",
      body: formData as any,
    });

    if (!response.ok) {
      const text = await response.text();
      Log("Upload failed:", response.status, text);
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const json = await response.json();
    const { data } = json;
    return data;
  } catch (error) {
    Log("Error in uploadImage", error);
    throw error;
  }
};
