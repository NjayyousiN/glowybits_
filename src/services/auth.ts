"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) throw error;

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    console.error("Error logging in:", error);
    return { error: "Invalid email or password" };
  }
}

export async function register(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    bio: formData.get("bio") as string,
    username: formData.get("username") as string,
  };

  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          bio: data.bio,
          username: data.username,
        },
      },
    });
    if (error) throw error;

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    console.error("Error registering user:", error);
    return { error: "Failed to register user" };
  }
}

export async function logOut() {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    console.error("Error logging out:", error);
    return { error: `Failed to log out: ${error}` };
  }
}
