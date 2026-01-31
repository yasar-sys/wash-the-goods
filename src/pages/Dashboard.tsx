import { useEffect, useState } from "react";
import { WashingMachine, Coffee, CreditCard, Wallet, Zap, Plus, Clock, MapPin, Key, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AnimatedBackground from "@/components/AnimatedBackground";
import DesignerCredit from "@/components/DesignerCredit";

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  amount: number;
  otp: string;
  status: string;
  locations: {
    name: string;
    name_bn: string | null;
  } | null;
}

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_date,
          start_time,
          end_time,
          amount,
          otp,
          status,
          locations (
            name,
            name_bn
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "active")
        .gte("booking_date", today)
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        setBookings(data || []);
      }
      setLoadingBookings(false);
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <DesignerCredit />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("welcomeBack")}, <span className="text-primary">{profile?.full_name || "User"}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("dashboardDesc")}
          </p>
        </div>

        {/* Quick Access Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t("quickAccess")}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="animate-fade-in-up animation-delay-100">
              <ServiceCard
                title={t("bookWashing")}
                description={`৳50 ${t("perSlot")}`}
                status={t("available")}
                icon={WashingMachine}
                href="/booking"
                variant="washing"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-200">
              <ServiceCard
                title={t("teaCoffee")}
                description={t("hotBeverages")}
                status={t("ready")}
                icon={Coffee}
                href="/tea-coffee"
                variant="coffee"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-300">
              <ServiceCard
                title={t("registerCard")}
                description={t("nfcCard")}
                status={t("clickToRegister")}
                icon={CreditCard}
                href="/card-register"
                variant="card"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-400">
              <ServiceCard
                title={t("addBalance")}
                description={t("paymentMethods")}
                status={t("instant")}
                icon={Wallet}
                href="/recharge"
                variant="recharge"
              />
            </div>
          </div>
        </section>

        {/* Active Bookings Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <WashingMachine className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">{t("activeBookings")}</h2>
            </div>
            <Link to="/booking">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                {t("bookNewSlot")}
              </Button>
            </Link>
          </div>

          {loadingBookings ? (
            <div className="glass rounded-xl p-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookings.map((booking, index) => {
                const isToday = booking.booking_date === today;
                const date = new Date(booking.booking_date);
                const day = date.getDate().toString().padStart(2, "0");
                const month = date.toLocaleString(language === "bn" ? "bn-BD" : "en-US", { month: "short" });
                const locationName = language === "bn" && booking.locations?.name_bn 
                  ? booking.locations.name_bn 
                  : booking.locations?.name;

                return (
                  <div
                    key={booking.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className={`glass rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl ${isToday ? "ring-2 ring-primary shadow-glow" : ""}`}>
                      {/* Header */}
                      <div className="p-5 flex items-start gap-4 border-b border-border/50">
                        <div className="bg-gradient-primary text-primary-foreground rounded-xl w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                          <span className="text-2xl font-bold leading-none">{day}</span>
                          <span className="text-xs uppercase tracking-wide opacity-90">{month}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground">{t("bookWashing")}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {locationName}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {t("timeSlot")}:
                          </span>
                          <span className="font-medium text-foreground">
                            {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("duration")}:</span>
                          <span className="font-medium text-foreground">1.5 {t("hours")}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("amount")}:</span>
                          <span className="font-medium text-foreground">৳{booking.amount}</span>
                        </div>
                      </div>

                      {/* OTP Section */}
                      <div className="bg-primary/5 p-5 border-t border-border/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Key className="w-4 h-4" />
                          {t("yourOtp")}:
                        </div>
                        <div className="text-3xl font-mono font-bold text-primary tracking-[0.3em] text-center py-2">
                          {booking.otp}
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                          {t("otpNote")}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="px-5 py-3 bg-success/5 border-t border-border/50 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                          <CheckCircle className="w-4 h-4" />
                          {t("active")}
                        </span>
                        {isToday && (
                          <span className="text-xs text-muted-foreground">
                            {t("todaysBooking")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass rounded-xl p-10 text-center">
              <WashingMachine className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t("noActiveBookings")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("noBookingsDesc")}
              </p>
              <Link to="/booking">
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("bookFirstSlot")}
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
