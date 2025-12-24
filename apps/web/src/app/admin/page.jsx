import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Users,
  ShieldCheck,
  Clock,
  Search,
  Filter,
} from "lucide-react";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, approved, pending

  const {
    data: entries = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-waitlist"],
    queryFn: async () => {
      const res = await fetch("/api/admin/waitlist");
      if (!res.ok) throw new Error("Failed to fetch waitlist");
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, is_approved }) => {
      const res = await fetch("/api/admin/waitlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_approved }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-waitlist"] });
    },
  });

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.project_description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "approved" && entry.is_approved) ||
      (filter === "pending" && !entry.is_approved);

    return matchesSearch && matchesFilter;
  });

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCF8]">
        <div className="text-2xl font-black uppercase animate-pulse">
          Loading Signal...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#00008B] font-sans p-6 md:p-12">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-[#00C853]" />
            <span className="text-sm font-black uppercase tracking-widest">
              Command Center
            </span>
          </div>
          <h1 className="text-6xl font-black uppercase leading-none">
            Waitlist <br />
            <span className="text-[#FF4B4B]">Management</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="border-4 border-[#00008B] bg-white p-4 shadow-[4px_4px_0px_#00008B]">
            <div className="text-xs font-black uppercase opacity-60">
              Total Requests
            </div>
            <div className="text-3xl font-black">{entries.length}</div>
          </div>
          <div className="border-4 border-[#00008B] bg-white p-4 shadow-[4px_4px_0px_#00C853]">
            <div className="text-xs font-black uppercase opacity-60">
              Approved
            </div>
            <div className="text-3xl font-black">
              {entries.filter((e) => e.is_approved).length}
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="mb-8 grid md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            type="text"
            placeholder="Search by name, email, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-4 border-[#00008B] bg-white p-4 pl-12 font-bold outline-none focus:shadow-[4px_4px_0px_#FFD600]"
          />
        </div>
        <div className="flex border-4 border-[#00008B] bg-white">
          {["all", "pending", "approved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-black uppercase transition-colors ${
                filter === f ? "bg-[#00008B] text-white" : "hover:bg-[#FDFCF8]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-4 border-[#00008B] bg-white shadow-[12px_12px_0px_#00008B]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-4 border-[#00008B] bg-[#FDFCF8]">
              <th className="p-4 font-black uppercase text-sm">Status</th>
              <th className="p-4 font-black uppercase text-sm">User</th>
              <th className="p-4 font-black uppercase text-sm">
                Project / Focus
              </th>
              <th className="p-4 font-black uppercase text-sm">Links</th>
              <th className="p-4 font-black uppercase text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b-2 border-[#00008B] hover:bg-[#FDFCF8] transition-colors"
              >
                <td className="p-4">
                  {entry.is_approved ? (
                    <div className="inline-flex items-center gap-1 bg-[#00C853] text-white px-2 py-1 text-[10px] font-black uppercase">
                      <CheckCircle2 size={12} /> Approved
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 bg-[#FFD600] text-[#00008B] px-2 py-1 text-[10px] font-black uppercase">
                      <Clock size={12} /> Pending
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-black uppercase">{entry.name}</div>
                  <div className="text-xs font-bold opacity-60">
                    {entry.email}
                  </div>
                  <div className="text-[10px] font-black uppercase mt-1 text-[#FF4B4B]">
                    {entry.role}
                  </div>
                </td>
                <td className="p-4 max-w-xs">
                  <p className="text-sm font-bold line-clamp-2">
                    {entry.project_description}
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {entry.linkedin_url && (
                      <a
                        href={entry.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border-2 border-[#00008B] hover:bg-[#FFD600]"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {entry.website_url && (
                      <a
                        href={entry.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border-2 border-[#00008B] hover:bg-[#FFD600]"
                      >
                        <Users size={14} />
                      </a>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {!entry.is_approved ? (
                      <button
                        onClick={() =>
                          approveMutation.mutate({
                            id: entry.id,
                            is_approved: true,
                          })
                        }
                        className="bg-[#00C853] text-white px-4 py-2 text-xs font-black uppercase hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_#00008B]"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          approveMutation.mutate({
                            id: entry.id,
                            is_approved: false,
                          })
                        }
                        className="bg-[#FF4B4B] text-white px-4 py-2 text-xs font-black uppercase hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_#00008B]"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredEntries.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-12 text-center font-black uppercase opacity-40"
                >
                  No signal found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="mt-12 text-center text-xs font-black uppercase opacity-40">
        VentureLync Admin • Integrity First
      </footer>
    </div>
  );
}
