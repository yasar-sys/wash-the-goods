import { useEffect, useState } from "react";
import { MapPin, Plus, Edit2, Trash2 } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Location {
  id: string;
  name: string;
  name_bn: string | null;
  description: string | null;
  status: string;
}

const AdminLocations = () => {
  const { t, language } = useLanguage();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    name_bn: "",
    description: "",
  });

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching locations:", error);
    } else {
      setLocations(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingLocation) {
      const { error } = await supabase
        .from("locations")
        .update({
          name: formData.name,
          name_bn: formData.name_bn || null,
          description: formData.description || null,
        })
        .eq("id", editingLocation.id);

      if (error) {
        toast.error(t("error"));
      } else {
        toast.success(t("success"));
        fetchLocations();
      }
    } else {
      const { error } = await supabase.from("locations").insert({
        name: formData.name,
        name_bn: formData.name_bn || null,
        description: formData.description || null,
        status: "active",
      });

      if (error) {
        toast.error(t("error"));
      } else {
        toast.success(t("success"));
        fetchLocations();
      }
    }

    setDialogOpen(false);
    setEditingLocation(null);
    setFormData({ name: "", name_bn: "", description: "" });
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      name_bn: location.name_bn || "",
      description: location.description || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === "en" ? "Are you sure?" : "আপনি কি নিশ্চিত?")) return;

    const { error } = await supabase.from("locations").delete().eq("id", id);

    if (error) {
      toast.error(t("error"));
    } else {
      toast.success(t("success"));
      fetchLocations();
    }
  };

  const toggleStatus = async (location: Location) => {
    const newStatus = location.status === "active" ? "inactive" : "active";
    const { error } = await supabase
      .from("locations")
      .update({ status: newStatus })
      .eq("id", location.id);

    if (error) {
      toast.error(t("error"));
    } else {
      fetchLocations();
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
            <MapPin className="w-6 h-6 text-primary" />
            {t("manageLocations")}
          </h1>
          <p className="text-muted-foreground">{locations.length} {t("location")}</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingLocation(null);
            setFormData({ name: "", name_bn: "", description: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              {language === "en" ? "Add Location" : "লোকেশন যোগ করুন"}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>
                {editingLocation 
                  ? (language === "en" ? "Edit Location" : "লোকেশন সম্পাদনা") 
                  : (language === "en" ? "Add Location" : "লোকেশন যোগ করুন")}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{language === "en" ? "Name (English)" : "নাম (ইংরেজি)"}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "en" ? "Name (Bangla)" : "নাম (বাংলা)"}</Label>
                <Input
                  value={formData.name_bn}
                  onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === "en" ? "Description" : "বিবরণ"}</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary">
                {t("save")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {locations.map((location) => (
          <GlassCard key={location.id} hover={false}>
            <GlassCardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{location.name}</h3>
                    {location.name_bn && (
                      <p className="text-sm text-muted-foreground">{location.name_bn}</p>
                    )}
                    {location.description && (
                      <p className="text-xs text-muted-foreground mt-1">{location.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(location)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      location.status === "active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {location.status === "active" ? t("active") : "Inactive"}
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(location)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(location.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        ))}

        {locations.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t("noData")}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLocations;
