import { useEffect, useState } from "react";
import { Users, Calendar, Wallet, TrendingUp, Clock } from "lucide-react";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/GlassCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingRecharges: number;
}

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingRecharges: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Get total bookings and revenue
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("amount");

        const totalBookings = bookingsData?.length || 0;
        const totalRevenue = bookingsData?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;

        // Get pending recharges
        const { count: pendingCount } = await supabase
          .from("recharge_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        setStats({
          totalUsers: usersCount || 0,
          totalBookings,
          totalRevenue,
          pendingRecharges: pendingCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: t("totalUsers"),
      value: stats.totalUsers,
      icon: Users,
      color: "bg-gradient-primary",
    },
    {
      title: t("totalBookings"),
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-gradient-secondary",
    },
    {
      title: t("totalRevenue"),
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-gradient-success",
    },
    {
      title: t("pendingRecharges"),
      value: stats.pendingRecharges,
      icon: Clock,
      color: "bg-gradient-warning",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("dashboard")}</h1>
        <p className="text-muted-foreground">{t("appName")} - {t("adminPanel")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <GlassCard key={stat.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <GlassCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
