import { Heart } from "lucide-react";

const DesignerCredit = () => {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-300">
        <span>Designed with</span>
        <Heart className="w-3 h-3 text-destructive fill-destructive animate-pulse" />
        <span>by</span>
        <span className="font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Samin Yasar
        </span>
      </div>
    </div>
  );
};

export default DesignerCredit;
