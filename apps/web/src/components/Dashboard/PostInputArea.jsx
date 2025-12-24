import { Brain, Gamepad2 } from "lucide-react";

export function PostInputArea({
  profile,
  postContent,
  setPostContent,
  onShowPostModal,
}) {
  return (
    <div className="border-b border-gray-100 p-6">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center font-black text-[#00008B]">
          {profile.name?.[0]}
        </div>
        <div className="flex-1">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's the real update today? No fluff."
            className="w-full resize-none border-none bg-transparent text-xl font-medium placeholder-gray-300 outline-none"
            rows={3}
          />
          <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
            <div className="flex gap-2">
              <button className="rounded-full p-2 text-[#00008B] hover:bg-blue-50">
                <Brain size={20} />
              </button>
              <button className="rounded-full p-2 text-[#00008B] hover:bg-blue-50">
                <Gamepad2 size={20} />
              </button>
            </div>
            <button
              onClick={onShowPostModal}
              disabled={!postContent.trim()}
              className="rounded-full bg-[#00008B] px-8 py-2.5 text-sm font-black uppercase text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-105 hover:shadow-blue-900/40 disabled:opacity-50"
            >
              Post Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
