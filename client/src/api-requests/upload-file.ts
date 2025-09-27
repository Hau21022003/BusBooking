import http from "@/lib/http";

export const uploadFileApiRequest = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post<{url:string}>("/upload", formData);
  },
};
