import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function NavBar() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="flex items-center justify-between bg-white p-4">
      <div className="flex gap-4 items-center">
        <img className="h-6 w-6 rounded" src="icon.png" alt="Lernote Logo" />
        <h1 className="text-lg font-bold">Lernote</h1>
      </div>
      <ul className="flex gap-4">
        {user == null ? (
          <li>
            <button
              className="rounded border border-black px-3 py-1 font-semibold duration-200 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white"
              onClick={() => void signIn()}
            >
              Sign In
            </button>
          </li>
        ) : (
          <li>
            <button
              className="rounded border border-black px-3 py-1 font-semibold duration-200 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white"
              onClick={() => void signOut()}
            >
              Sign Out
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
