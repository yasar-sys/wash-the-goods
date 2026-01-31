import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WashingMachine, Mail, Lock, Eye, EyeOff, UserPlus, User, Phone, LogIn, AlertCircle, CreditCard } from "lucide-react";
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

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  studentId: z.string().min(1, "Student ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate input
    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    const { error: signUpError } = await signUp(
      formData.email,
      formData.password,
      formData.fullName,
      formData.phone,
      formData.studentId
    );

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("This email is already registered. Please login instead.");
      } else {
        setError(t("registerError"));
      }
      setIsLoading(false);
      return;
    }

    toast.success("Registration successful! Please check your email to verify your account.");
    navigate("/");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-10">
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
          <p className="text-muted-foreground mt-2">{t("createAccount")}</p>
        </div>

        {/* Register Card */}
        <GlassCard className="animate-fade-in-up animation-delay-100">
          <GlassCardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-foreground">
              <UserPlus className="w-5 h-5 text-primary" />
              {t("register")}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("fillDetails")}
            </p>
          </GlassCardHeader>

          <GlassCardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  {t("fullName")}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder={t("fullName")}
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("email")}
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  {t("phone")}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t("phone")}
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-sm font-medium">
                  {t("studentId")}
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="studentId"
                    name="studentId"
                    type="text"
                    placeholder={t("studentId")}
                    value={formData.studentId}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("password")}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t("confirmPassword")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("confirmPassword")}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-primary text-base font-semibold mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t("createAccount")}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                {t("hasAccount")}{" "}
                <Link
                  to="/"
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  {t("loginHere")}
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

export default Register;
