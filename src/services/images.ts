"use server";

import { createClient } from "@/utils/supabase/server";
import { ImageData } from "@/types/images";

// Maximum number of images per page
const LIMIT = 10;

export async function getImages({
  pageParam,
  query,
}: {
  pageParam: number;
  query?: string;
}): Promise<{
  images: ImageData[];
  currentPage: number;
  nextPage: number | null;
}> {
  console.log("Fetching images with query:", query, "at page:", pageParam);
  if (query) {
    return fetchWithQuery(query, pageParam);
  } else {
    return fetchWithoutQuery({ pageParam });
  }
}

export async function getUserImages() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw userError;

    if (!user) {
      console.log("Unauthorized access!");
      return [];
    }

    const { data, error } = await supabase
      .from("images")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((image: any) => ({
      id: image.id,
      title: image.title,
      tags: image.tags,
      url: image.url,
      metadata: image.metadata,
      is_private: image.is_private,
      is_deleted: image.is_deleted,
      owner_id: image.owner_id,
      created_at: image.created_at,
      updated_at: image.updated_at,
      storage_image_id: image.storage_image_id,
    }));
  } catch (error) {
    console.error("Error fetching user images:", error);
    return [];
  }
}

export async function uploadImage(formData: FormData) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw userError;

    if (!user) {
      console.log("Unauthorized access!");
      return { error: "User not authenticated", status: 401 };
    }

    const image = formData.get("image") as File;
    const title = formData.get("title") as string;
    const tags = formData.get("tags");
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const is_private = formData.get("is_private") as string;
    const filename = title || image.name;
    const random_hex = Math.random().toString(16).substring(2, 6);

    const { data, error } = await supabase.storage
      .from("images")
      .upload(`${user.id}/${random_hex}-${filename}`, image, {
        metadata: {
          tags,
          description,
          category,
          is_private,
          is_deleted: false,
        },
      });

    if (error) {
      return {
        message: "An error has occured when trying to upload image.",
        status: 500,
      };
    }
    return {
      message: data,
      status: 200,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { error: "Failed to upload image" };
  }
}

async function fetchWithoutQuery({ pageParam }: { pageParam: number }) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .range(pageParam, pageParam + LIMIT - 1);

    if (error) throw error;

    return {
      images: data.map((image: ImageData) => ({
        id: image.id,
        title: image.title,
        tags: image.tags,
        url: image.url,
        metadata: image.metadata,
        is_private: image.is_private,
        is_deleted: image.is_deleted,
        owner_id: image.owner_id,
        created_at: image.created_at,
        updated_at: image.updated_at,
        storage_image_id: image.storage_image_id,
      })),
      currentPage: pageParam,
      nextPage: data.length === LIMIT ? pageParam + LIMIT : null,
    };
  } catch (error) {
    console.error("Error fetching images:", error);
    return {
      images: [],
      currentPage: pageParam,
      nextPage: null,
    };
  }
}

async function fetchWithQuery(query: string, pageParam: number) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("images")
      .select()
      .ilike("title", `%${query}%`)
      .range(pageParam, pageParam + LIMIT - 1);

    if (error) throw error;

    return {
      images: data.map((image: ImageData) => ({
        id: image.id,
        title: image.title,
        tags: image.tags,
        url: image.url,
        metadata: image.metadata,
        is_private: image.is_private,
        is_deleted: image.is_deleted,
        owner_id: image.owner_id,
        created_at: image.created_at,
        updated_at: image.updated_at,
        storage_image_id: image.storage_image_id,
      })),
      currentPage: pageParam,
      nextPage: data.length === LIMIT ? pageParam + LIMIT : null,
    };
  } catch (error) {
    console.error("Error fetching images with query:", error);
    return { images: [], currentPage: pageParam, nextPage: null };
  }
}

export async function handleInteraction(
  image_id: string,
  interaction_type: string
) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error(userError);
      return { error: "User not authenticated", status: 401 };
    }

    const { data, error } = await supabase
      .from("interactions")
      .select()
      .eq("image_id", image_id);
    if (error) throw error;

    // No interactions on image
    if (data.length === 0) {
      const { status, error: insertError } = await supabase
        .from("interactions")
        .insert({
          user_id: user?.id,
          image_id: image_id,
          interaction_type: interaction_type,
        });
      if (insertError) throw insertError;
      return status;
    }

    // User removes interaction
    if (data[0].interaction_type === interaction_type) {
      const { status, error: deleteError } = await supabase
        .from("interactions")
        .delete()
        .eq("id", data[0].id);
      if (deleteError) throw deleteError;
      return status;
    } else {
      // New interaction added
      const { status, error: insertError } = await supabase
        .from("interactions")
        .insert({
          user_id: user?.id,
          image_id: image_id,
          interaction_type: interaction_type,
        });
      if (insertError) throw insertError;
      return status;
    }
  } catch (error) {
    console.error("Error handling interaction:", error);
    return { error: "Failed to process interaction" };
  }
}

export async function getDownloadURL(path: string) {
  const supabase = await createClient();
  try {
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(path, { download: true });
    return publicUrl;
  } catch (error) {
    console.error("Error getting download URL:", error);
    return null;
  }
}
