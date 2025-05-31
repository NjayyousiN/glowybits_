import Image from "next/image";
import RegisterForm from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center p-8">
        <RegisterForm />
      </div>
      <div className="hidden md:block relative w-full h-full">
        <Image
          src={"/register-image.jpg"}
          alt={"Register Image"}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
