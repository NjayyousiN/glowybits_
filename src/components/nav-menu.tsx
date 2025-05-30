import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { SquareMenu, LogIn, UserRound, Compass, Upload } from "lucide-react";
import LogoutButton from "./logout-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavMenuProps {
  user: User | null;
}

export default function NavMenu({ user }: NavMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="font-bold p-4 gap-x-1 rounded-md hover:bg-background transition-all ease-in hover:text-title"
          aria-label="Menu button"
        >
          <SquareMenu width={20} height={20} className="text-body" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-max bg-foreground mx-3 md:hidden">
        <div className="space-y-2">
          {!user ? (
            <Link
              href="/login"
              className="flex items-center text-body font-bold text-sm p-2 gap-x-1 rounded-md transition-all ease-in hover:bg-background hover:text-title"
            >
              <LogIn width={20} height={20} />
              Login
            </Link>
          ) : (
            <LogoutButton />
          )}
          <Link
            href="/"
            className="flex items-center text-body font-bold text-sm p-2 gap-x-1 rounded-md transition-all ease-in hover:bg-background hover:text-title "
          >
            <Compass width={20} height={20} />
            Explore
          </Link>
          <Link
            href="/upload"
            className="flex items-center text-body font-bold text-sm p-2 gap-x-1 rounded-md hover:bg-background transition-all ease-in hover:text-title"
          >
            <Upload width={20} height={20} />
            Upload
          </Link>
          {user && (
            <MenuItem>
              <Link
                href="/profile"
                className="flex items-center text-body font-bold p-4 gap-x-1 rounded-md hover:bg-background transition-all ease-in hover:text-title"
              >
                <UserRound width={20} height={20} />
                Profile
              </Link>
            </MenuItem>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
