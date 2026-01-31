import { Clock, MapPin, CheckCircle, Key } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  amount: number;
  otp: string;
  isToday?: boolean;
  className?: string;
}

const BookingCard = ({
  date,
  startTime,
  endTime,
  location,
  amount,
  otp,
  isToday = false,
  className,
}: BookingCardProps) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });

  return (
    <div
      className={cn(
        "glass rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl",
        isToday && "ring-2 ring-primary shadow-glow",
        className
      )}
    >
      {/* Header */}
      <div className="p-5 flex items-start gap-4 border-b border-border/50">
        <div className="bg-gradient-primary text-primary-foreground rounded-xl w-16 h-16 flex flex-col items-center justify-center shadow-lg">
          <span className="text-2xl font-bold leading-none">{day}</span>
          <span className="text-xs uppercase tracking-wide opacity-90">{month}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">Washing Machine Booking</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time Slot:
          </span>
          <span className="font-medium text-foreground">
            {startTime} - {endTime}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium text-foreground">1.5 hours</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-medium text-foreground">৳{amount}</span>
        </div>
      </div>

      {/* OTP Section */}
      <div className="bg-primary/5 p-5 border-t border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Key className="w-4 h-4" />
          Your OTP:
        </div>
        <div className="text-3xl font-mono font-bold text-primary tracking-[0.3em] text-center py-2">
          {otp}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
          Works only during first hour of booking
        </p>
      </div>

      {/* Status */}
      <div className="px-5 py-3 bg-success/5 border-t border-border/50 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
          <CheckCircle className="w-4 h-4" />
          Active
        </span>
        {isToday && (
          <span className="text-xs text-muted-foreground">
            Today's booking
          </span>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
