"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerUser } from "@/services/auth";
import { toast } from "sonner";
import { Home, UserPen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import Logo from "./logo";

// Registeration form schema creation
const registerSchema = z.object({
  username: z.string().min(3, {
    message: "*Username must be at least 3 characters long",
  }),
  full_name: z.string().min(3, {
    message: "*Enter your name",
  }),
  email: z.string().email({
    message: "*Enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "*Password must be at least 8 characters long",
  }),
  bio: z.string().optional(),
});

// Registeration form schema type
type UserRegister = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserRegister>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data: UserRegister) => {
    const parsedData = registerSchema.safeParse(data);
    if (parsedData.success) {
      // Input is valid, create formData object and send to backend
      const formData = new FormData();

      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("full_name", data.full_name);
      formData.append("username", data.username);
      formData.append("bio", data.bio || "");

      const { status } = await registerUser(formData);

      if (status === 200) {
        toast.success("Registration successful! Welcome to GlowyBits");
        reset();
        router.push("/");
      } else {
        toast.message("Registeration failed", {
          description: "Email already exists.",
        });
      }
    } else {
      // Input invalid
      toast.error("Please fill all required fields.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-7 w-full">
      <Logo />

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-6 w-full"
      >
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            id="email"
            disabled={isSubmitting}
            tabIndex={isSubmitting ? -1 : 0}
            aria-disabled={isSubmitting}
            type="text"
            placeholder="user@example.com"
            className={`${errors.email && "border-error"}`}
          />
          {errors.email && (
            <p className="text-sm text-error">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            id="password"
            disabled={isSubmitting}
            tabIndex={isSubmitting ? -1 : 0}
            aria-disabled={isSubmitting}
            type="password"
            placeholder="Min. 8 characters long"
            className={`${errors.password && "border-error"}`}
          />
          {errors.password && (
            <p className="text-sm text-error">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            {...register("full_name")}
            id="full_name"
            disabled={isSubmitting}
            tabIndex={isSubmitting ? -1 : 0}
            aria-disabled={isSubmitting}
            type="text"
            className={`${errors.full_name && "border-error"}`}
            placeholder="e.g., Mohammed Ahmad"
          />
          {errors.full_name && (
            <p className="text-sm text-error">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            {...register("username")}
            id="username"
            disabled={isSubmitting}
            tabIndex={isSubmitting ? -1 : 0}
            aria-disabled={isSubmitting}
            type="text"
            className={`${errors.username && "border-error"}`}
            placeholder="Display Name"
          />
          {errors.username && (
            <p className="text-sm text-error">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            {...register("bio")}
            id="bio"
            disabled={isSubmitting}
            tabIndex={isSubmitting ? -1 : 0}
            aria-disabled={isSubmitting}
            className={`min-h-[100px] resize-none ${
              errors.bio && "border-error"
            }`}
            placeholder="Tell us about yourself"
          />
          {errors.bio && (
            <p className="text-sm text-error">{errors.bio.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="flex justify-center items-center w-full text-title font-bold p-2 gap-x-1 rounded-md transition-all ease-in hover:bg-foreground hover:text-accent-contrast hover:cursor-pointer disabled:bg-disabled"
          disabled={isSubmitting}
          tabIndex={isSubmitting ? -1 : 0}
          aria-disabled={isSubmitting}
        >
          {!isSubmitting && <UserPen width={20} height={20} />}
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="flex justify-between w-full">
        <p>Already have an account?</p>
        <Link
          href="/login"
          className={`font-bold ${
            isSubmitting
              ? "text-disabled hover:no-underline hover:cursor-not-allowed"
              : "text-accent hover:underline focus:underline "
          }`}
          tabIndex={isSubmitting ? -1 : 0}
          aria-disabled={isSubmitting}
          onClick={(e) => {
            if (isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          Login
        </Link>
      </div>
      <Link
        href="/"
        className={`flex justify-center items-center w-full text-accent-contrast  font-bold p-2 gap-x-1 rounded-md transition-all ease-in  ${
          isSubmitting
            ? "bg-disabled hover:cursor-not-allowed"
            : "bg-foreground hover:cursor-pointer"
        }`}
        tabIndex={isSubmitting ? -1 : 0}
        aria-disabled={isSubmitting}
        onClick={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <Home width={20} height={20} />
        Back to home
      </Link>
    </div>
  );
}
