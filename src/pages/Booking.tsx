import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WashingMachine, MapPin, Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const WASHING_PRICE = 50;

const locations = [
  { id: "1", name: "Block A - Floor 1" },
  { id: "2", name: "Block A - Floor 2" },
  { id: "3", name: "Block B - Floor 1" },
  { id: "4", name: "Block B - Floor 2" },
];

const timeSlots = [
  "06:00 AM", "07:30 AM", "09:00 AM", "10:30 AM",
  "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM",
  "06:00 PM", "07:30 PM", "09:00 PM",
];

// Mock user balance
const userBalance = 1250;

const Booking = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userBalance < WASHING_PRICE) {
      toast.error("Insufficient balance. Please recharge first.");
      return;
    }

    setIsLoading(true);

    // Simulate booking - in real app, this would call an API
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Booking confirmed! Check your dashboard for OTP.");
      navigate("/dashboard");
    }, 1500);
  };

  const canSubmit = location && date && time && userBalance >= WASHING_PRICE;

  return (
    <div className="min-h-screen">
      <Header userName="John Doe" balance={userBalance} isLoggedIn={true} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <WashingMachine className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Book Washing Slot</h1>
              <p className="text-muted-foreground text-sm">
                Reserve your washing machine time
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
                <p className="font-medium text-foreground">Insufficient Balance</p>
                <p className="text-sm text-muted-foreground">
                  You need at least ৳{WASHING_PRICE} to book a slot. Please recharge first.
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
              Select Booking Details
            </GlassCardTitle>
          </GlassCardHeader>

          <GlassCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Location
                </Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select washing location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Booking Date
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
                  Time Slot
                </Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot} - {getEndTime(slot)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Summary */}
              <div className="glass rounded-xl p-4 bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground">Washing Price</span>
                  <span className="font-semibold text-foreground">৳{WASHING_PRICE}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold text-foreground">1.5 hours</span>
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">Your Balance</span>
                  <span className={`font-bold ${userBalance >= WASHING_PRICE ? 'text-success' : 'text-destructive'}`}>
                    ৳{userBalance}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!canSubmit || isLoading}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-primary text-base font-semibold disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Booking - ৳{WASHING_PRICE}
                  </>
                )}
              </Button>
            </form>
          </GlassCardContent>
        </GlassCard>

        {/* Info Section */}
        <div className="mt-6 glass rounded-xl p-5 animate-fade-in-up animation-delay-200">
          <h3 className="font-medium text-foreground mb-3">Booking Information</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              Each slot is 1.5 hours long
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              OTP is valid during first hour of booking only
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              You can book up to 7 days in advance
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              Cancellations must be made 2 hours before slot time
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

// Helper function to calculate end time
function getEndTime(startTime: string): string {
  const [time, period] = startTime.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  
  let hour24 = hours;
  if (period === "PM" && hours !== 12) hour24 += 12;
  if (period === "AM" && hours === 12) hour24 = 0;
  
  const endHour24 = hour24 + 1;
  const endMinutes = (minutes + 30) % 60;
  
  let endHour = endHour24 % 12;
  if (endHour === 0) endHour = 12;
  const endPeriod = endHour24 >= 12 ? "PM" : "AM";
  
  return `${endHour.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")} ${endPeriod}`;
}

export default Booking;
