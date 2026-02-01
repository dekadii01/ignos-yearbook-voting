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
  ArrowUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { GlassCard } from "./GlassCard";
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

const iconMap: Record<string, any> = {
  Sparkles,
  Heart,
  Zap,
  Brain,
  Users,
  Trophy,
  Palette,
  Smile,
};

/* ================= HELPER ================= */

const formatTime = (ms: number) => {
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};

/* ================= COMPONENT ================= */

export function SummaryPage() {
  const [showTop, setShowTop] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [candidatesByCategory, setCandidatesByCategory] = useState<
    Record<string, Candidate[]>
  >({});

  const [openAt, setOpenAt] = useState<number | null>(null);
  const [serverNow, setServerNow] = useState<number | null>(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= BACK TO TOP VISIBILITY ================= */
  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 400);
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

  /* ================= SERVER TIME ================= */

  const getServerNow = async () => {
    const { data } = await supabase.rpc("now");
    return new Date(data).getTime();
  };

  /* ================= INIT ================= */

  useEffect(() => {
    const init = async () => {
      const { data: setting } = await supabase
        .from("settings")
        .select("summary_open_at")
        .single();

      if (!setting) return;

      setOpenAt(new Date(setting.summary_open_at).getTime());

      const now = await getServerNow();
      setServerNow(now);
    };

    init();
  }, []);

  /* ================= COUNTDOWN ================= */

  useEffect(() => {
    if (!openAt || !serverNow) return;

    const interval = setInterval(() => {
      setServerNow((prev) => {
        if (!prev) return prev;

        const next = prev + 1000;
        const diff = openAt - next;

        if (diff <= 0) {
          setIsOpen(true);
          setTimeLeft(0);
          clearInterval(interval);
        } else {
          setTimeLeft(diff);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [openAt, serverNow]);

  /* ================= LOAD SUMMARY ================= */

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      setLoading(true);

      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*");

      const { data: votesData } = await supabase
        .from("votes")
        .select("candidate_id");

      const { data: candidatesData } = await supabase
        .from("candidates")
        .select("*");

      if (!categoriesData || !votesData || !candidatesData) return;

      const voteCount: Record<string, number> = {};
      votesData.forEach((v) => {
        voteCount[v.candidate_id] = (voteCount[v.candidate_id] || 0) + 1;
      });

      const grouped: Record<string, Candidate[]> = {};

      categoriesData.forEach((cat) => {
        grouped[cat.id] = candidatesData
          .filter((c) => c.category_id === cat.id)
          .map((c) => ({
            ...c,
            votes: voteCount[c.id] || 0,
          }))
          .sort((a, b) => b.votes - a.votes);
      });

      setCategories(categoriesData);
      setCandidatesByCategory(grouped);
      setLoading(false);
    };

    load();
  }, [isOpen]);

  /* ================= COUNTDOWN UI ================= */

  if (!isOpen) {
    const { days, hours, minutes, seconds } = formatTime(timeLeft);

    const timeBlocks = [
      { label: "Days", value: days },
      { label: "Hours", value: hours },
      { label: "Minutes", value: minutes },
      { label: "Seconds", value: seconds },
    ];

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="p-12 text-center space-y-8 max-w-7xl mx-auto">
          {/* ICON */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full 
                        bg-gradient-to-br from-yellow-400/60 to-yellow-600/60 
                        border border-yellow-300/50 backdrop-blur-xl shadow-2xl"
          >
            <Trophy className="w-10 h-10" />
          </div>

          {/* TITLE */}
          <div>
            <h2 className="text-2xl text-gray-900 mb-2">Results Coming Soon</h2>
            <p className="text-gray-600 text-sm">
              Voting results will be revealed in
            </p>
          </div>

          {/* COUNTDOWN */}
          <div className="grid grid-cols-4 gap-4">
            {timeBlocks.map((t, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-md"
              >
                <p className="text-3xl font-semibold text-gray-900">
                  {String(t.value).padStart(2, "0")}
                </p>
                <p className="text-xs text-gray-600 mt-1 uppercase tracking-wide">
                  {t.label}
                </p>
              </div>
            ))}
          </div>

          {/* FOOTER NOTE */}
          <div className="pt-4">
            <p className="text-xs text-gray-500">
              🎉 Stay tuned! The winners will be announced shortly.
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  /* ================= RESULT ================= */

  return (
    <div className="min-h-screen max-w-7xl mx-auto space-y-10 p-6 py-10">
      {/* ================= HERO HEADER ================= */}
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Voting Results
        </h1>
        <p className="text-gray-600">Yearbook Voting SMPN 2 Abiansemal</p>
      </div>

      {/* ================= CATEGORIES ================= */}
      {categories.map((category) => {
        const list = candidatesByCategory[category.id];
        if (!list || list.length === 0) return null;

        const winnerId = list[0].id;
        const totalVotes = list.reduce((a, b) => a + b.votes, 0);
        const Icon = iconMap[category.icon] || Sparkles;

        return (
          <section key={category.id} className="space-y-6 mb-8">
            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {category.name}
                </h2>
              </div>

              <span className="text-sm text-gray-600 bg-white/40 backdrop-blur px-3 py-1 rounded-full border border-white/50">
                Total votes: {totalVotes}
              </span>
            </div>

            {/* ================= GRID ================= */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((c) => {
                const isWinner = c.id === winnerId;
                const imageSrc = new URL(
                  `../img/kandidat/${c.photo}.jpg`,
                  import.meta.url,
                ).href;
                const percentage = totalVotes
                  ? Math.round((c.votes / totalVotes) * 100)
                  : 0;

                return (
                  <GlassCard
                    key={c.id}
                    className={`
                    relative p-6 text-center space-y-4
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-2xl
                    ${isWinner ? "ring-2 ring-yellow-400 scale-105" : ""}
                  `}
                  >
                    {/* ================= WINNER BADGE ================= */}
                    {isWinner && (
                      <div className="absolute -top-3 -right-3 bg-yellow-400 text-white rounded-full p-2 shadow-lg">
                        <Crown className="w-4 h-4" />
                      </div>
                    )}

                    {/* ================= PHOTO ================= */}

                    <ImageWithFallback
                      src={imageSrc}
                      alt={c.name}
                      className={`
                      w-24 h-24 rounded-full mx-auto object-cover border-4
                      ${isWinner ? "border-yellow-400" : "border-white/50"}
                    `}
                    />

                    {/* ================= NAME ================= */}
                    <div>
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-600">{c.class}</p>
                    </div>

                    {/* ================= VOTES ================= */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {c.votes} votes • {percentage}%
                      </p>

                      {/* Progress bar */}
                      <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>
        );
      })}
      <p className="text-center text-sm text-gray-500">
        © 2026 Ignos Studio. All rights reserved.
      </p>

      {/* ================= BACK TO TOP BUTTON ================= */}
      {showTop && (
        <button onClick={scrollToTop} className="scrolltotop">
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
