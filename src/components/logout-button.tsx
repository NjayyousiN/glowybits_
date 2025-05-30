"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { logOut } from "@/services/auth";
import { toast } from "sonner";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <button
      onClick={async () => {
        setIsLoading(true);
        const error = await logOut();
        if (error) {
          toast.error("Logout failed. Check your network connection.");
        }
        setIsLoading(false);
      }}
      disabled={isLoading}
      className="flex items-center text-body font-bold text-sm p-2 gap-x-1 rounded-md transition-all ease-in hover:bg-background hover:text-title md:text-md md:p-4"
    >
      <LogOut width={20} height={20} />
      Logout
    </button>
  );
}
