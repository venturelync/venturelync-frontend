import { Search, Bell, Mail, LogOut, Home } from "lucide-react";

export function TopNav({ profile }) {
  return (
    <nav className="fixed top-0 z-40 w-full border-b border-gray-100 bg-white/80 px-6 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <div className="flex items-center gap-8">
          <a
            href="/dashboard"
            className="text-xl font-black uppercase tracking-tighter text-[#00008B] hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <div className="bg-[#00008B] p-1 rounded-lg">
              <Home size={20} className="text-white" />
            </div>
            VentureLync
          </a>
          <div className="relative hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              placeholder="Search signal..."
              className="w-64 rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#00008B]/20"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative text-gray-500 hover:text-[#00008B]">
            <Bell size={22} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <button className="text-gray-500 hover:text-[#00008B]">
            <Mail size={22} />
          </button>

          <button
            onClick={() => (window.location.href = "/account/logout")}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut size={22} />
            <span className="hidden sm:inline text-xs font-black uppercase">
              Logout
            </span>
          </button>

          <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
            <div className="text-right">
              <div className="text-xs font-black uppercase text-gray-400">
                Level {profile.level}
              </div>
              <div className="text-sm font-black text-[#00008B]">
                {profile.xp} XP
              </div>
            </div>
            <div className="relative h-10 w-10">
              <svg className="h-full w-full -rotate-90 transform">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-gray-100"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={113}
                  strokeDashoffset={113 - (113 * (profile.xp % 100)) / 100}
                  className="text-[#00008B] transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-7 w-7 rounded-full bg-[#00008B] text-[10px] font-black text-white flex items-center justify-center">
                  {profile.name?.[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
