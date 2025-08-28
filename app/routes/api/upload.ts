import { type ActionFunctionArgs } from "react-router";
import { uploadToMinio } from "~/modules/minio.server";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return new Response(JSON.stringify({ error: "File not provided" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }
    const arrayBuffer = await file.arrayBuffer();
    const fileStream = Readable.from(Buffer.from(arrayBuffer));
    const key = `${uuidv4()}-${file.name}`;
    const { key: storedKey } = await uploadToMinio(fileStream, key, file.size);

    return new Response(JSON.stringify({ key: storedKey }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to upload file" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}

export async function loader() {
  return new Response(JSON.stringify({ message: "forbidden" }), {
    status: 403, headers: { "Content-Type": "application/json" },
  });
}
