import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, NewsImage } from "@/lib/types";

export async function uploadNewsImages(
  supabase: SupabaseClient<Database>,
  files: File[]
): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("news-images")
      .upload(path, file, { upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from("news-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

export async function addNewsImages(
  supabase: SupabaseClient<Database>,
  newsId: string,
  urls: string[],
  startOrder: number
): Promise<void> {
  if (urls.length === 0) return;

  const rows = urls.map((image_url, i) => ({
    news_id: newsId,
    image_url,
    sort_order: startOrder + i,
  }));

  const { error } = await supabase.from("news_images").insert(rows);
  if (error) throw error;
}

export async function deleteNewsImage(
  supabase: SupabaseClient<Database>,
  imageId: string
): Promise<void> {
  const { error } = await supabase
    .from("news_images")
    .delete()
    .eq("id", imageId);
  if (error) throw error;
}

export async function getNewsImagesClient(
  supabase: SupabaseClient<Database>,
  newsId: string
): Promise<NewsImage[]> {
  const { data, error } = await supabase
    .from("news_images")
    .select("*")
    .eq("news_id", newsId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
