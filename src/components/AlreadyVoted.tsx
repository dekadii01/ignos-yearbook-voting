import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";

interface Category {
  id: string;
  name: string;
}

export function AlreadyVoted() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;

      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .eq("id", categoryId)
        .single();

      setCategory(data);
    };

    fetchCategory();
  }, [categoryId]);

  if (!category) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        <GlassCard className="p-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/40 to-blue-600/40 backdrop-blur-xl border border-blue-300/40 shadow-2xl">
              <ShieldCheck className="w-12 h-12 text-blue-800" />
            </div>

            <div>
              <h1 className="text-4xl text-gray-900 mb-3">Already Voted</h1>

              <p className="text-gray-600 leading-relaxed">
                You have already voted for{" "}
                <strong className="text-gray-900">{category.name}</strong>.
              </p>
            </div>

            <GlassButton
              onClick={() => navigate("/categories")}
              size="lg"
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Categories
            </GlassButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
