import { GraduationCap, Vote, ShieldCheck, Info, LogOut } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { useNavigate } from "react-router-dom";

interface LandingProps {
  onLogout: () => void;
}

export function Landing({ onLogout }: LandingProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("yearbook-user");
    onLogout();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/40 shadow-2xl mb-4">
            <GraduationCap className="w-10 h-10 text-gray-800" />
          </div>

          <h1 className="text-5xl tracking-tight text-gray-900">
            Yearbook Voting
          </h1>
          <h2 className="text-2xl text-gray-600">SMPN 2 Abiansemal</h2>
        </div>

        {/* Main Card */}
        <GlassCard className="p-8 md:p-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center">
                <Info className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="mb-2 text-gray-900">About This Voting</h3>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to the official yearbook voting for SMPN 2 Abiansemal!
                  Vote for your classmates in fun categories and help create
                  memorable yearbook awards.
                </p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center">
                  <Vote className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="mb-1 text-gray-900">One Vote Per Category</h4>
                  <p className="text-sm text-gray-600">
                    You can vote once for each category. Choose wisely!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="mb-1 text-gray-900">Fair & Respectful</h4>
                  <p className="text-sm text-gray-600">
                    Vote honestly and respectfully for your peers.
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />

            <div className="text-center pt-4 flex items-center justify-center gap-4">
              <GlassButton onClick={() => navigate("/categories")} size="lg">
                Start Voting
              </GlassButton>
              <GlassButton
                onClick={handleLogout}
                variant="secondary"
                className="gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        <p className="text-center text-sm text-gray-500">
          © 2026 Ignos Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}
