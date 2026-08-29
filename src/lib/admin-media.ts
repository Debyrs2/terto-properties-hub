import { supabase } from "@/integrations/supabase/client";

const BUCKET = "property-media";
const TEN_YEARS = 60 * 60 * 24 * 3650;
const MAX_EDGE = 1920;

async function compressToWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82),
  );
  if (!blob) throw new Error("Falha ao processar a imagem");
  return blob;
}

export async function uploadPhoto(propertyId: string, file: File) {
  const blob = await compressToWebp(file);
  const path = `${propertyId}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/webp", upsert: false });
  if (error) throw new Error(error.message);
  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data) throw new Error(signError?.message ?? "Falha ao gerar URL");
  return { url: data.signedUrl, storage_path: path };
}

export async function removeStorageFile(path: string | null) {
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
