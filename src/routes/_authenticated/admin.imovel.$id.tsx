import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { removeStorageFile, uploadPhoto } from "@/lib/admin-media";
import { MAX_PHOTOS, MAX_VIDEOS, type Media } from "@/lib/property";

export const Route = createFileRoute("/_authenticated/admin/imovel/$id")({
  head: () => ({
    meta: [
      { title: "Editar imóvel | Fernando Terto Imóveis" },
      { name: "description", content: "Edição de imóvel no painel administrativo." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Editar imóvel" },
      { property: "og:description", content: "Edição de imóvel no painel administrativo." },
    ],
  }),
  component: AdminProperty,
});

type FormState = {
  title: string;
  status: string;
  deal_type: string;
  area: string;
  address: string;
  maps_url: string;
  nearby: string;
  description: string;
  price: string;
};

const empty: FormState = {
  title: "",
  status: "available",
  deal_type: "",
  area: "",
  address: "",
  maps_url: "",
  nearby: "",
  description: "",
  price: "",
};

function AdminProperty() {
  const { id } = Route.useParams();
  const isNew = id === "novo";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(empty);
  const [videoUrl, setVideoUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const property = useQuery({
    queryKey: ["admin", "property", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const media = useQuery({
    queryKey: ["admin", "media", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_media")
        .select("*")
        .eq("property_id", id)
        .order("position", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as Media[];
    },
  });

  useEffect(() => {
    if (!property.data) return;
    const row = property.data as Record<string, unknown>;
    setForm({
      title: (row["title"] as string) ?? "",
      status: (row["status"] as string) ?? "available",
      deal_type: (row["deal_type"] as string) ?? "",
      area: (row["area"] as string) ?? "",
      address: (row["address"] as string) ?? "",
      maps_url: (row["maps_url"] as string) ?? "",
      nearby: (row["nearby"] as string) ?? "",
      description: (row["description"] as string) ?? "",
      price: row["price"] === null || row["price"] === undefined ? "" : String(row["price"]),
    });
  }, [property.data]);

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setBusy(true);
    const payload = {
      title: form.title || null,
      status: form.status,
      deal_type: form.deal_type || null,
      area: form.area || null,
      address: form.address || null,
      maps_url: form.maps_url || null,
      nearby: form.nearby || null,
      description: form.description || null,
      price: form.price ? Number(form.price) : null,
    };
    if (isNew) {
      const { data, error } = await supabase
        .from("properties")
        .insert(payload)
        .select("id")
        .single();
      setBusy(false);
      if (error || !data) {
        toast.error("Não foi possível salvar.");
        return;
      }
      toast.success("Imóvel criado.");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      navigate({ to: "/admin/imovel/$id", params: { id: data.id }, replace: true });
      return;
    }
    const { error } = await supabase.from("properties").update(payload).eq("id", id);
    setBusy(false);
    if (error) {
      toast.error("Não foi possível salvar.");
      return;
    }
    toast.success("Imóvel atualizado.");
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    queryClient.invalidateQueries({ queryKey: ["property", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
  };

  const photos = (media.data ?? []).filter((m) => m.kind === "photo");
  const videos = (media.data ?? []).filter((m) => m.kind === "video");

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || isNew) return;
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      toast.error(`Limite de ${MAX_PHOTOS} fotos atingido.`);
      return;
    }
    setBusy(true);
    let position = photos.length;
    for (const file of Array.from(files).slice(0, room)) {
      try {
        const uploaded = await uploadPhoto(id, file);
        await supabase.from("property_media").insert({
          property_id: id,
          kind: "photo",
          url: uploaded.url,
          storage_path: uploaded.storage_path,
          position: position++,
        });
      } catch {
        toast.error(`Falha ao enviar ${file.name}`);
      }
    }
    setBusy(false);
    queryClient.invalidateQueries({ queryKey: ["admin", "media", id] });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    queryClient.invalidateQueries({ queryKey: ["property", id] });
  };

  const onUploadVideo = async (file: File | null, input: HTMLInputElement) => {
    if (!file || isNew) return;
    if (videos.length >= MAX_VIDEOS) {
      toast.error(`Limite de ${MAX_VIDEOS} vídeos atingido.`);
      return;
    }
    setUploadingVideo(true);
    try {
      const uploaded = await uploadVideo(id, file);
      const { error } = await supabase.from("property_media").insert({
        property_id: id,
        kind: "video",
        url: uploaded.url,
        storage_path: uploaded.storage_path,
        position: videos.length,
      });
      if (error) throw new Error(error.message);
      toast.success("Vídeo enviado.");
      input.value = "";
      queryClient.invalidateQueries({ queryKey: ["admin", "media", id] });
      queryClient.invalidateQueries({ queryKey: ["property", id] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao enviar o vídeo.");
    } finally {
      setUploadingVideo(false);
    }
  };

  const addVideo = async () => {

    if (!videoUrl.trim() || isNew) return;
    if (videos.length >= MAX_VIDEOS) {
      toast.error(`Limite de ${MAX_VIDEOS} vídeos atingido.`);
      return;
    }
    const { error } = await supabase.from("property_media").insert({
      property_id: id,
      kind: "video",
      url: videoUrl.trim(),
      position: videos.length,
    });
    if (error) {
      toast.error("Não foi possível adicionar o vídeo.");
      return;
    }
    setVideoUrl("");
    queryClient.invalidateQueries({ queryKey: ["admin", "media", id] });
    queryClient.invalidateQueries({ queryKey: ["property", id] });
  };

  const removeMedia = async (item: Media) => {
    await supabase.from("property_media").delete().eq("id", item.id);
    await removeStorageFile(item.storage_path);
    queryClient.invalidateQueries({ queryKey: ["admin", "media", id] });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    queryClient.invalidateQueries({ queryKey: ["property", id] });
  };

  return (
    <div className="container-page max-w-3xl py-10">
      <Link
        to="/admin"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao painel
      </Link>

      <h1 className="font-display text-3xl font-semibold">
        {isNew ? "Novo imóvel" : "Editar imóvel"}
      </h1>

      <div className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Situação</Label>
            <select
              id="status"
              className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="available">Disponível</option>
              <option value="sold">Vendido</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deal">Negociação</Label>
            <select
              id="deal"
              className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
              value={form.deal_type}
              onChange={(e) => set("deal_type", e.target.value)}
            >
              <option value="">Não informado</option>
              <option value="sale">Venda</option>
              <option value="rent">Aluguel</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => set("price", e.target.value.replace(/[^\d.]/g, ""))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Metragem</Label>
            <Input id="area" value={form.area} onChange={(e) => set("area", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maps">Link do Google Maps</Label>
          <Input id="maps" value={form.maps_url} onChange={(e) => set("maps_url", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nearby">Lugares próximos (separados por vírgula)</Label>
          <Input id="nearby" value={form.nearby} onChange={(e) => set("nearby", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Informações adicionais</Label>
          <Textarea
            id="description"
            rows={6}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <Button onClick={save} disabled={busy}>
          Salvar
        </Button>
      </div>

      {!isNew && (
        <div className="mt-14 space-y-10">
          <section className="space-y-3">
            <h2 className="text-xs tracking-[0.3em] uppercase">
              Fotos ({photos.length}/{MAX_PHOTOS})
            </h2>
            <Input
              type="file"
              accept="image/*"
              multiple
              disabled={busy}
              onChange={(e) => onUpload(e.target.files)}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-md border">
                  <img
                    src={photo.url}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    aria-label="Remover foto"
                    className="absolute top-1 right-1 h-7 w-7"
                    onClick={() => removeMedia(photo)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs tracking-[0.3em] uppercase">
              Vídeos ({videos.length}/{MAX_VIDEOS})
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="URL do vídeo (YouTube ou arquivo)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Button onClick={addVideo} className="shrink-0">
                Adicionar link
              </Button>
            </div>
            <div className="space-y-2 rounded-lg border p-3">
              <Label htmlFor="videofile" className="text-sm">
                Ou enviar arquivo de vídeo (MP4, MOV ou WEBM — até 200 MB)
              </Label>
              <Input
                id="videofile"
                type="file"
                accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                disabled={uploadingVideo || videos.length >= MAX_VIDEOS}
                onChange={(e) => onUploadVideo(e.target.files?.[0] ?? null, e.currentTarget)}
              />
              {uploadingVideo && (
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Enviando vídeo… isso pode levar
                  alguns minutos.
                </p>
              )}
            </div>

            <ul className="divide-y rounded-lg border">
              {videos.map((video) => (
                <li
                  key={video.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3 text-sm"
                >
                  <span className="truncate">{video.url}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remover vídeo"
                    className="shrink-0"
                    onClick={() => removeMedia(video)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
