import { uploadFileApiRequest } from "@/api-requests/upload-file";
import { handleErrorApi } from "@/lib/error";
import { useRef, useState } from "react";

export function useUploadFile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpLoading, setIsUpLoading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      try {
        setIsUpLoading(true);
        const imageUrl = (await uploadFileApiRequest.uploadFile(fileArray[0]))
          .payload.url;
        return imageUrl;
      } catch (error) {
        handleErrorApi({ error });
      } finally {
        setIsUpLoading(false);
      }
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();

  return { fileInputRef, handleFileChange, openFileDialog, isUpLoading };
}
