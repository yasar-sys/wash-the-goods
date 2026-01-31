import { Link, useLocation, useNavigate } from "react-router-dom";
import { WashingMachine, Wallet, LogOut, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageToggle from "@/components/LanguageToggle";

const Header = () => {
  const { t } = useLanguage();
  const { profile, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: t("dashboard"), href: "/dashboard" },
    { name: t("booking"), href: "/booking" },
    { name: t("recharge"), href: "/recharge" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary transition-shadow">
              <WashingMachine className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              {t("appName")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                  location.pathname.startsWith("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Shield className="w-4 h-4" />
                {t("admin")}
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {/* Balance */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">
                ৳{profile?.balance?.toLocaleString() || 0}
              </span>
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/recharge">
                <Button size="sm" className="bg-gradient-primary hover:opacity-90 shadow-primary">
                  <Wallet className="w-4 h-4 mr-1" />
                  {t("recharge")}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                {t("logout")}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in-up">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                    location.pathname.startsWith("/admin")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Shield className="w-4 h-4" />
                  {t("admin")}
                </Link>
              )}
              <div className="px-4 py-3">
                <LanguageToggle />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 mt-2">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-semibold">
                  {t("currentBalance")}: ৳{profile?.balance?.toLocaleString() || 0}
                </span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t("logout")}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
