export async function uploadFileToCloudinary(file: File) {
  if (!file) {
    throw new Error("Please select a file to upload");
  }
  console.log(file);

  try {
    const response = await fetch("/api/signature");
    const data = await response.json();
    console.log("data di utils.ts", data);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append("timestamp", data.timestamp);
    formData.append("signature", data.signature);

    let resourceType = "auto";
    if (file.type.startsWith("image/")) {
      resourceType = "image";
    } else if (file.type.startsWith("video/")) {
      resourceType = "video";
    } else {
      resourceType = "raw";
    }
    formData.append("resource_type", resourceType);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const uploadResult = await uploadResponse.json();
    console.log(uploadResult);

    if (uploadResponse.ok) {
      return uploadResult.secure_url;
    } else {
      throw new Error(uploadResult.error.message || "Error uploading file");
    }
  } catch (err) {
    console.error("Error uploading file:", err);
    throw new Error("Error uploading file");
  }
}
