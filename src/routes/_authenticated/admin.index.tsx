import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Painel | Fernando Terto Imóveis" },
      { name: "description", content: "Painel de administração do site." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel" },
      { property: "og:description", content: "Painel de administração do site." },
    ],
  }),
  component: AdminHome,
});

type PropertyRow = {
  id: string;
  title: string | null;
  status: string;
  deal_type: string | null;
  created_at: string;
};

function AdminHome() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const properties = useQuery({
    queryKey: ["admin", "properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, status, deal_type, created_at")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as PropertyRow[];
    },
  });

  const leads = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, email, created_at")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const settings = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const value = (key: string) =>
    form[key] ?? ((settings.data as Record<string, string | null> | null)?.[key] ?? "");

  const saveSettings = async () => {
    const payload = {
      id: true,
      whatsapp_primary: value("whatsapp_primary"),
      whatsapp_secondary: value("whatsapp_secondary"),
      instagram_url: value("instagram_url"),
      instagram_handle: value("instagram_handle"),
      creci: value("creci"),
      broker_name: value("broker_name"),
    };
    const { error } = await supabase.from("site_settings").upsert(payload);
    if (error) {
      toast.error("Não foi possível salvar.");
      return;
    }
    toast.success("Configurações salvas.");
    queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
  };

  const deleteProperty = async (id: string) => {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      toast.error("Não foi possível excluir.");
      return;
    }
    toast.success("Imóvel excluído.");
    queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const changePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("A confirmação não confere com a nova senha.");
      return;
    }
    if (!currentPassword) {
      toast.error("Informe a senha atual.");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      current_password: currentPassword,
    } as { password: string; current_password: string });
    setSavingPassword(false);
    if (error) {
      toast.error("Não foi possível alterar a senha. Verifique a senha atual.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Senha alterada com sucesso.");
  };

  const fields: { key: string; label: string }[] = [
    { key: "broker_name", label: "Nome do corretor" },
    { key: "creci", label: "CRECI" },
    { key: "whatsapp_primary", label: "WhatsApp principal" },
    { key: "whatsapp_secondary", label: "WhatsApp secundário" },
    { key: "instagram_handle", label: "Instagram (@)" },
    { key: "instagram_url", label: "Instagram (URL)" },
  ];

  return (
    <div className="container-page py-10">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <Logo />
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="shrink-0">
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </header>

      <Tabs defaultValue="properties" className="mt-10">
        <TabsList>
          <TabsTrigger value="properties">Imóveis</TabsTrigger>
          <TabsTrigger value="leads">E-mails capturados</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="password">Senha</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="mt-6 space-y-4">
          <Button asChild>
            <Link to="/admin/imovel/$id" params={{ id: "novo" }}>
              <Plus className="mr-2 h-4 w-4" /> Novo imóvel
            </Link>
          </Button>
          <ul className="divide-y rounded-lg border">
            {(properties.data ?? []).map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4"
              >
                <div className="min-w-0">
                  <Link
                    to="/admin/imovel/$id"
                    params={{ id: p.id }}
                    className="hover:text-accent block truncate font-medium transition-colors"
                  >
                    {p.title || "Sem título"}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant={p.status === "sold" ? "secondary" : "default"}>
                      {p.status === "sold" ? "Vendido" : "Disponível"}
                    </Badge>
                    {p.deal_type && (
                      <Badge variant="outline">
                        {p.deal_type === "rent" ? "Aluguel" : "Venda"}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  aria-label="Excluir imóvel"
                  onClick={() => deleteProperty(p.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
            {properties.data?.length === 0 && (
              <li className="text-muted-foreground p-4 text-sm">Nenhum imóvel cadastrado.</li>
            )}
          </ul>
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <ul className="divide-y rounded-lg border">
            {(leads.data ?? []).map((lead) => (
              <li
                key={lead.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 text-sm"
              >
                <span className="truncate">{lead.email}</span>
                <span className="text-muted-foreground shrink-0">
                  {new Date(lead.created_at).toLocaleString("pt-BR")}
                </span>
              </li>
            ))}
            {leads.data?.length === 0 && (
              <li className="text-muted-foreground p-4 text-sm">Nenhum e-mail capturado ainda.</li>
            )}
          </ul>
        </TabsContent>

        <TabsContent value="settings" className="mt-6 max-w-xl space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                value={value(field.key) ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
              />
            </div>
          ))}
          <Button onClick={saveSettings}>Salvar configurações</Button>
        </TabsContent>

        <TabsContent value="password" className="mt-6 max-w-md space-y-4">
          <p className="text-muted-foreground text-sm">
            Escolha uma senha com pelo menos 8 caracteres. Você continuará conectado após a
            alteração.
          </p>
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha atual</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova senha</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar nova senha</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button onClick={changePassword} disabled={savingPassword}>
            Alterar senha
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
