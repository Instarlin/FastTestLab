import { type ActionFunctionArgs } from "react-router";
import { uploadToMinio } from "~/modules/minio.server";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "File not provided" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: "Only JPEG and PNG files are allowed" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: "File size must be less than 10MB" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileStream = Readable.from(Buffer.from(arrayBuffer));
    const key = `${uuidv4()}-${file.name}`;
    const url = await uploadToMinio(fileStream, key, file.type);

    return new Response(JSON.stringify({ url }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
