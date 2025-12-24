import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useDashboard(user, userLoading) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [gamificationEvent, setGamificationEvent] = useState(null);
  const [showRedistribution, setShowRedistribution] = useState(false);
  const [aiVersions, setAiVersions] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Discovery Data
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardFilter, setLeaderboardFilter] = useState("global");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    } else if (user) {
      // If useUser already fetched the profile, use it
      if (user.onboarding_completed) {
        setProfile(user);
      } else {
        fetchProfile();
      }
      fetchFeed();
      fetchDiscoveryData();
    }
  }, [user, userLoading]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      } else if (res.status === 404) {
        // Profile not found is expected for new users
        setProfile(null);
      }
    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  const fetchFeed = async () => {
    try {
      const res = await fetch("/api/feed");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Feed fetch failed", err);
    }
  };

  const fetchDiscoveryData = async (filter = "global") => {
    try {
      // Fetch leaderboard with filter
      let url = "/api/leaderboard";
      if (filter === "local" && profile?.country) {
        url += `?country=${profile.country}`;
      } else if (filter !== "global") {
        url += `?type=${filter}`;
      }

      const lbRes = await fetch(url);
      if (lbRes.ok) {
        const lbData = await lbRes.json();
        setLeaderboard(lbData.leaderboard);
      }

      // Fetch real suggested users
      const suggestedRes = await fetch("/api/profile/suggested");
      if (suggestedRes.ok) {
        const suggestedData = await suggestedRes.json();
        setSuggestedUsers(suggestedData.suggestedUsers);
      }

      // Mocking other discovery data for now
      setTrendingPosts([
        { id: 1, content: "Just hit 1000 users! 🚀", engagement: 42 },
        {
          id: 2,
          content: "Why consistency beats talent every time.",
          engagement: 38,
        },
      ]);
      setGroups([
        { id: 1, name: "SaaS Founders", members: 1200 },
        { id: 2, name: "Build in Public", members: 850 },
      ]);
    } catch (err) {
      console.error("Discovery data fetch failed", err);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchDiscoveryData(leaderboardFilter);
    }
  }, [leaderboardFilter, profile]);

  const handlePost = async (e) => {
    if (e) e.preventDefault();
    if (!postContent.trim()) return;

    setIsPosting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: postContent }),
      });

      if (res.ok) {
        const data = await res.json();

        // Trigger Gamification
        setGamificationEvent({
          type: "POST_SUCCESS",
          xpEarned: data.xpEarned,
          newStreak: data.newStreak,
          badgeUnlocked: data.badgeUnlocked,
        });

        // Reset input
        setPostContent("");

        // Refresh data
        fetchProfile();
        fetchFeed();

        // Show redistribution modal after a short delay
        setTimeout(() => {
          setShowRedistribution(true);
        }, 3000);

        return true;
      }
    } catch (error) {
      toast.error("Failed to publish log");
    } finally {
      setIsPosting(false);
    }
    return false;
  };

  const generateAiVersions = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a world-class social media strategist for startup founders. Adapt this startup progress update for LinkedIn and X/Twitter.\n\n" +
                "LINKEDIN STYLE: Emotional, poetic, and deeply human. Use 2-3 line paragraphs. Create a narrative arc. Start with a hook, then a vulnerable middle, and an insightful conclusion. Space it out with double line breaks between short paragraphs.\n\n" +
                "TWITTER STYLE: Punchy, contrarian, and high-signal. Use short sentences. Be bold. Challenge the status quo. Make it a 'hot take' version of the LinkedIn post.\n\n" +
                "Return JSON with 'linkedin' and 'twitter' keys.",
            },
            { role: "user", content: postContent },
          ],
          json_schema: {
            name: "social_versions",
            schema: {
              type: "object",
              properties: {
                linkedin: { type: "string" },
                twitter: { type: "string" },
              },
              required: ["linkedin", "twitter"],
              additionalProperties: false,
            },
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const versions = JSON.parse(data.choices[0].message.content);
        setAiVersions(versions);
      }
    } catch (error) {
      toast.error("AI generation failed");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return {
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
    setLeaderboardFilter,
    suggestedUsers,
    trendingPosts,
    groups,
  };
}
