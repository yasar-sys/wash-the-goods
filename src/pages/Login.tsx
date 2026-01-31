import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WashingMachine, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, GlassCardContent, GlassCardHeader } from "@/components/ui/GlassCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import AnimatedBackground from "@/components/AnimatedBackground";
import DesignerCredit from "@/components/DesignerCredit";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { t, language } = useLanguage();
  const { signIn, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(t("loginError"));
      setIsLoading(false);
      return;
    }

    toast.success(t("success"));
    navigate("/dashboard");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Designer Credit */}
      <DesignerCredit />

      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl shadow-lg shadow-primary/30 mb-4 animate-float">
            <WashingMachine className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t("appName")}</h1>
          <p className="text-muted-foreground mt-2">{t("appTagline")}</p>
        </div>

        {/* Login Card */}
        <GlassCard className="animate-fade-in-up animation-delay-100">
          <GlassCardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-foreground">
              <LogIn className="w-5 h-5 text-primary" />
              {t("login")}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("enterCredentials")}
            </p>
          </GlassCardHeader>

          <GlassCardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-primary text-base font-semibold"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    {t("signIn")}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                {t("noAccount")}{" "}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {t("registerHere")}
                </Link>
              </p>
              <p className="text-sm">
                <Link
                  to="/manual"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  📖 {language === "bn" ? "ব্যবহারকারী ম্যানুয়াল" : "User Manual"}
                </Link>
              </p>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6 animate-fade-in-up animation-delay-200">
          © 2025 {t("appName")}. {t("copyright")}.
        </p>
      </div>
    </div>
  );
};

export default Login;
