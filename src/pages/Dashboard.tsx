import { WashingMachine, Coffee, CreditCard, Wallet, Zap, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import BookingCard from "@/components/BookingCard";
import { Button } from "@/components/ui/button";

// Mock data - in real app, this would come from an API
const mockUser = {
  name: "John Doe",
  balance: 1250,
};

const mockBookings = [
  {
    id: 1,
    date: new Date(),
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    location: "Block A - Floor 2",
    amount: 50,
    otp: "847291",
    isToday: true,
  },
  {
    id: 2,
    date: new Date(Date.now() + 86400000), // Tomorrow
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    location: "Block B - Floor 1",
    amount: 50,
    otp: "193847",
    isToday: false,
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Header 
        userName={mockUser.name} 
        balance={mockUser.balance} 
        isLoggedIn={true} 
      />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, <span className="text-primary">{mockUser.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your bookings and services from here
          </p>
        </div>

        {/* Quick Access Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Quick Access</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="animate-fade-in-up animation-delay-100">
              <ServiceCard
                title="Book Washing"
                description="৳50 per slot"
                status="Available"
                icon={WashingMachine}
                href="/booking"
                variant="washing"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-200">
              <ServiceCard
                title="Tea & Coffee"
                description="Instant hot beverages"
                status="Ready"
                icon={Coffee}
                href="/tea-coffee"
                variant="coffee"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-300">
              <ServiceCard
                title="Register Card"
                description="NFC/RFID card"
                status="Click to register"
                icon={CreditCard}
                href="/card-register"
                variant="card"
              />
            </div>

            <div className="animate-fade-in-up animation-delay-400">
              <ServiceCard
                title="Add Balance"
                description="bKash, Nagad, Rocket"
                status="Instant"
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
              <h2 className="text-lg font-semibold text-foreground">Your Active Bookings</h2>
            </div>
            <Link to="/booking">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Book New Slot
              </Button>
            </Link>
          </div>

          {mockBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mockBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <BookingCard
                    date={booking.date}
                    startTime={booking.startTime}
                    endTime={booking.endTime}
                    location={booking.location}
                    amount={booking.amount}
                    otp={booking.otp}
                    isToday={booking.isToday}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-10 text-center">
              <WashingMachine className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Active Bookings
              </h3>
              <p className="text-muted-foreground mb-6">
                You don't have any active bookings right now
              </p>
              <Link to="/booking">
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Book Your First Slot
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
