import { type ActionFunctionArgs } from "react-router";
import { uploadToMinio } from "~/modules/minio.server";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { getUserID } from "~/modules/session.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const userId = await getUserID(request);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return Response.json({ error: "File not provided" }, { status: 400 });
    }
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return Response.json({ error: "File too large" }, { status: 413 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const fileStream = Readable.from(Buffer.from(arrayBuffer));
    const key = `${uuidv4()}-${file.name}`;
    const { key: storedKey } = await uploadToMinio(fileStream, key, file.size);

    return Response.json({ key: storedKey });
  } catch (e) {
    return Response.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

export async function loader() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
