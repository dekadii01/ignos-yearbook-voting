import {
  Sparkles,
  Heart,
  Zap,
  Brain,
  Users,
  Trophy,
  Palette,
  Smile,
  Crown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
  photo: string;
  category_id: string;
  votes: number;
}

/* ================= ICON MAP ================= */

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

/* ================= COMPONENT ================= */

export function SummaryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [winners, setWinners] = useState<Record<string, Candidate>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);

      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*");

      const { data: votesData } = await supabase
        .from("votes")
        .select("candidate_id, category_id");

      const { data: candidatesData } = await supabase
        .from("candidates")
        .select("*");

      if (!categoriesData || !votesData || !candidatesData) return;

      const voteCount: Record<string, number> = {};
      votesData.forEach((v) => {
        voteCount[v.candidate_id] = (voteCount[v.candidate_id] || 0) + 1;
      });

      const winnerMap: Record<string, Candidate> = {};

      categoriesData.forEach((category) => {
        const categoryCandidates = candidatesData
          .filter((c) => c.category_id === category.id)
          .map((c) => ({
            ...c,
            votes: voteCount[c.id] || 0,
          }))
          .sort((a, b) => b.votes - a.votes);

        if (categoryCandidates.length > 0) {
          winnerMap[category.id] = categoryCandidates[0];
        }
      });

      setCategories(categoriesData);
      setWinners(winnerMap);
      setLoading(false);
    };

    loadSummary();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">Loading summary...</p>
    );
  }

  return (
    <div className="min-h-screen p-6 py-12">
      <div className="w-full max-w-6xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300/60 to-yellow-500/60 backdrop-blur-xl border border-yellow-400/50 shadow-2xl mb-4">
            <Trophy className="w-10 h-10 text-yellow-800" />
          </div>

          <h1 className="text-4xl text-gray-900 mb-2">Final Results</h1>
          <p className="text-gray-600">
            Here are the winners of each category 🎉
          </p>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const winner = winners[category.id];
            if (!winner) return null;

            const Icon = iconMap[category.icon] || Sparkles;

            return (
              <GlassCard
                key={category.id}
                className="p-6 text-center space-y-4 hover:scale-105 transition-all duration-300"
              >
                {/* Category Icon */}
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/50 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-gray-800" />
                  </div>
                </div>

                {/* Category Name */}
                <h3 className="text-lg text-gray-900">{category.name}</h3>

                {/* Winner Photo */}
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden shadow-xl">
                  <ImageWithFallback
                    src={winner.photo}
                    alt={winner.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                    <Crown className="w-4 h-4 text-yellow-900" />
                  </div>
                </div>

                {/* Winner Info */}
                <div>
                  <h4 className="text-gray-900">{winner.name}</h4>
                  <p className="text-sm text-gray-600">Class {winner.class}</p>
                </div>

                {/* Votes */}
                <p className="text-sm text-gray-700">🗳️ {winner.votes} votes</p>
              </GlassCard>
            );
          })}
        </div>

        {/* ================= ACTION ================= */}
        <div className="flex justify-center">
          <GlassButton onClick={() => navigate("/")}>Back to Home</GlassButton>
        </div>
      </div>
    </div>
  );
}
