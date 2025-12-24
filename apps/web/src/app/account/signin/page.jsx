import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Zap, LogIn, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import useUser from "@/utils/useUser";
import { useEffect } from "react";

export default function SignInPage() {
  const { data: user, loading: userLoading } = useUser();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  // Explicitly removed any useEffect that might be causing a redirect
  // The user should stay on this page until they successfully submit the form

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await signInWithCredentials({
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // Success! Go to dashboard which handles the onboarding check
        window.location.href = "/dashboard";
      } else {
        // Handle specific error messages if possible, otherwise generic
        const errorMessage =
          result?.error === "CredentialsSignin"
            ? "Incorrect email or password. Please try again."
            : result?.error || "Sign in failed. Please check your credentials.";
        setError(errorMessage);
        setLoading(false);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (userLoading) return null;

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#00008B] font-sans selection:bg-[#FFD600] selection:text-[#00008B] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center bg-[#00008B] border-4 border-[#00008B] text-white shadow-[8px_8px_0px_#FFD600]">
            <Zap size={40} />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
            VentureLync
          </h1>
          <p className="text-sm font-black uppercase tracking-widest opacity-60">
            Welcome Back to the Clubhouse
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-8 border-[#00008B] bg-white p-8 shadow-[16px_16px_0px_#00008B]"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black uppercase">
                Email or Username
              </label>
              <input
                required
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com or username"
                className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black uppercase">Password</label>
                <a
                  href="/account/forgot-password"
                  className="text-xs font-black uppercase underline opacity-60 hover:opacity-100"
                >
                  Forgot?
                </a>
              </div>
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
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="border-4 border-[#FF4B4B] bg-[#FF4B4B]/10 p-4 text-sm font-black uppercase text-[#FF4B4B] flex items-center gap-3"
              >
                <AlertCircle size={20} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00008B] py-4 text-xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FFD600] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In ⚡"}
            </button>

            <p className="text-center text-sm font-black uppercase opacity-60">
              Don't have an account?{" "}
              <a href="/account/signup" className="underline">
                Sign up here
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
