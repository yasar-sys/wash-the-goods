import { useEffect, useState } from "react";
import { Wallet, Search, CheckCircle, XCircle, Clock, Image as ImageIcon } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RechargeRequest {
  id: string;
  amount: number;
  payment_method: string;
  transaction_id: string | null;
  screenshot_url: string | null;
  status: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    phone: string | null;
  } | null;
}

const AdminRecharges = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [requests, setRequests] = useState<RechargeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("recharge_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
      setLoading(false);
      return;
    }

    // Fetch profiles separately
    const userIds = [...new Set(data?.map((r) => r.user_id) || [])];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, full_name, phone")
      .in("user_id", userIds);

    const profilesMap = new Map(profilesData?.map((p) => [p.user_id, p]) || []);

    const requestsWithProfiles = data?.map((request) => ({
      ...request,
      profiles: profilesMap.get(request.user_id) || null,
    })) || [];

    setRequests(requestsWithProfiles as RechargeRequest[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (request: RechargeRequest) => {
    if (!user) return;
    setProcessingId(request.id);

    try {
      // Add balance to user
      await supabase.rpc("add_balance", {
        p_user_id: request.user_id,
        p_amount: request.amount,
      });

      // Update request status
      const { error } = await supabase
        .from("recharge_requests")
        .update({
          status: "approved",
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (error) {
        toast.error(t("error"));
      } else {
        toast.success(t("approved"));
        fetchRequests();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(t("error"));
    }

    setProcessingId(null);
  };

  const handleReject = async (request: RechargeRequest) => {
    if (!user) return;
    setProcessingId(request.id);

    const { error } = await supabase
      .from("recharge_requests")
      .update({
        status: "rejected",
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    if (error) {
      toast.error(t("error"));
    } else {
      toast.success(t("rejected"));
      fetchRequests();
    }

    setProcessingId(null);
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.profiles?.full_name.toLowerCase().includes(search.toLowerCase()) ||
      req.transaction_id?.includes(search)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success/10 text-success";
      case "rejected":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-warning/10 text-warning";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            {t("rechargeRequests")}
          </h1>
          <p className="text-muted-foreground">
            {requests.filter((r) => r.status === "pending").length} {t("pending")}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <GlassCard key={request.id} hover={false}>
            <GlassCardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{request.profiles?.full_name}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                      <span className="capitalize">{request.payment_method}</span>
                      {request.transaction_id && (
                        <span>TxID: {request.transaction_id}</span>
                      )}
                      <span>
                        {new Date(request.created_at).toLocaleString(language === "bn" ? "bn-BD" : "en-US")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {request.screenshot_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImage(request.screenshot_url)}
                    >
                      <ImageIcon className="w-4 h-4 mr-1" />
                      {language === "en" ? "View" : "দেখুন"}
                    </Button>
                  )}

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{t("amount")}</p>
                    <p className="text-xl font-bold text-primary">৳{request.amount}</p>
                  </div>

                  {request.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request)}
                        disabled={processingId === request.id}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {t("approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(request)}
                        disabled={processingId === request.id}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        {t("reject")}
                      </Button>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status === "approved" ? t("approved") : t("rejected")}
                    </span>
                  )}
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t("noData")}
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="glass max-w-2xl">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Payment Screenshot" : "পেমেন্ট স্ক্রিনশট"}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Payment screenshot"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRecharges;
