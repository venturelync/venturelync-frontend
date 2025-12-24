import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Rocket, ShieldCheck, ArrowRight, Lock } from "lucide-react";
import { motion } from "motion/react";
import useUser from "@/utils/useUser";
import { useEffect } from "react";

export default function SignUpPage() {
  const { data: user, loading: userLoading } = useUser();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isInvited, setIsInvited] = useState(false);
  const [checkingInvite, setCheckingInvite] = useState(false);

  const { signUpWithCredentials } = useAuth();

  // Removed automatic redirect to allow testing and prevent "redirecting on its own"

  const checkInvite = async (e) => {
    e.preventDefault();
    setCheckingInvite(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/check-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.invited) {
        setIsInvited(true);
      } else {
        setError(data.message || "You are not invited yet.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setCheckingInvite(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !name) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await signUpWithCredentials({
        email: email.toLowerCase(), // Ensure lowercase email
        password,
        name,
        callbackUrl: "/welcome",
        redirect: false,
      });

      if (result?.ok) {
        // Success! Redirect to welcome
        window.location.href = "/welcome";
      } else if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid credentials"
            : result.error,
        );
        setLoading(false);
      } else {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError("This email is already registered. Try signing in instead.");
      setLoading(false);
    }
  };

  if (userLoading) return null;

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#00008B] font-sans selection:bg-[#FFD600] selection:text-[#00008B] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center bg-[#00008B] border-4 border-[#00008B] text-white shadow-[8px_8px_0px_#FFD600]">
            <Lock size={40} />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
            VentureLync
          </h1>
          <p className="text-sm font-black uppercase tracking-widest opacity-60">
            Private Operating Infrastructure
          </p>
        </div>

        {!isInvited ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-8 border-[#00008B] bg-white p-8 shadow-[16px_16px_0px_#00008B]"
          >
            <h2 className="text-2xl font-black uppercase mb-6">
              Check Your Invite
            </h2>
            <form onSubmit={checkInvite} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                />
              </div>
              {error && (
                <div className="border-4 border-[#FF4B4B] bg-[#FF4B4B]/10 p-4 text-sm font-black uppercase text-[#FF4B4B]">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={checkingInvite}
                className="w-full bg-[#00008B] py-4 text-xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FFD600] disabled:opacity-50"
              >
                {checkingInvite ? "Checking..." : "Check Invite Status"}
              </button>
              <p className="text-center text-sm font-black uppercase opacity-60">
                Don't have an invite?{" "}
                <a href="/" className="underline">
                  Request one here
                </a>
              </p>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-8 border-[#00008B] bg-white p-8 shadow-[16px_16px_0px_#00C853]"
          >
            <div className="mb-6 flex items-center gap-4 text-[#00C853]">
              <ShieldCheck size={32} />
              <h2 className="text-2xl font-black uppercase">You're Invited!</h2>
            </div>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                />
              </div>
              {error && (
                <div className="border-4 border-[#FF4B4B] bg-[#FF4B4B]/10 p-4 text-sm font-black uppercase text-[#FF4B4B]">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00008B] py-4 text-xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#00C853] disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
