export interface FeaturedInItem {
  key: string;
  imageSrc: string;
  url: string;
  alt: string;
}

export const FEATURED_IN: FeaturedInItem[] = [
  {
    key: "1",
    imageSrc: require("@site/static/img/Featured/f1_g.png").default,
    url: "https://tech.eu/2025/06/18/one-ware-raises-eur25m-to-automate-ai-model-configuration-across-industries/",
    alt: "Tech.eu",
  },
  {
    key: "3",
    imageSrc: require("@site/static/img/Featured/f4_g.png").default,
    url: "https://www.elektronikpraxis.de/one-ai-automatisierte-ki-konfiguration-fuer-entwickler-a-09fee486cec031ed0a2edd5dbeeaed0a/",
    alt: "Elektronikpraxis",
  },
  {
    key: "6",
    imageSrc: require("@site/static/img/Featured/f9_g.png").default,
    url: "https://www.vdi-nachrichten.com/technik/automation/ki-im-maschinenbau-auf-bestehender-hardware-nutzen/",
    alt: "VDI Nachrichten",
  },
  {
    key: "7",
    imageSrc: require("@site/static/img/Featured/f10_g.png").default,
    url: "https://www.elektormagazine.com/news/one-ai-vision-edge-ai-en",
    alt: "Elektor",
  },
  {
    key: "8",
    imageSrc: require("@site/static/img/Partner/altera_w.png").default,
    url: "https://go.altera.com/l/1090322/2025-04-18/2vvzbn",
    alt: "Altera",
  },
];
