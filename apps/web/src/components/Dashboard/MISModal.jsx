import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function MISModal({ show, onClose, profile }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex h-[600px]">
          {/* Preview Side */}
          <div className="flex-1 bg-gray-50 p-12 overflow-y-auto">
            <div className="mb-8 flex items-center justify-between border-b-4 border-[#00008B] pb-4">
              <div className="text-2xl font-black uppercase tracking-tighter text-[#00008B]">
                VentureLync MIS
              </div>
              <div className="text-sm font-bold text-gray-400">
                DECEMBER 2025
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="mb-4 text-lg font-black uppercase text-[#00008B]">
                  Executive Summary
                </h3>
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">
                    VentureLync has maintained a {profile.streak} day building
                    streak. This month, we focused on core infrastructure and
                    gamification loops. User engagement is up 40% MoM.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-lg font-black uppercase text-[#00008B]">
                  Key Metrics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase">
                      XP Velocity
                    </div>
                    <div className="text-2xl font-black text-[#00008B]">
                      +{profile.xp}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase">
                      Consistency
                    </div>
                    <div className="text-2xl font-black text-green-500">
                      94%
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase">
                      Signal Score
                    </div>
                    <div className="text-2xl font-black text-purple-500">
                      A+
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-lg font-black uppercase text-[#00008B]">
                  AI Forecast
                </h3>
                <div className="rounded-xl bg-blue-50 p-6 border border-blue-100">
                  <div className="mb-2 flex items-center gap-2 text-blue-600">
                    <Sparkles size={16} />
                    <span className="text-xs font-black uppercase">
                      Predictive Analysis
                    </span>
                  </div>
                  <p className="text-sm font-medium text-blue-900 italic">
                    "Based on current building velocity and streak consistency,
                    VentureLync is on track to hit 10k users by Q1 2026.
                    Narrative risk is low due to high transparency."
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Controls Side */}
          <div className="w-80 border-l border-gray-100 p-8 flex flex-col">
            <h3 className="mb-6 text-xl font-black uppercase tracking-tighter">
              Report Settings
            </h3>
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400">
                  Include Sections
                </label>
                <div className="space-y-2">
                  {["Metrics", "AI Forecast", "Daily Logs", "Badges"].map(
                    (s) => (
                      <label
                        key={s}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-[#00008B] focus:ring-[#00008B]"
                        />
                        <span className="text-sm font-bold text-gray-600">
                          {s}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400">
                  Tone
                </label>
                <select className="w-full rounded-lg border border-gray-200 p-2 text-sm font-bold outline-none">
                  <option>Professional</option>
                  <option>Raw & Honest</option>
                  <option>Aggressive Growth</option>
                </select>
              </div>
            </div>
            <button className="w-full rounded-2xl bg-[#00008B] py-4 font-black uppercase text-white shadow-xl shadow-blue-900/20 transition-transform hover:scale-105">
              Download PDF
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
