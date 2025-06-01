import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Upload, LogIn, Compass, User, Sparkles } from "lucide-react";
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
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold"
        >
          <div className="bg-gradient-to-br from-accent to-accent-hover p-1.5 rounded-lg shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent font-bold">
            GlowyBits
          </span>
        </Link>
        <div className="hidden md:flex justify-evenly items-center gap-x-10 ml-auto">
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
