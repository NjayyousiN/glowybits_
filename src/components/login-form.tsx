"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { login } from "@/services/auth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Home, LogIn } from "lucide-react";
import { Label } from "./ui/label";
import Logo from "./logo";

// Login form schema creation
const loginSchema = z.object({
  email: z.string().email({
    message: "*Enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "*Password is required",
  }),
});

// Login form schema type
type UserLogin = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserLogin>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: UserLogin) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const { status } = await login(formData);

    if (status === 200) {
      toast.success("Login successful!");
      reset();
      router.push("/");
    } else {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-7 ">
      <Logo />

      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            id="email"
            type="text"
            disabled={isSubmitting}
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
            type="password"
            disabled={isSubmitting}
            placeholder="Enter your password"
            className={`${errors.password && "border-error"}`}
          />
          {errors.password && (
            <p className="text-sm text-error">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="flex justify-center items-center w-full text-title font-bold p-2 gap-x-1 rounded-md transition-all ease-in hover:bg-foreground hover:text-accent-contrast hover:cursor-pointer disabled:bg-disabled"
          disabled={isSubmitting}
        >
          {!isSubmitting && <LogIn width={20} height={20} />}
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="flex justify-between w-full">
        <p className="text-subtitle">Don't have an account?</p>
        <Link
          href="/register"
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
          Register
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
