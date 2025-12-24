import { FileText } from "lucide-react";

export function RightSidebar({ posts, onShowMIS }) {
  const trendingTopics = [
    { tag: "#BuildingInPublic", posts: "1.2k" },
    { tag: "#VentureLync", posts: "850" },
    { tag: "#FounderReality", posts: "640" },
  ];

  return (
    <aside className="fixed right-0 h-[calc(100vh-80px)] w-80 overflow-y-auto px-6 py-6 hidden xl:block">
      <div className="space-y-6">
        <div className="rounded-2xl bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-black uppercase tracking-tighter">
            Trending Signal
          </h3>
          <div className="space-y-4">
            {trendingTopics.map((item) => (
              <div key={item.tag} className="group cursor-pointer">
                <div className="text-xs font-bold text-gray-400">
                  Trending in Venture
                </div>
                <div className="font-black text-gray-900 group-hover:underline">
                  {item.tag}
                </div>
                <div className="text-xs font-bold text-gray-400">
                  {item.posts} posts
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-black uppercase tracking-tighter">
            Top Founders
          </h3>
          <div className="space-y-4">
            {posts.slice(0, 3).map((post, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-black text-[#00008B]">
                    {post.name?.[0]}
                  </div>
                  <div>
                    <div className="text-sm font-black">{post.name}</div>
                    <div className="text-xs font-bold text-gray-400">
                      Level {post.level}
                    </div>
                  </div>
                </div>
                <button className="rounded-full bg-black px-4 py-1 text-xs font-black text-white hover:bg-gray-800">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
          <div className="mb-2 flex justify-center">
            <div className="rounded-full bg-blue-50 p-3 text-[#00008B]">
              <FileText size={24} />
            </div>
          </div>
          <h4 className="mb-1 font-black uppercase">Investor MIS</h4>
          <p className="mb-4 text-xs font-bold text-gray-400">
            Convert your progress into a professional report.
          </p>
          <button
            onClick={onShowMIS}
            className="w-full rounded-lg border-2 border-[#00008B] py-2 text-xs font-black uppercase text-[#00008B] hover:bg-[#00008B] hover:text-white transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>
    </aside>
  );
}
