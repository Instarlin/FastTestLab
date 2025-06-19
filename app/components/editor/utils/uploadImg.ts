export async function uploadImage(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  const response = await fetch("/api/upload", { method: "POST", body: data });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  const { url } = await response.json();
  return url as string;
}
