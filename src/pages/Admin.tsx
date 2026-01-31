import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Shield, Users, MapPin, Calendar, Wallet, BarChart3, Settings,
  Menu, X, WashingMachine, ChevronRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Admin sub-pages
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminLocations from "./admin/AdminLocations";
import AdminBookings from "./admin/AdminBookings";
import AdminRecharges from "./admin/AdminRecharges";

const Admin = () => {
  const { t } = useLanguage();
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const navigation = [
    { name: t("dashboard"), href: "/admin", icon: BarChart3 },
    { name: t("manageUsers"), href: "/admin/users", icon: Users },
    { name: t("manageLocations"), href: "/admin/locations", icon: MapPin },
    { name: t("manageBookings"), href: "/admin/bookings", icon: Calendar },
    { name: t("rechargeRequests"), href: "/admin/recharges", icon: Wallet },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass border-r border-border/50 transform transition-transform lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border/50">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-lg text-foreground">{t("adminPanel")}</span>
                <p className="text-xs text-muted-foreground">{t("appName")}</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground shadow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
                {isActive(item.href) && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50 space-y-3">
            <LanguageToggle />
            <Link to="/dashboard">
              <Button variant="outline" className="w-full">
                <WashingMachine className="w-4 h-4 mr-2" />
                {t("dashboard")}
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden glass sticky top-0 z-30 border-b border-border/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-foreground">{t("adminPanel")}</span>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/locations" element={<AdminLocations />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/recharges" element={<AdminRecharges />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;
