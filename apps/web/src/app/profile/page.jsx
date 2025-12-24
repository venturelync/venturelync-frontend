"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Toaster, toast } from "sonner";
import useUser from "@/utils/useUser";
import useUpload from "@/utils/useUpload";
import {
  Zap,
  MapPin,
  Link as LinkIcon,
  Linkedin,
  Twitter,
  Calendar,
  Edit2,
  Award,
  TrendingUp,
  Users,
  Flame,
  MessageCircle,
  DollarSign,
  UserPlus,
  Briefcase,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { TopNav } from "@/components/Dashboard/TopNav";
import { PostCard } from "@/components/Dashboard/PostCard";

const STICKERS = [
  "🚀",
  "🦄",
  "⚡",
  "💎",
  "🔥",
  "🌈",
  "👾",
  "🤖",
  "🦊",
  "🐼",
  "🦁",
  "🐯",
  "🐸",
  "🐙",
  "🐳",
  "🦖",
];

export default function ProfilePage() {
  const { data: user, loading: userLoading } = useUser();
  const [upload, { loading: uploading }] = useUpload();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState("posts");
  const [badges, setBadges] = useState([]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    } else if (user) {
      fetchProfile();
      fetchUserPosts();
      fetchUserBadges();
    }
  }, [user, userLoading]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setEditForm({
          name: data.profile.name || "",
          bio: data.profile.bio || "",
          city: data.profile.city || "",
          country: data.profile.country || "",
          website_url: data.profile.website_url || "",
          linkedin_url: data.profile.linkedin_url || "",
          twitter_url: data.profile.twitter_url || "",
        });
      }
    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await fetch("/api/posts?user_only=true");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Posts fetch failed", err);
    }
  };

  const fetchUserBadges = async () => {
    try {
      const res = await fetch("/api/profile/badges");
      if (res.ok) {
        const data = await res.json();
        setBadges(data.badges);
      }
    } catch (err) {
      console.error("Badges fetch failed", err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        fetchProfile();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update failed", err);
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarSelect = async (sticker) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, profile_image: sticker }),
      });
      if (res.ok) {
        setProfile({ ...profile, profile_image: sticker });
        setShowAvatarPicker(false);
        toast.success("Avatar updated!");
      }
    } catch (err) {
      toast.error("Failed to update avatar");
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url, error } = await upload({ file });
      if (error) throw new Error(error);

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: url }),
      });

      if (res.ok) {
        setProfile((prev) => ({ ...prev, [type]: url }));
        toast.success(
          `${type === "profile_image" ? "Photo" : "Banner"} updated!`,
        );
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  if (userLoading || !profile) {
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

  const isOwner = String(user?.id) === String(profile?.user_id);
  const recentUpdates = posts.slice(0, 3);
  const nextLevelXp = profile.level * 1000;
  const currentLevelXp = profile.core_xp % 1000;
  const levelProgress = (currentLevelXp / 1000) * 100;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
      <Toaster position="top-center" richColors />
      <TopNav profile={profile} />

      <div className="mx-auto max-w-[1200px] px-4 pt-24 pb-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          {/* Banner */}
          <div className="group relative h-48 bg-gradient-to-r from-[#00008B] to-[#4169E1]">
            {profile.banner_image && (
              <img
                src={profile.banner_image}
                alt="Banner"
                className="h-full w-full object-cover"
              />
            )}
            {isOwner && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#00008B] shadow-lg hover:bg-white">
                  <Camera size={18} />
                  Change Banner
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "banner_image")}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="absolute -top-16 left-8">
              <div className="group relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-[#00008B] to-[#4169E1] shadow-lg transition-transform hover:scale-105">
                {profile.profile_image && profile.profile_image.length > 2 ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-black text-white">
                    {profile.profile_image ||
                      profile.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {isOwner && (
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex flex-col items-center gap-1">
                      <Camera size={24} className="text-white" />
                      <span className="text-[10px] font-black text-white uppercase">
                        Change
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "profile_image")}
                    />
                  </label>
                )}
              </div>

              {showAvatarPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-20 left-0 z-50 grid w-64 grid-cols-4 gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl"
                >
                  {STICKERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleAvatarSelect(s)}
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all hover:bg-gray-100 hover:scale-110"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              {!isOwner && (
                <>
                  <button className="flex items-center gap-2 rounded-full bg-gray-100 px-6 py-2 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200">
                    <UserPlus size={16} />
                    Follow
                  </button>
                  <button className="flex items-center gap-2 rounded-full bg-gray-100 px-6 py-2 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200">
                    <MessageCircle size={16} />
                    Message
                  </button>
                  <button className="flex items-center gap-2 rounded-full bg-[#FFD600] px-6 py-2 text-sm font-bold text-[#00008B] transition-all hover:bg-[#FFC400] shadow-sm">
                    <DollarSign size={16} />
                    Invest
                  </button>
                </>
              )}
              {isOwner && (
                <>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 rounded-full bg-[#00008B] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#000070]"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="rounded-full border border-gray-300 px-6 py-2 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="rounded-full bg-[#00008B] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#000070]"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Name & Username */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-gray-900">
                  {profile.name}
                </h1>
                <CheckCircle2
                  size={20}
                  className="text-blue-500"
                  fill="currentColor"
                />
              </div>
              <p className="text-sm font-bold text-gray-500">
                @{profile.username}
              </p>
            </div>

            {/* Bio */}
            <div className="mt-4">
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  className="w-full max-w-2xl rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium outline-none focus:border-[#00008B] focus:bg-white"
                  placeholder="Tell us about your journey..."
                  rows={3}
                />
              ) : (
                <p className="max-w-2xl text-sm font-medium leading-relaxed text-gray-600">
                  {profile.bio || "No bio yet."}
                </p>
              )}
            </div>

            {/* Location & Links */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) =>
                      setEditForm({ ...editForm, city: e.target.value })
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) =>
                      setEditForm({ ...editForm, country: e.target.value })
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                    placeholder="Country"
                  />
                  <input
                    type="url"
                    value={editForm.website_url}
                    onChange={(e) =>
                      setEditForm({ ...editForm, website_url: e.target.value })
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                    placeholder="Website URL"
                  />
                  <input
                    type="url"
                    value={editForm.linkedin_url}
                    onChange={(e) =>
                      setEditForm({ ...editForm, linkedin_url: e.target.value })
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                    placeholder="LinkedIn URL"
                  />
                  <input
                    type="url"
                    value={editForm.twitter_url}
                    onChange={(e) =>
                      setEditForm({ ...editForm, twitter_url: e.target.value })
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                    placeholder="Twitter URL"
                  />
                </>
              ) : (
                <>
                  {profile.city && profile.country && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>
                        {profile.city}, {profile.country}
                      </span>
                    </div>
                  )}
                  {profile.website_url && (
                    <a
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-[#00008B]"
                    >
                      <LinkIcon size={16} />
                      <span>Website</span>
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-[#00008B]"
                    >
                      <Linkedin size={16} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-[#00008B]"
                    >
                      <Twitter size={16} />
                      <span>Twitter</span>
                    </a>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>
                      Joined {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Level Card */}
              <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#00008B]">
                    <TrendingUp size={20} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Level
                    </span>
                  </div>
                  <span className="text-2xl font-black text-[#00008B]">
                    {profile.level}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500">
                    <span>Progress to Lvl {profile.level + 1}</span>
                    <span>{Math.round(levelProgress)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgress}%` }}
                      className="h-full bg-[#00008B]"
                    />
                  </div>
                </div>
              </div>

              {/* Streak Card */}
              <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-orange-600">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        filter: [
                          "drop-shadow(0 0 0px orange)",
                          "drop-shadow(0 0 8px orange)",
                          "drop-shadow(0 0 0px orange)",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Flame size={20} fill="currentColor" />
                    </motion.div>
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Streak
                    </span>
                  </div>
                  <span className="text-2xl font-black text-orange-600">
                    {profile.streak}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-500">
                  Days of consistent building
                </p>
              </div>

              {/* Badges Card */}
              <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Award size={20} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Badges
                    </span>
                  </div>
                  <span className="text-2xl font-black text-purple-600">
                    {badges.length}
                  </span>
                </div>
                <div className="flex gap-2">
                  {badges.slice(0, 3).map((b, i) => (
                    <motion.div
                      key={b.id}
                      animate={
                        i === 0
                          ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }
                          : {}
                      }
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-xl"
                      title={b.name}
                    >
                      {b.icon || "🏆"}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Network Card */}
              <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <Users size={20} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Network
                    </span>
                  </div>
                  <span className="text-2xl font-black text-green-600">
                    1.2k
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-500">
                  Founders & Investors
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Recent Updates & Experience */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Updates */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-black text-[#00008B] uppercase tracking-tight">
                Recent Updates
              </h3>
              <div className="space-y-4">
                {recentUpdates.length > 0 ? (
                  recentUpdates.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No updates yet.</p>
                )}
              </div>
            </div>

            {/* Work Experience */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-[#00008B] uppercase tracking-tight">
                  Work Experience
                </h3>
                <Briefcase size={20} className="text-gray-400" />
              </div>
              <div className="space-y-6">
                {profile.linkedin_data?.experience ? (
                  profile.linkedin_data.experience.map((exp, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Briefcase size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{exp.title}</h4>
                        <p className="text-sm font-medium text-gray-600">
                          {exp.company}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {exp.duration}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 mb-4">
                      No experience listed yet.
                    </p>
                    <button className="text-sm font-bold text-[#00008B] underline">
                      Add Experience
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Badges & Stats */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-black text-[#00008B] uppercase tracking-tight">
                Achievements
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-3xl shadow-inner">
                      {badge.icon || "🏆"}
                    </div>
                    <span className="text-[10px] font-black text-center uppercase text-gray-500">
                      {badge.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
