import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en" | "es";

const dict = {
  pt: {
    "nav.properties": "Imóveis",
    "nav.contact": "Contato",
    "nav.talk": "Falar com o corretor",
    "hero.eyebrow": "Conectando pessoas aos melhores imóveis",
    "hero.title": "Imóveis selecionados em Pernambuco",
    "hero.subtitle":
      "Acompanhamento próximo e transparente na compra, venda e locação do seu próximo endereço.",
    "hero.cta": "Ver imóveis",
    "list.title": "Imóveis",
    "list.empty": "Nenhum imóvel encontrado.",
    "filter.all": "Todos",
    "filter.status": "Situação",
    "filter.deal": "Negociação",
    "status.available": "Disponível",
    "status.sold": "Vendido",
    "deal.sale": "Venda",
    "deal.rent": "Aluguel",
    "price.ask": "Consulte o valor",
    "prop.untitled": "Imóvel",
    "prop.area": "Metragem",
    "prop.address": "Endereço",
    "prop.map": "Ver no mapa",
    "prop.nearby": "Lugares próximos",
    "prop.about": "Informações adicionais",
    "prop.price": "Preço",
    "prop.photos": "Fotos",
    "prop.videos": "Vídeos",
    "prop.back": "Voltar",
    "prop.notfound": "Imóvel não encontrado.",
    "contact.title": "Contato",
    "contact.subtitle": "Fale diretamente com o corretor pelo WhatsApp.",
    "contact.doubts": "Apenas tirar dúvidas",
    "contact.choose": "Selecione os imóveis de interesse",
    "contact.chooseHint": "Escolha um ou mais imóveis, ou siga apenas com dúvidas gerais.",
    "contact.send": "Abrir WhatsApp",
    "contact.instagram": "Instagram",
    "contact.whatsapp": "WhatsApp",
    "footer.rights": "Todos os direitos reservados.",
    "theme.toggle": "Alternar tema",
    "lang.label": "Idioma",
  },
  en: {
    "nav.properties": "Properties",
    "nav.contact": "Contact",
    "nav.talk": "Talk to the broker",
    "hero.eyebrow": "Connecting people to the finest properties",
    "hero.title": "Curated properties in Pernambuco",
    "hero.subtitle":
      "Close, transparent guidance to buy, sell or rent your next address.",
    "hero.cta": "Browse properties",
    "list.title": "Properties",
    "list.empty": "No properties found.",
    "filter.all": "All",
    "filter.status": "Status",
    "filter.deal": "Deal",
    "status.available": "Available",
    "status.sold": "Sold",
    "deal.sale": "For sale",
    "deal.rent": "For rent",
    "price.ask": "Price on request",
    "prop.untitled": "Property",
    "prop.area": "Area",
    "prop.address": "Address",
    "prop.map": "View on map",
    "prop.nearby": "Nearby places",
    "prop.about": "Additional information",
    "prop.price": "Price",
    "prop.photos": "Photos",
    "prop.videos": "Videos",
    "prop.back": "Back",
    "prop.notfound": "Property not found.",
    "contact.title": "Contact",
    "contact.subtitle": "Talk directly to the broker on WhatsApp.",
    "contact.doubts": "Just ask a question",
    "contact.choose": "Select the properties you are interested in",
    "contact.chooseHint": "Pick one or more properties, or continue with general questions.",
    "contact.send": "Open WhatsApp",
    "contact.instagram": "Instagram",
    "contact.whatsapp": "WhatsApp",
    "footer.rights": "All rights reserved.",
    "theme.toggle": "Toggle theme",
    "lang.label": "Language",
  },
  es: {
    "nav.properties": "Inmuebles",
    "nav.contact": "Contacto",
    "nav.talk": "Hablar con el corredor",
    "hero.eyebrow": "Conectando personas con los mejores inmuebles",
    "hero.title": "Inmuebles seleccionados en Pernambuco",
    "hero.subtitle":
      "Acompañamiento cercano y transparente para comprar, vender o alquilar su próxima dirección.",
    "hero.cta": "Ver inmuebles",
    "list.title": "Inmuebles",
    "list.empty": "Ningún inmueble encontrado.",
    "filter.all": "Todos",
    "filter.status": "Situación",
    "filter.deal": "Negociación",
    "status.available": "Disponible",
    "status.sold": "Vendido",
    "deal.sale": "Venta",
    "deal.rent": "Alquiler",
    "price.ask": "Consulte el valor",
    "prop.untitled": "Inmueble",
    "prop.area": "Superficie",
    "prop.address": "Dirección",
    "prop.map": "Ver en el mapa",
    "prop.nearby": "Lugares cercanos",
    "prop.about": "Información adicional",
    "prop.price": "Precio",
    "prop.photos": "Fotos",
    "prop.videos": "Videos",
    "prop.back": "Volver",
    "prop.notfound": "Inmueble no encontrado.",
    "contact.title": "Contacto",
    "contact.subtitle": "Hable directamente con el corredor por WhatsApp.",
    "contact.doubts": "Solo hacer preguntas",
    "contact.choose": "Seleccione los inmuebles de interés",
    "contact.chooseHint": "Elija uno o más inmuebles, o continúe solo con dudas generales.",
    "contact.send": "Abrir WhatsApp",
    "contact.instagram": "Instagram",
    "contact.whatsapp": "WhatsApp",
    "footer.rights": "Todos los derechos reservados.",
    "theme.toggle": "Cambiar tema",
    "lang.label": "Idioma",
  },
} as const;

export type TranslationKey = keyof (typeof dict)["pt"];

const I18nContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}>({ lang: "pt", setLang: () => {}, t: (k) => dict.pt[k] });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const saved = window.localStorage.getItem("terto-lang") as Lang | null;
    if (saved && saved in dict) setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("terto-lang", l);
    document.documentElement.lang = l === "pt" ? "pt-BR" : l;
  }, []);

  const t = useCallback((key: TranslationKey) => dict[lang][key] ?? dict.pt[key], [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
