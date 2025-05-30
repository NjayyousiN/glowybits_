import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Logo } from "./logo";
import { Upload, LogIn, Compass, User } from "lucide-react";
import LogoutButton from "./logout-button";
import NavMenu from "./nav-menu";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <header className="p-7 bg-foreground drop-shadow-foreground drop-shadow-sm">
      <nav className="flex justify- items-center">
        <div className="grow">
          <Logo />
        </div>
        <div className="hidden md:flex justify-evenly items-center gap-x-10">
          {!user ? (
            <Link
              href="/login"
              className="flex items-center text-body font-bold p-4 gap-x-1 rounded-md transition-all ease-in hover:bg-background hover:text-title"
            >
              <LogIn width={20} height={20} />
              Login
            </Link>
          ) : (
            <LogoutButton />
          )}
          <Link
            href="/"
            className="flex items-center text-body font-bold p-4 gap-x-1 rounded-md transition-all ease-in hover:bg-background hover:text-title "
          >
            <Compass width={20} height={20} />
            Explore
          </Link>
          <Link
            href="/upload"
            className="flex items-center text-body font-bold p-4 gap-x-1 rounded-md hover:bg-background transition-all ease-in hover:text-title"
          >
            <Upload width={20} height={20} />
            Upload
          </Link>
          {user && (
            <Link
              href="/profile"
              className="flex items-center text-body font-bold p-4 gap-x-1 rounded-md hover:bg-background transition-all ease-in hover:text-title"
            >
              <User width={20} height={20} />
              Profile
            </Link>
          )}
        </div>
        {/* {Small Screen navigation menu} */}
        <div className="md:hidden">
          <NavMenu user={user} />
        </div>
      </nav>
    </header>
  );
}
