import { CheckCircle2, Home, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { supabase } from "../lib/supabase";

interface Category {
  id: string;
  name: string;
  icon: string;
}

export function SuccessPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [category, setCategory] = useState<Category | null>(null);

  // ✅ fetch category dari DB (biar aman kalau refresh)
  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryId) return;

      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single();

      setCategory(data);
    };

    loadCategory();
  }, [categoryId]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        <GlassCard className="p-12">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400/60 to-green-600/60 backdrop-blur-xl border border-green-300/50 shadow-2xl animate-pulse">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>

            {/* Success Message */}
            <div>
              <h1 className="text-4xl text-gray-900 mb-3">Vote Submitted!</h1>
              <p className="text-gray-600 leading-relaxed">
                Your vote for{" "}
                <strong className="text-gray-900">{category.name}</strong> has
                been successfully recorded. Thank you for participating!
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent my-8" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton
                onClick={() => navigate("/categories")}
                variant="secondary"
                size="lg"
                className="gap-2"
              >
                <span>Vote Other Categories</span>
                <ArrowRight className="w-5 h-5" />
              </GlassButton>

              <GlassButton
                onClick={() => navigate("/")}
                size="lg"
                className="gap-2"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </GlassButton>
            </div>

            {/* Fun Message */}
            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm border border-white/30">
              <p className="text-sm text-gray-600">
                💡 Don’t forget to vote in the other categories too!
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
