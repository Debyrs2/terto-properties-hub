import type { Lang } from "./i18n";

const digits = (value: string) => value.replace(/\D/g, "");

export const whatsappNumber = (raw: string | null | undefined) => {
  const clean = digits(raw ?? "");
  if (!clean) return "";
  return clean.startsWith("55") ? clean : `55${clean}`;
};

export const displayNumber = (raw: string | null | undefined) => {
  const clean = digits(raw ?? "").replace(/^55/, "");
  if (clean.length < 10) return raw ?? "";
  return `(${clean.slice(0, 2)}) ${clean.slice(2, clean.length - 4)}-${clean.slice(-4)}`;
};

const messages = {
  pt: {
    one: (titles: string) => `Olá! Vi o imóvel "${titles}" no site e gostaria de saber mais informações.`,
    many: (titles: string) => `Olá! Vi os imóveis ${titles} no site e gostaria de saber mais informações.`,
    general: "Olá! Vim através do site e gostaria de tirar algumas dúvidas.",
    and: "e",
  },
  en: {
    one: (titles: string) => `Hello! I saw the property "${titles}" on the website and would like more information.`,
    many: (titles: string) => `Hello! I saw the properties ${titles} on the website and would like more information.`,
    general: "Hello! I came through the website and would like to ask a few questions.",
    and: "and",
  },
  es: {
    one: (titles: string) => `¡Hola! Vi el inmueble "${titles}" en el sitio y me gustaría saber más información.`,
    many: (titles: string) => `¡Hola! Vi los inmuebles ${titles} en el sitio y me gustaría saber más información.`,
    general: "¡Hola! Vine a través del sitio y me gustaría hacer algunas preguntas.",
    and: "y",
  },
} as const;

export function whatsappLink(
  number: string | null | undefined,
  titles: string[],
  lang: Lang = "pt",
) {
  const m = messages[lang] ?? messages.pt;
  let text: string;
  if (titles.length === 0) text = m.general;
  else if (titles.length === 1) text = m.one(titles[0]!);
  else {
    const quoted = titles.map((t) => `"${t}"`);
    const last = quoted.pop()!;
    text = m.many(`${quoted.join(", ")} ${m.and} ${last}`);
  }
  return `https://wa.me/${whatsappNumber(number)}?text=${encodeURIComponent(text)}`;
}
