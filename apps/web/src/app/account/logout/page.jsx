import useAuth from "@/utils/useAuth";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#00008B] via-[#1a1a8b] to-[#000066]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 blur-3xl animate-pulse" />
        <div
          className="absolute right-10 bottom-40 h-80 w-80 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border-2 border-white/20 bg-white/5 p-10 shadow-2xl backdrop-blur-md text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
          <LogOut className="h-10 w-10 text-white" />
        </div>
        <h1 className="mb-4 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
          Signing Out?
        </h1>
        <p className="mb-8 text-white/70 font-bold">
          We'll miss you! Come back soon to keep your streak alive 🔥
        </p>

        <button
          onClick={handleSignOut}
          className="w-full rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 px-4 py-4 text-lg font-black text-white shadow-2xl transition-all hover:scale-105 hover:shadow-yellow-500/50"
        >
          Yes, Sign Me Out
        </button>

        <a
          href="/dashboard"
          className="mt-4 block text-center text-sm font-black text-cyan-300 hover:text-cyan-200"
        >
          Actually, take me back!
        </a>
      </div>
    </div>
  );
}
