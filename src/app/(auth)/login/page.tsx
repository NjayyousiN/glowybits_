import Image from "next/image";
import LoginForm from "@/components/login-form";
import { Home } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center p-8">
        <LoginForm />
      </div>
      <div className="hidden md:block relative w-full h-full">
        <Image
          src={"/login-image.jpg"}
          alt={"Login Image"}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
