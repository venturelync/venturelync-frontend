"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  ArrowRight,
  Camera,
  Linkedin,
  Twitter,
  Zap,
  Loader2,
  Globe,
} from "lucide-react";
import useUser from "@/utils/useUser";
import { useUpload } from "@/utils/useUpload";

export default function OnboardingPage() {
  const { data: user, loading: userLoading, mutate: refreshUser } = useUser();
  const [upload] = useUpload(); // Fix: useUpload returns an array

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    bio: "",
    profile_image: "",
    banner_image: "",
    linkedin_url: "",
    twitter_url: "",
    website_url: "",
    builder_intent: "",
  });
  const [uploadingField, setUploadingField] = useState(null);

  const [showLinkedInInput, setShowLinkedInInput] = useState(false);
  const [showTwitterInput, setShowTwitterInput] = useState(false);
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        window.location.href = "/account/signin";
        return;
      }

      // Only redirect to dashboard if onboarding is explicitly completed
      // and we haven't started the process on this page yet (step === 1)
      if (user.onboarding_completed === true && step === 1) {
        window.location.href = "/dashboard";
      }
    }
  }, [user, userLoading, step]);

  useEffect(() => {
    if (user && step === 1) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
      }));
    }
  }, [user, step]);

  // Live username check
  useEffect(() => {
    if (formData.username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const res = await fetch(
          `/api/profile/check-username?username=${formData.username}`,
        );
        const data = await res.json();
        setUsernameAvailable(data.available);
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingField(field);
    setError(null);
    try {
      console.log(`Uploading ${field}...`);
      const result = await upload({ file });
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.url) {
        throw new Error("No URL returned from upload");
      }
      console.log(`Upload successful for ${field}:`, result.url);
      setFormData((prev) => ({ ...prev, [field]: result.url }));
    } catch (err) {
      console.error("Upload error:", err);
      setError(`Failed to upload ${field.replace("_", " ")}: ` + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const nextStep = () => setStep((s) => s + 1);

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Submitting profile data:", formData);
      const res = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          onboarding_completed: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      console.log("Profile saved successfully");
      // Force a refresh of the user data before redirecting
      await refreshUser();

      // Small delay to ensure state is updated
      setTimeout(() => {
        window.location.href = "/first-post";
      }, 500);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
        <Loader2 className="animate-spin text-[#00008B]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#00008B] font-sans selection:bg-[#FFD600] selection:text-[#00008B] p-6">
      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-4 flex-1 mx-1 border-2 border-[#00008B] transition-all ${
                step >= s ? "bg-[#00C853]" : "bg-white"
              }`}
            />
          ))}
        </div>
        <p className="text-center font-black uppercase text-sm">
          Step {step} of 4
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="border-8 border-[#00008B] bg-white p-8 md:p-12 shadow-[16px_16px_0px_#00008B]"
            >
              <h2 className="text-4xl font-black uppercase mb-8">
                Identity Setup
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          username: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9_]/g, ""),
                        })
                      }
                      className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                      placeholder="johndoe"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {checkingUsername ? (
                        <Loader2 className="animate-spin opacity-40" />
                      ) : usernameAvailable === true ? (
                        <CheckCircle2 className="text-[#00C853]" />
                      ) : usernameAvailable === false ? (
                        <span className="text-[#FF4B4B] text-xs font-black uppercase">
                          Taken
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">
                    Full Name
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <button
                  disabled={
                    !formData.username ||
                    !formData.name ||
                    usernameAvailable === false
                  }
                  onClick={nextStep}
                  className="w-full bg-[#00008B] py-6 text-2xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FFD600] disabled:opacity-50"
                >
                  Continue <ArrowRight className="inline ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="border-8 border-[#00008B] bg-white p-8 md:p-12 shadow-[16px_16px_0px_#00008B]"
            >
              <h2 className="text-4xl font-black uppercase mb-8">
                Profile Setup
              </h2>
              <div className="space-y-8">
                <div className="flex items-center gap-8">
                  <div className="relative h-32 w-32 border-4 border-[#00008B] bg-[#FDFCF8] flex items-center justify-center overflow-hidden group">
                    {uploadingField === "profile_image" ? (
                      <Loader2 className="animate-spin opacity-40" size={32} />
                    ) : formData.profile_image ? (
                      <img
                        src={formData.profile_image}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera size={40} className="opacity-20" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "profile_image")}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 bg-[#00008B]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black uppercase text-sm mb-2">
                      Profile Photo (Optional)
                    </p>
                    <p className="text-xs font-bold opacity-60">
                      Click to upload. Square works best.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">
                    Short Bio (Max 200 chars) *
                  </label>
                  <textarea
                    maxLength={200}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white h-32"
                    placeholder="Building the future of venture infrastructure..."
                  />
                  <p className="text-right text-xs font-black opacity-40">
                    {formData.bio.length}/200
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">
                    Banner Image (Optional)
                  </label>
                  <div className="relative h-24 w-full border-4 border-[#00008B] bg-[#FDFCF8] flex items-center justify-center overflow-hidden group">
                    {uploadingField === "banner_image" ? (
                      <Loader2 className="animate-spin opacity-40" size={24} />
                    ) : formData.banner_image ? (
                      <img
                        src={formData.banner_image}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera size={24} className="opacity-20" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "banner_image")}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 bg-[#00008B]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>

                <button
                  disabled={!formData.bio || uploadingField !== null}
                  onClick={nextStep}
                  className="w-full bg-[#00008B] py-6 text-2xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FFD600] disabled:opacity-50"
                >
                  Continue <ArrowRight className="inline ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="border-8 border-[#00008B] bg-white p-8 md:p-12 shadow-[16px_16px_0px_#00008B]"
            >
              <h2 className="text-4xl font-black uppercase mb-4">
                Social Proof Layer
              </h2>
              <p className="font-bold mb-8 opacity-60">
                Connect your networks to verify your builder status.
              </p>

              <div className="space-y-6 mb-12">
                <div className="space-y-2">
                  {!showLinkedInInput ? (
                    <button
                      onClick={() => setShowLinkedInInput(true)}
                      className="w-full border-4 border-[#00008B] p-6 flex items-center justify-between hover:bg-[#FDFCF8] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Linkedin className="text-[#0077B5]" />
                        <span className="font-black uppercase">
                          {formData.linkedin_url
                            ? "LinkedIn Linked"
                            : "Connect LinkedIn"}
                        </span>
                      </div>
                      {formData.linkedin_url ? (
                        <CheckCircle2 className="text-[#00C853]" />
                      ) : (
                        <ArrowRight size={20} />
                      )}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase">
                        LinkedIn Profile URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          value={formData.linkedin_url}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              linkedin_url: e.target.value,
                            })
                          }
                          className="flex-1 border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                          placeholder="https://linkedin.com/in/username"
                        />
                        <button
                          onClick={() => setShowLinkedInInput(false)}
                          className="bg-[#00008B] text-white px-4 font-black uppercase text-xs"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {!showTwitterInput ? (
                    <button
                      onClick={() => setShowTwitterInput(true)}
                      className="w-full border-4 border-[#00008B] p-6 flex items-center justify-between hover:bg-[#FDFCF8] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Twitter className="text-[#1DA1F2]" />
                        <span className="font-black uppercase">
                          {formData.twitter_url ? "X Linked" : "Connect X"}
                        </span>
                      </div>
                      {formData.twitter_url ? (
                        <CheckCircle2 className="text-[#00C853]" />
                      ) : (
                        <ArrowRight size={20} />
                      )}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase">
                        X (Twitter) Profile URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          value={formData.twitter_url}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              twitter_url: e.target.value,
                            })
                          }
                          className="flex-1 border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                          placeholder="https://x.com/username"
                        />
                        <button
                          onClick={() => setShowTwitterInput(false)}
                          className="bg-[#00008B] text-white px-4 font-black uppercase text-xs"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {!showWebsiteInput ? (
                    <button
                      onClick={() => setShowWebsiteInput(true)}
                      className="w-full border-4 border-[#00008B] p-6 flex items-center justify-between hover:bg-[#FDFCF8] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Globe className="text-green-600" />
                        <span className="font-black uppercase">
                          {formData.website_url
                            ? "Website Linked"
                            : "Add Website"}
                        </span>
                      </div>
                      {formData.website_url ? (
                        <CheckCircle2 className="text-[#00C853]" />
                      ) : (
                        <ArrowRight size={20} />
                      )}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase">
                        Personal Website / Portfolio
                      </label>
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          value={formData.website_url}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              website_url: e.target.value,
                            })
                          }
                          className="flex-1 border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                          placeholder="https://yourwebsite.com"
                        />
                        <button
                          onClick={() => setShowWebsiteInput(false)}
                          className="bg-[#00008B] text-white px-4 font-black uppercase text-xs"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={nextStep}
                  className="w-full bg-[#00008B] py-6 text-2xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#00C853]"
                >
                  Save & Continue
                </button>
                <button
                  onClick={nextStep}
                  className="w-full text-sm font-black uppercase opacity-40 hover:opacity-100 transition-all"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="border-8 border-[#00008B] bg-white p-8 md:p-12 shadow-[16px_16px_0px_#00008B]"
            >
              <h2 className="text-4xl font-black uppercase mb-8">
                Builder Intent
              </h2>
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-2xl font-black uppercase leading-tight">
                    What are you building right now?
                  </p>
                  <input
                    value={formData.builder_intent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        builder_intent: e.target.value,
                      })
                    }
                    className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-6 text-xl font-bold outline-none focus:bg-white"
                    placeholder="e.g. A decentralized protocol for venture debt"
                  />
                </div>

                {error && (
                  <div className="border-4 border-[#FF4B4B] bg-[#FF4B4B]/10 p-4 text-sm font-black uppercase text-[#FF4B4B]">
                    {error}
                  </div>
                )}

                <button
                  disabled={loading || !formData.builder_intent}
                  onClick={handleFinalSubmit}
                  className="w-full bg-[#00008B] py-8 text-3xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#FFD600] disabled:opacity-50"
                >
                  {loading ? "Saving..." : "👉 Enter VentureLync"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
