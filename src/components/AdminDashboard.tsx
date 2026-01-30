import { JSX, useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Trophy,
  TrendingUp,
  LogOut,
  Crown,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";

/* ================= TYPES ================= */

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Candidate {
  id: string;
  name: string;
  class: string;
  category_id: string;
}

interface Vote {
  id: string;
  candidate_id: string;
  category_id: string;
}

/* ================= COMPONENT ================= */

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  /* ================= FETCH ALL DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      const { data: cat } = await supabase.from("categories").select("*");
      const { data: cand } = await supabase.from("candidates").select("*");
      const { data: vote } = await supabase.from("votes").select("*");

      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      setCategories(cat || []);
      setCandidates(cand || []);
      setVotes(vote || []);
      setTotalStudents(count || 0);

      if (cat && cat.length > 0) {
        setSelectedCategory(cat[0].id);
      }
    };

    loadData();
  }, []);

  /* ================= STATISTICS ================= */

  const totalVotes = votes.length;

  const participationRate = Math.round(
    (totalVotes / (totalStudents * categories.length || 1)) * 100,
  );

  /* ================= CURRENT CATEGORY DATA ================= */

  const currentCandidates = candidates.filter(
    (c) => c.category_id === selectedCategory,
  );

  const voteCountByCandidate: Record<string, number> = {};

  votes
    .filter((v) => v.category_id === selectedCategory)
    .forEach((v) => {
      voteCountByCandidate[v.candidate_id] =
        (voteCountByCandidate[v.candidate_id] || 0) + 1;
    });

  const sortedCandidates = currentCandidates
    .map((c) => ({
      ...c,
      votes: voteCountByCandidate[c.id] || 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  const maxVotes = Math.max(...sortedCandidates.map((c) => c.votes), 0);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen p-6 py-10">
      <div className="w-full max-w-7xl mx-auto space-y-10">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-gray-600">Live voting results</p>
          </div>

          <GlassButton onClick={onLogout} variant="secondary" className="gap-2">
            <LogOut className="w-5 h-5" />
            Logout
          </GlassButton>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <GlassCard className="p-6">
            <Stat title="Total Murid" value={totalStudents} icon={<Users />} />
          </GlassCard>

          <GlassCard className="p-6">
            <Stat
              title="Total Voting"
              value={totalVotes}
              icon={<BarChart3 />}
            />
          </GlassCard>

          <GlassCard className="p-6">
            <Stat
              title="Kategori"
              value={categories.length}
              icon={<Trophy />}
            />
          </GlassCard>

          <GlassCard className="p-6">
            <Stat
              title="Partisipasi"
              value={`${participationRate}%`}
              icon={<TrendingUp />}
            />
          </GlassCard>
        </div>

        {/* ================= CATEGORY ================= */}
        <GlassCard className="p-6 mb-6">
          <h2 className="text-lg text-gray-900 mb-4">Pilih Kategori</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-xl text-sm transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gray-900 text-white scale-105 shadow-lg"
                    : "bg-white/40 border border-white/60 hover:scale-105"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* ================= RESULTS ================= */}
        <GlassCard className="p-6 space-y-4 mb-6">
          {sortedCandidates.map((candidate, index) => {
            const percentage =
              maxVotes > 0 ? (candidate.votes / maxVotes) * 100 : 0;

            const isWinner = index === 0;

            return (
              <div
                key={candidate.id}
                className={`p-4 rounded-xl transition ${
                  isWinner
                    ? "bg-gradient-to-br from-yellow-200/60 to-yellow-300/60 border-2 border-yellow-400"
                    : "bg-white/40 border border-white/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isWinner && <Crown className="w-6 h-6 text-yellow-600" />}

                    <div>
                      <p className="text-gray-900 font-medium">
                        {candidate.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Kelas {candidate.class}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl text-gray-900">{candidate.votes}</p>
                    <p className="text-xs text-gray-600">votes</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="w-full h-2 bg-gray-200/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isWinner
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                        : "bg-gray-800"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </GlassCard>

        <p className="text-center text-sm text-gray-500">
          © 2026 Ignos Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: JSX.Element;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center text-gray-800">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl text-gray-900">{value}</p>
      </div>
    </div>
  );
}
