import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  status: string;
  icon: LucideIcon;
  href: string;
  variant?: "washing" | "coffee" | "card" | "recharge";
  className?: string;
}

const variantStyles = {
  washing: "hover:border-primary/50 [&_.icon-bg]:bg-gradient-primary",
  coffee: "hover:border-warning/50 [&_.icon-bg]:bg-gradient-warning",
  card: "hover:border-success/50 [&_.icon-bg]:bg-gradient-success",
  recharge: "hover:border-secondary/50 [&_.icon-bg]:bg-gradient-secondary",
};

const ServiceCard = ({
  title,
  description,
  status,
  icon: Icon,
  href,
  variant = "washing",
  className,
}: ServiceCardProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "glass rounded-xl p-5 flex items-center gap-4 transition-all duration-200",
        "hover:shadow-xl hover:-translate-y-1 group cursor-pointer",
        variantStyles[variant],
        className
      )}
    >
      <div className="icon-bg w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
        <Icon className="w-7 h-7 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <span className="inline-block mt-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
          {status}
        </span>
      </div>
    </Link>
  );
};

export default ServiceCard;
