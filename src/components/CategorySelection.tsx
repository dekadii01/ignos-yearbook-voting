import {
  Sparkles,
  Heart,
  Zap,
  Brain,
  Users,
  Trophy,
  Palette,
  Smile,
  CheckCircle2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "./GlassCard";
import { supabase } from "../lib/supabase";
import { GlassButton } from "./GlassButton";

interface Category {
  id: string;
  name: string;
  icon: string;
}

const iconMap: { [key: string]: any } = {
  Sparkles,
  Heart,
  Zap,
  Brain,
  Users,
  Trophy,
  Palette,
  Smile,
};

export function CategorySelection() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: string }>({});

  /* ===============================
     Fetch categories
  =============================== */
  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("created_at");

      setCategories(data || []);
    };

    loadCategories();
  }, []);

  /* ===============================
     Fetch votes user
  =============================== */
  useEffect(() => {
    const loadVotes = async () => {
      const userStr = localStorage.getItem("yearbook-user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user) return;

      const { data } = await supabase
        .from("votes")
        .select("category_id, candidate_id")
        .eq("user_id", user.id);

      const voteMap: Record<string, string> = {};
      data?.forEach((v) => (voteMap[v.category_id] = v.candidate_id));

      setVotes(voteMap);
    };

    loadVotes();

    const userStr = localStorage.getItem("yearbook-user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    const channel = supabase
      .channel("user-votes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setVotes((prev) => ({
            ...prev,
            [payload.new.category_id]: payload.new.candidate_id,
          }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const votedCount = Object.keys(votes).length;
  const progress =
    categories.length > 0 ? (votedCount / categories.length) * 100 : 0;

  return (
    <div className="min-h-screen p-6 py-12">
      <div className="w-full max-w-6xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-gray-900 mb-2">Choose a Category</h1>
          <p className="text-gray-600">Select a category to cast your vote</p>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Sparkles;
            const hasVoted = !!votes[category.id];

            return (
              <button
                key={category.id}
                onClick={() => navigate(`/vote/${category.id}`)}
                className="group relative"
              >
                <GlassCard
                  hover
                  className="p-6 h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        <Icon className="w-8 h-8 text-gray-800" />
                      </div>

                      {/* Vote Badge */}
                      {hasVoted && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-gray-900 leading-snug">
                      {category.name}
                    </h3>

                    {/* Status */}
                    {hasVoted && (
                      <p className="text-xs text-green-700 px-3 py-1 rounded-full bg-green-100/60 backdrop-blur-sm border border-green-200/60">
                        Already Voted
                      </p>
                    )}
                  </div>
                </GlassCard>
              </button>
            );
          })}
        </div>

        {/* ================= PROGRESS ================= */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-gray-900 mb-1">Your Progress</h4>
              <p className="text-sm text-gray-600">
                {votedCount} of {categories.length} categories completed
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200/60 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-gray-700 to-gray-900 transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="text-sm text-gray-700 min-w-[3rem] text-right">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </GlassCard>

        <div className="flex items-center gap-4 justify-end mt-6 mb-6">
          <GlassButton variant="secondary" onClick={() => navigate("/summary")}>
            Hasil Voting Sementara
          </GlassButton>
          <GlassButton onClick={() => navigate("/")}>
            Kembali ke Beranda
          </GlassButton>
        </div>

        <p className="text-center text-sm text-gray-500">
          © 2026 Ignos Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}
