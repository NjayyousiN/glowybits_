"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logOut } from "@/services/auth";
import { toast } from "sonner";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        setIsLoading(true);
        const error = await logOut();
        if (error) {
          toast.error("Logout failed. Check your network connection.");
        }
        toast.success("You have been logged out.");
        setIsLoading(false);
        router.push("/");
      }}
      disabled={isLoading}
      className="flex items-center text-body font-bold text-sm p-2 gap-x-1 rounded-md transition-all ease-in hover:bg-background hover:cursor-pointer hover:text-title disabled:bg-disabled disabled:cursor-not-allowed disabled:text-title md:text-md md:p-4"
    >
      <LogOut width={20} height={20} />
      Logout
    </button>
  );
}
