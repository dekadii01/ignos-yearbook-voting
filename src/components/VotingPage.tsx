import {
  ArrowLeft,
  Sparkles,
  Heart,
  Zap,
  Brain,
  Users,
  Trophy,
  Palette,
  Smile,
  ArrowUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase } from "../lib/supabase";

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

export function VotingPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [showTop, setShowTop] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null,
  );

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const alreadyVoted = async () => {
      const userStr = localStorage.getItem("yearbook-user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !categoryId) return;
      const userId = user.id;
      const { data: existing } = await supabase
        .from("votes")
        .select("id")
        .eq("user_id", userId)
        .eq("category_id", categoryId)
        .maybeSingle();

      if (existing) {
        navigate(`/already-voted/${categoryId}`);
      }
    };

    const loadData = async () => {
      if (!categoryId) return;

      const { data: cat } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single();

      setCategory(cat);

      const { data: cand } = await supabase
        .from("candidates")
        .select("*")
        .eq("category_id", categoryId);

      setCandidates(cand || []);
    };

    alreadyVoted();
    loadData();
  }, [categoryId]);

  /* ================= BACK TO TOP VISIBILITY ================= */
  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 400); // muncul setelah scroll 400px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= SUBMIT VOTE ================= */
  const handleVoteClick = () => {
    if (!selectedCandidate) return;
    setShowConfirm(true);
  };

  const submitVote = async () => {
    if (!selectedCandidate || !categoryId) return;

    const userStr = localStorage.getItem("yearbook-user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) return;

    const userId = user.id;

    const { data: existing } = await supabase
      .from("votes")
      .select("id")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .maybeSingle();

    if (existing) {
      navigate(`/already-voted/${categoryId}`);
      return;
    }

    /* INSERT */
    await supabase.from("votes").insert({
      user_id: userId,
      category_id: categoryId,
      candidate_id: selectedCandidate,
    });

    navigate(`/success/${categoryId}`);
  };

  if (!category)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  const Icon = iconMap[category.icon] || Sparkles;

  return (
    <div className="min-h-screen p-6 py-12">
      <div className="w-full max-w-6xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/categories")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </button>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/50 flex items-center justify-center">
                <Icon className="w-7 h-7 text-gray-800" />
              </div>

              <div>
                <h1 className="text-3xl text-gray-900">{category.name}</h1>
                <p className="text-gray-600 mt-1">
                  Select one candidate to vote for
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ================= NOTICE ================= */}
        <GlassCard className="p-4 mb-8 border-l-4 border-gray-800">
          <p className="text-sm text-gray-700">
            <strong>Important:</strong> You can only vote once for this
            category. Make sure to choose carefully!
          </p>
        </GlassCard>

        {/* ================= CANDIDATES ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {candidates.map((candidate) => {
            const imageSrc = new URL(
              `../img/kandidat/${candidate.photo}.jpg`,
              import.meta.url,
            ).href;

            return (
              <button
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate.id)}
                className="group relative text-left"
              >
                <GlassCard
                  hover
                  className={`p-6 h-full transition-all duration-300 group-hover:scale-105 ${
                    selectedCandidate === candidate.id
                      ? "ring-2 ring-gray-800 shadow-2xl"
                      : ""
                  }`}
                >
                  <div className="space-y-4">
                    {/* Photo */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200/60 to-gray-300/60 backdrop-blur-sm">
                      <ImageWithFallback
                        src={imageSrc}
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Selected Overlay */}
                      {selectedCandidate === candidate.id && (
                        <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl">
                            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                              <svg
                                className="w-7 h-7 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="text-center">
                      <h3 className="text-gray-900 mb-1">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">
                        Class {candidate.class}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </button>
            );
          })}
        </div>

        {/* ================= FOOTER ================= */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              {selectedCandidate ? (
                <>
                  <h4 className="text-gray-900 mb-1">Ready to vote?</h4>
                  <p className="text-sm text-gray-600">
                    You've selected{" "}
                    {candidates.find((c) => c.id === selectedCandidate)?.name}
                  </p>
                </>
              ) : (
                <>
                  <h4 className="text-gray-900 mb-1">No candidate selected</h4>
                  <p className="text-sm text-gray-600">
                    Please select a candidate above to continue
                  </p>
                </>
              )}
            </div>

            <GlassButton
              onClick={handleVoteClick}
              disabled={!selectedCandidate}
              size="lg"
            >
              Submit Vote
            </GlassButton>
          </div>
        </GlassCard>
      </div>
      <p className="text-center text-sm text-gray-500 mt-6">
        © 2026 Ignos Studio. All rights reserved.
      </p>

      {/* ================= CONFIRM MODAL ================= */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="p-8 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Konfirmasi Vote
            </h3>

            <p className="text-gray-600 text-sm mb-3">
              Yakin ingin memilih{" "}
              <span className="font-medium text-gray-900">
                {candidates.find((c) => c.id === selectedCandidate)?.name}
              </span>
              ?
              <br />
              <span className="text-xs text-red-500">
                Vote tidak bisa diubah setelah dikirim.
              </span>
            </p>

            <div className="flex gap-3 justify-center">
              <GlassButton
                variant="secondary"
                onClick={() => setShowConfirm(false)}
              >
                Batal
              </GlassButton>

              <GlassButton
                onClick={submitVote}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Ya, Vote
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ================= BACK TO TOP BUTTON ================= */}
      {showTop && (
        <button onClick={scrollToTop} className="scrolltotop">
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
