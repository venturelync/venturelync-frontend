"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import useUser from "@/utils/useUser";
import { useDashboard } from "@/hooks/useDashboard";
import { LeftPanel } from "@/components/Dashboard/LeftPanel";
import { MainFeed } from "@/components/Dashboard/MainFeed";
import { RightPanel } from "@/components/Dashboard/RightPanel";
import { TopNav } from "@/components/Dashboard/TopNav";
import { GamificationOverlay } from "@/components/Dashboard/GamificationOverlay";
import { RedistributionModal } from "@/components/Dashboard/RedistributionModal";
import { Zap } from "lucide-react";

export default function VentureLyncDashboard() {
  const { data: user, loading: userLoading } = useUser();
  const {
    profile,
    posts,
    postContent,
    setPostContent,
    isPosting,
    handlePost,
    gamificationEvent,
    setGamificationEvent,
    showRedistribution,
    setShowRedistribution,
    aiVersions,
    isGeneratingAi,
    generateAiVersions,
    leaderboard,
    suggestedUsers,
    trendingPosts,
    groups,
    setLeaderboardFilter,
  } = useDashboard(user, userLoading);

  // Redirect logic
  useEffect(() => {
    if (!userLoading && user) {
      // Only redirect if we are absolutely sure about the status
      // If onboarding_completed is explicitly false or undefined, go to onboarding
      if (user.onboarding_completed !== true) {
        window.location.href = "/onboarding";
      } else if (user.first_post_completed !== true) {
        window.location.href = "/first-post";
      }
    }
  }, [user, userLoading]);

  // Show loading if user is loading OR if we have a user but no profile yet (and we're not redirecting)
  const isRedirecting =
    user &&
    (user.onboarding_completed !== true || user.first_post_completed !== true);

  if (userLoading || (!profile && !isRedirecting)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Zap size={48} className="text-[#00008B]" fill="#00008B" />
        </motion.div>
      </div>
    );
  }

  // If we are redirecting, show a simple message or nothing to avoid layout shift
  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm font-black uppercase opacity-60">
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 selection:bg-blue-100">
      <Toaster position="top-center" richColors />
      <TopNav profile={profile} />

      {/* Gamification Overlay */}
      <AnimatePresence>
        {gamificationEvent && (
          <GamificationOverlay
            event={gamificationEvent}
            onComplete={() => setGamificationEvent(null)}
          />
        )}
      </AnimatePresence>

      {/* AI Redistribution Modal */}
      <AnimatePresence>
        {showRedistribution && (
          <RedistributionModal
            show={showRedistribution}
            onClose={() => setShowRedistribution(false)}
            aiVersions={aiVersions}
            isGeneratingAi={isGeneratingAi}
            onGenerate={generateAiVersions}
            postContent={postContent}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto flex max-w-[1440px] justify-center gap-6 px-4 pt-24 pb-6">
        {/* Left Panel - Fixed Width */}
        <aside className="hidden w-[300px] lg:block">
          <div className="sticky top-24">
            <LeftPanel profile={profile} />
          </div>
        </aside>

        {/* Main Feed - Flexible */}
        <main className="w-full max-w-[640px] flex-1">
          <MainFeed
            profile={profile}
            posts={posts}
            postContent={postContent}
            setPostContent={setPostContent}
            isPosting={isPosting}
            onPost={handlePost}
          />
        </main>

        {/* Right Panel - Fixed Width */}
        <aside className="hidden w-[340px] xl:block">
          <div className="sticky top-24">
            <RightPanel
              leaderboard={leaderboard}
              suggestedUsers={suggestedUsers}
              trendingPosts={trendingPosts}
              onFilterChange={setLeaderboardFilter}
            />
          </div>
        </aside>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #F8F9FA;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
}
