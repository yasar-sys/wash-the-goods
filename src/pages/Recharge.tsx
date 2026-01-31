import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, CreditCard, Smartphone, CheckCircle, Upload, Image as ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const paymentMethods = [
  { id: "bkash", name: "bKash", nameBn: "বিকাশ", color: "bg-pink-500" },
  { id: "nagad", name: "Nagad", nameBn: "নগদ", color: "bg-orange-500" },
  { id: "rocket", name: "Rocket", nameBn: "রকেট", color: "bg-purple-500" },
  { id: "card", name: "Card", nameBn: "কার্ড", color: "bg-blue-500" },
];

const quickAmounts = [100, 200, 500, 1000];

const Recharge = () => {
  const { t, language } = useLanguage();
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !amount || !paymentMethod) {
      toast.error("Please fill in all required fields");
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount < 50) {
      toast.error(`${t("minRecharge")}: ৳50`);
      return;
    }

    setIsSubmitting(true);

    try {
      let screenshotUrl = null;

      // Upload screenshot if provided
      if (screenshot) {
        const fileExt = screenshot.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("recharge-screenshots")
          .upload(fileName, screenshot);

        if (uploadError) {
          console.error("Upload error:", uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from("recharge-screenshots")
            .getPublicUrl(fileName);
          screenshotUrl = urlData.publicUrl;
        }
      }

      // Create recharge request
      const { error } = await supabase.from("recharge_requests").insert({
        user_id: user.id,
        amount: numAmount,
        payment_method: paymentMethod,
        transaction_id: transactionId || null,
        screenshot_url: screenshotUrl,
        status: "pending",
      });

      if (error) {
        console.error("Recharge request error:", error);
        toast.error(t("error"));
        setIsSubmitting(false);
        return;
      }

      toast.success(t("rechargeSuccess"));
      setAmount("");
      setPaymentMethod("");
      setTransactionId("");
      setScreenshot(null);
      setScreenshotPreview(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(t("error"));
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const currentBalance = profile?.balance || 0;
  const canSubmit = amount && paymentMethod && parseFloat(amount) >= 50;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("rechargeBalance")}</h1>
              <p className="text-muted-foreground text-sm">
                {t("addMoney")}
              </p>
            </div>
          </div>
        </div>

        {/* Current Balance Card */}
        <GlassCard className="mb-6 animate-fade-in-up animation-delay-100 overflow-hidden">
          <div className="bg-gradient-primary p-6 text-primary-foreground">
            <p className="text-sm opacity-90">{t("currentBalance")}</p>
            <p className="text-4xl font-bold mt-1">৳{currentBalance.toLocaleString()}</p>
          </div>
        </GlassCard>

        {/* Recharge Form */}
        <GlassCard className="animate-fade-in-up animation-delay-200">
          <GlassCardHeader>
            <GlassCardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {t("rechargeAmount")}
            </GlassCardTitle>
          </GlassCardHeader>

          <GlassCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  {t("rechargeAmount")}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    ৳
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder={t("enterAmount")}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 h-12 text-lg"
                    min="50"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t("minRecharge")}: ৳50</p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("quickSelect")}</Label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleQuickAmount(value)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                        amount === value.toString()
                          ? "bg-primary text-primary-foreground shadow-primary"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      )}
                    >
                      ৳{value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  {t("paymentMethod")}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        paymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm", method.color)}>
                          {method.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {language === "bn" ? method.nameBn : method.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {method.id === "card" ? t("debitCredit") : t("mobileBanking")}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction ID */}
              <div className="space-y-2">
                <Label htmlFor="transactionId" className="text-sm font-medium">
                  {t("transactionId")} ({language === "en" ? "Optional" : "ঐচ্ছিক"})
                </Label>
                <Input
                  id="transactionId"
                  type="text"
                  placeholder={t("transactionId")}
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Screenshot Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("uploadScreenshot")} ({language === "en" ? "Optional" : "ঐচ্ছিক"})
                </Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                    screenshotPreview
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  {screenshotPreview ? (
                    <div className="space-y-2">
                      <img
                        src={screenshotPreview}
                        alt="Screenshot preview"
                        className="max-h-32 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Click to change" : "পরিবর্তন করতে ক্লিক করুন"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Click to upload screenshot" : "স্ক্রিনশট আপলোড করতে ক্লিক করুন"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {amount && parseFloat(amount) >= 50 && (
                <div className="glass rounded-xl p-4 bg-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">{t("rechargeAmount")}</span>
                    <span className="font-semibold text-foreground">৳{amount}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">{t("newBalance")}</span>
                    <span className="font-bold text-success">
                      ৳{(currentBalance + parseFloat(amount)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-primary text-base font-semibold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t("proceedToPay")}
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {t("pendingApproval")}
              </p>
            </form>
          </GlassCardContent>
        </GlassCard>
      </main>
    </div>
  );
};

export default Recharge;
