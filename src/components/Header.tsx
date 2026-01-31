import { Link, useLocation } from "react-router-dom";
import { WashingMachine, Wallet, LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  userName?: string;
  balance?: number;
  isLoggedIn?: boolean;
}

const Header = ({ userName = "User", balance = 0, isLoggedIn = false }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Book Washing", href: "/booking" },
    { name: "Recharge", href: "/recharge" },
  ];

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary transition-shadow">
              <WashingMachine className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              SmartWash
            </span>
          </Link>

          {isLoggedIn ? (
            <>
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
              </nav>

              {/* Right Side */}
              <div className="flex items-center gap-3">
                {/* Balance */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">৳{balance.toLocaleString()}</span>
                </div>

                {/* User Menu */}
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/recharge">
                    <Button size="sm" className="bg-gradient-primary hover:opacity-90 shadow-primary">
                      <Wallet className="w-4 h-4 mr-1" />
                      Recharge
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="sm">
                      <LogOut className="w-4 h-4 mr-1" />
                      Logout
                    </Button>
                  </Link>
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
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isLoggedIn && mobileMenuOpen && (
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
              <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 mt-2">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-semibold">Balance: ৳{balance.toLocaleString()}</span>
              </div>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
