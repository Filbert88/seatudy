import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
const apiKey = process.env.CLOUDINARY_API_KEY!;
const apiSecret = process.env.CLOUDINARY_API_SECRET!;
console.log("name:", cloudName);
if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Cloudinary environment variables are not set");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function GET(): Promise<NextResponse> {
  console.log("masuk ga");
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params_to_sign = { timestamp };

    const signature = cloudinary.utils.api_sign_request(
      params_to_sign,
      apiSecret
    );
    console.log("timestamp: ", timestamp);
    return NextResponse.json({ signature, timestamp }, { status: 200 });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
