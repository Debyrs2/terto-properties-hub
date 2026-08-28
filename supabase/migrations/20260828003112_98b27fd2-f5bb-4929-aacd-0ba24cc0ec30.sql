CREATE TABLE public.properties (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  status text NOT NULL DEFAULT 'available',
  deal_type text,
  area text,
  address text,
  maps_url text,
  nearby text,
  description text,
  price numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.property_media (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'photo',
  url text NOT NULL,
  storage_path text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX property_media_property_id_idx ON public.property_media(property_id);

CREATE TABLE public.site_settings (
  id boolean NOT NULL DEFAULT true PRIMARY KEY,
  whatsapp_primary text,
  whatsapp_secondary text,
  instagram_url text,
  instagram_handle text,
  creci text,
  broker_name text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id)
);

GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;

GRANT SELECT ON public.property_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_media TO authenticated;
GRANT ALL ON public.property_media TO service_role;

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Properties are publicly readable" ON public.properties FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manages properties" ON public.properties FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Media is publicly readable" ON public.property_media FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manages media" ON public.property_media FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Settings are publicly readable" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manages settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER properties_set_updated_at BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id, whatsapp_primary, whatsapp_secondary, instagram_url, instagram_handle, creci, broker_name)
VALUES (true, '81988490523', '81987785590', 'https://www.instagram.com/f.terto.imoveis', '@f.terto.imoveis', '23228', 'Fernando Terto');

INSERT INTO public.properties (title, status, deal_type, area, address, maps_url, nearby, description, price)
VALUES (
  'Área com casa construída em Candeias',
  'available',
  'sale',
  '1.450 m²',
  'Av. Ulisses Montarroyos, 5743 — Bairro de Candeias, Jaboatão dos Guararapes — PE (a 500 metros da praia)',
  'https://maps.app.goo.gl/kBp1o4RMjb2JnVRZ7',
  'Supermercado, Academias, Escolas, Restaurantes',
  'Possui casa construída no terreno. Área com potencial ideal para construção de prédio, escola, academia ou galpão, a critério do comprador.',
  NULL
);