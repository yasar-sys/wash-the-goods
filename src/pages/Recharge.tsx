import { useState } from "react";
import { Wallet, CreditCard, Smartphone, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const paymentMethods = [
  { id: "bkash", name: "bKash", color: "bg-pink-500" },
  { id: "nagad", name: "Nagad", color: "bg-orange-500" },
  { id: "rocket", name: "Rocket", color: "bg-purple-500" },
  { id: "card", name: "Card", color: "bg-blue-500" },
];

const quickAmounts = [100, 200, 500, 1000];

const Recharge = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const currentBalance = 1250;

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !paymentMethod) {
      toast.error("Please fill in all fields");
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount < 50) {
      toast.error("Minimum recharge amount is ৳50");
      return;
    }

    setIsLoading(true);

    // Simulate recharge - in real app, this would initiate payment
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Successfully recharged ৳${amount}!`);
      setAmount("");
      setPaymentMethod("");
    }, 2000);
  };

  const canSubmit = amount && paymentMethod && parseFloat(amount) >= 50;

  return (
    <div className="min-h-screen">
      <Header userName="John Doe" balance={currentBalance} isLoggedIn={true} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Recharge Balance</h1>
              <p className="text-muted-foreground text-sm">
                Add money to your SmartWash wallet
              </p>
            </div>
          </div>
        </div>

        {/* Current Balance Card */}
        <GlassCard className="mb-6 animate-fade-in-up animation-delay-100 overflow-hidden">
          <div className="bg-gradient-primary p-6 text-primary-foreground">
            <p className="text-sm opacity-90">Current Balance</p>
            <p className="text-4xl font-bold mt-1">৳{currentBalance.toLocaleString()}</p>
          </div>
        </GlassCard>

        {/* Recharge Form */}
        <GlassCard className="animate-fade-in-up animation-delay-200">
          <GlassCardHeader>
            <GlassCardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Enter Recharge Details
            </GlassCardTitle>
          </GlassCardHeader>

          <GlassCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Recharge Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    ৳
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 h-12 text-lg"
                    min="50"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">Minimum recharge: ৳50</p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Select</Label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleQuickAmount(value)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                        amount === value.toString()
                          ? "bg-primary text-primary-foreground shadow-primary"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      )}
                    >
                      ৳{value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  Payment Method
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        paymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm", method.color)}>
                          {method.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{method.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {method.id === "card" ? "Debit/Credit" : "Mobile Banking"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {amount && parseFloat(amount) >= 50 && (
                <div className="glass rounded-xl p-4 bg-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Recharge Amount</span>
                    <span className="font-semibold text-foreground">৳{amount}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">New Balance</span>
                    <span className="font-bold text-success">
                      ৳{(currentBalance + parseFloat(amount)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

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
                    Proceed to Pay
                  </>
                )}
              </Button>
            </form>
          </GlassCardContent>
        </GlassCard>
      </main>
    </div>
  );
};

export default Recharge;
