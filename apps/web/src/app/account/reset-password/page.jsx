"use client";

import { useState, useEffect } from "react";
import { Zap, Lock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setToken(urlParams.get("token"));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] text-[#00008B] font-sans flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-[#FF4B4B]" />
          <h1 className="text-2xl font-black uppercase">Invalid Link</h1>
          <p className="mt-2 opacity-60">
            This password reset link is invalid or has expired.
          </p>
          <a
            href="/account/forgot-password"
            className="mt-6 inline-block font-black uppercase underline"
          >
            Request New Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#00008B] font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center bg-[#00008B] border-4 border-[#00008B] text-white shadow-[8px_8px_0px_#FFD600]">
            <Lock size={40} />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
            New Pass
          </h1>
          <p className="text-sm font-black uppercase tracking-widest opacity-60">
            Secure your clubhouse access
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-8 border-[#00008B] bg-white p-8 shadow-[16px_16px_0px_#00008B]"
        >
          {message ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              <p className="font-black uppercase text-sm leading-relaxed">
                {message}
              </p>
              <a
                href="/account/signin"
                className="w-full bg-[#00008B] py-4 text-xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FFD600] flex items-center justify-center gap-2"
              >
                Sign In <ArrowRight size={20} />
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase">
                  New Password
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase">
                  Confirm Password
                </label>
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-4 border-[#00008B] bg-[#FDFCF8] p-4 font-bold outline-none focus:bg-white"
                />
              </div>

              {error && (
                <div className="border-4 border-[#FF4B4B] bg-[#FF4B4B]/10 p-4 text-sm font-black uppercase text-[#FF4B4B] flex items-center gap-3">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00008B] py-4 text-xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FFD600] disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password ⚡"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
