import { useEffect, useState } from "react";
import { Calendar, Search, Clock, MapPin } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  amount: number;
  otp: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    phone: string | null;
  } | null;
  locations: {
    name: string;
    name_bn: string | null;
  } | null;
}

const AdminBookings = () => {
  const { t, language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          locations (
            name,
            name_bn
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        return;
      }

      // Fetch profiles separately
      const userIds = [...new Set(data?.map((b) => b.user_id) || [])];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone")
        .in("user_id", userIds);

      const profilesMap = new Map(profilesData?.map((p) => [p.user_id, p]) || []);

      const bookingsWithProfiles = data?.map((booking) => ({
        ...booking,
        profiles: profilesMap.get(booking.user_id) || null,
      })) || [];

      setBookings(bookingsWithProfiles as Booking[]);
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.profiles?.full_name.toLowerCase().includes(search.toLowerCase()) ||
      booking.otp.includes(search)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "completed":
        return "bg-primary/10 text-primary";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            {t("manageBookings")}
          </h1>
          <p className="text-muted-foreground">{bookings.length} {t("totalBookings")}</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredBookings.map((booking) => {
          const locationName = language === "bn" && booking.locations?.name_bn
            ? booking.locations.name_bn
            : booking.locations?.name;

          return (
            <GlassCard key={booking.id} hover={false}>
              <GlassCardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-primary text-primary-foreground rounded-xl w-14 h-14 flex flex-col items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-lg font-bold leading-none">
                        {new Date(booking.booking_date).getDate().toString().padStart(2, "0")}
                      </span>
                      <span className="text-[10px] uppercase opacity-90">
                        {new Date(booking.booking_date).toLocaleString(language === "bn" ? "bn-BD" : "en-US", { month: "short" })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{booking.profiles?.full_name}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {locationName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">OTP</p>
                      <p className="font-mono font-bold text-primary">{booking.otp}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t("amount")}</p>
                      <p className="font-bold text-foreground">৳{booking.amount}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          );
        })}

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t("noData")}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
