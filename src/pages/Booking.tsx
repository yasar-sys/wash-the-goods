import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WashingMachine, MapPin, Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AnimatedBackground from "@/components/AnimatedBackground";
import DesignerCredit from "@/components/DesignerCredit";

const WASHING_PRICE = 50;

const timeSlots = [
  "06:00", "07:30", "09:00", "10:30",
  "12:00", "13:30", "15:00", "16:30",
  "18:00", "19:30", "21:00",
];

interface Location {
  id: string;
  name: string;
  name_bn: string | null;
}

const Booking = () => {
  const { t, language } = useLanguage();
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [locations, setLocations] = useState<Location[]>([]);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, name_bn")
        .eq("status", "active")
        .order("name");

      if (error) {
        console.error("Error fetching locations:", error);
      } else {
        setLocations(data || []);
      }
    };

    fetchLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !profile) return;

    if (profile.balance < WASHING_PRICE) {
      toast.error(t("insufficientBalance"));
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Calculate end time (1.5 hours later)
      const [hours, minutes] = time.split(":").map(Number);
      const endHours = hours + 1;
      const endMinutes = (minutes + 30) % 60;
      const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;

      // Deduct balance
      const { data: balanceDeducted, error: balanceError } = await supabase
        .rpc("deduct_balance", {
          p_user_id: user.id,
          p_amount: WASHING_PRICE,
        });

      if (balanceError || !balanceDeducted) {
        toast.error(t("insufficientBalance"));
        setIsSubmitting(false);
        return;
      }

      // Create booking
      const { error: bookingError } = await supabase.from("bookings").insert({
        user_id: user.id,
        location_id: location,
        booking_date: date,
        start_time: time,
        end_time: endTime,
        amount: WASHING_PRICE,
        otp,
        status: "active",
      });

      if (bookingError) {
        console.error("Booking error:", bookingError);
        // Refund balance if booking fails
        await supabase.rpc("add_balance", {
          p_user_id: user.id,
          p_amount: WASHING_PRICE,
        });
        toast.error(t("bookingError"));
        setIsSubmitting(false);
        return;
      }

      await refreshProfile();
      toast.success(t("bookingConfirmed"));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast.error(t("bookingError"));
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

  const userBalance = profile?.balance || 0;
  const canSubmit = location && date && time && userBalance >= WASHING_PRICE;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <DesignerCredit />
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <WashingMachine className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t("bookSlot")}</h1>
              <p className="text-muted-foreground text-sm">
                {t("reserveTime")}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Warning */}
        {userBalance < WASHING_PRICE && (
          <div className="glass rounded-xl p-4 mb-6 border-l-4 border-destructive animate-fade-in-up">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{t("insufficientBalance")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("minRecharge")}: ৳{WASHING_PRICE}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <GlassCard className="animate-fade-in-up animation-delay-100">
          <GlassCardHeader>
            <GlassCardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {t("selectLocation")}
            </GlassCardTitle>
          </GlassCardHeader>

          <GlassCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {t("location")}
                </Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t("selectLocation")} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {language === "bn" && loc.name_bn ? loc.name_bn : loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {t("bookingDate")}
                </Label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>

              {/* Time Slot */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {t("timeSlot")}
                </Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t("selectTime")} />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => {
                      const [h, m] = slot.split(":").map(Number);
                      const endH = h + 1;
                      const endM = (m + 30) % 60;
                      const endSlot = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
                      return (
                        <SelectItem key={slot} value={slot}>
                          {slot} - {endSlot}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Summary */}
              <div className="glass rounded-xl p-4 bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground">{t("washingPrice")}</span>
                  <span className="font-semibold text-foreground">৳{WASHING_PRICE}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground">{t("duration")}</span>
                  <span className="font-semibold text-foreground">1.5 {t("hours")}</span>
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">{t("yourBalance")}</span>
                  <span className={`font-bold ${userBalance >= WASHING_PRICE ? "text-success" : "text-destructive"}`}>
                    ৳{userBalance}
                  </span>
                </div>
              </div>

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
                    {t("confirmBooking")} - ৳{WASHING_PRICE}
                  </>
                )}
              </Button>
            </form>
          </GlassCardContent>
        </GlassCard>

        {/* Info Section */}
        <div className="mt-6 glass rounded-xl p-5 animate-fade-in-up animation-delay-200">
          <h3 className="font-medium text-foreground mb-3">{t("bookingInfo")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              {t("slotDuration")}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              {t("otpValidNote")}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              {t("advanceBooking")}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              {t("cancellationNote")}
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Booking;
