"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      return {
        message: "Invalid Credentials",
        status: 401,
      };
    }

    revalidatePath("/", "layout");
    return {
      message: "Login successful",
      status: 200,
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      message: "API error occured while trying to sign in.",
      status: 500,
    };
  }
}

export async function registerUser(formData: FormData) {
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
    if (error) {
      return {
        message: "Failed to register user, user already exists",
        status: 422,
      };
    }

    revalidatePath("/", "layout");
    return {
      message: "User registered successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      message: "API error occured while trying to sign up.",
      status: 500,
    };
  }
}

export async function logOut() {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error logging out:", error);
    return {
      message: "API error occured while trying to sign out",
      status: 500,
    };
  }
}
