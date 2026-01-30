import { useEffect, useState } from "react";
import { GraduationCap, User, Lock, AlertCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await onLogin(username.trim(), password.trim());
    } catch (err) {
      setError("Username atau password salah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/40 shadow-2xl mb-4">
            <GraduationCap className="w-10 h-10 text-gray-800" />
          </div>
          <h1 className="text-4xl text-gray-900 mb-2">Login</h1>
          <h2 className="text-gray-600">Yearbook Voting SMPN 2 Abiansemal</h2>
        </div>

        {/* Form */}
        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-gray-900">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/40 backdrop-blur-xl border border-white/60"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-gray-900">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/40 backdrop-blur-xl border border-white/60"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-200 text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <GlassButton type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Memproses..." : "Masuk"}
            </GlassButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
