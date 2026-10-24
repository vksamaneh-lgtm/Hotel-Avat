/**
 * Central Hotel Configuration File (Single Source of Truth)
 * 
 * To adapt this website for another hotel:
 * 1. Update this file with the new hotel's details (Name, Contact, Location, Coordinates, Brand).
 * 2. Update room types and photos in `src/data/rooms.ts`.
 * 3. Update `.env.local` if you wish to change analytics credentials.
 * 
 * All components, navigation, maps, contact buttons, WhatsApp tags, and SEO metadata
 * automatically inherit these configuration values.
 */

export interface HotelAttraction {
  id: number;
  coords: [number, number];
  routeMode: "WALKING" | "DRIVING";
  nameFa: string;
  nameEn: string;
  distFa: string;
  distEn: string;
  timeFa: string;
  timeEn: string;
  icon: string;
}

export interface HotelContactConfig {
  phone: {
    raw: string; // Dialing string without dashes; empty when no landline is published
    international: string; // E.164 dialing string
    displayFa: string; // Persian display value
    displayEn: string; // English display value
  };
  mobile: {
    raw: string; // Dialing string without dashes
    international: string; // E.164 dialing string
    displayFa: string; // Persian formatted display
    displayEn: string; // English formatted display
  };
  whatsapp: {
    number: string; // WhatsApp international digits only
  };
  social: {
    instagramUrl: string;
    instagramHandle: string;
    telegramUrl?: string;
    telegramHandle?: string;
    email?: string;
  };
}

export interface HotelLocationConfig {
  cityFa: string;
  cityEn: string;
  addressFa: string;
  addressEn: string;
  coordinates: [number, number]; // [Latitude, Longitude]
  mapZoom: number;
  mapCenterOffset?: [number, number];
  routingAlleyFa: string;
  routingAlleyEn: string;
}

export interface HotelFeaturesConfig {
  snappPay: {
    enabled: boolean;
    installmentCount: number;
    badgeFa: string;
    badgeEn: string;
    heroDescFa: string;
    heroDescEn: string;
  };
  establishedEraFa: string;
  establishedEraEn: string;
}

export interface HotelMetaConfig {
  id: string;
  siteUrl: string;
  nameFa: string;
  nameEn: string;
  fullNameFa: string;
  fullNameEn: string;
  subtitleFa: string;
  subtitleEn: string;
  badgeFa: string;
  badgeEn: string;
  metaTitleFa: string;
  metaTitleEn: string;
  metaDescriptionFa: string;
  metaDescriptionEn: string;
  keywordsFa: string[];
  keywordsEn: string[];
  ogImage: string;
}

export interface HotelBrandConfig {
  id: string;
  nameFa: string;
  nameEn: string;
  fullNameFa: string;
  fullNameEn: string;
  subtitleFa: string;
  subtitleEn: string;
}

export interface HotelConfig {
  id: string;
  brand: HotelBrandConfig;
  meta: HotelMetaConfig;
  contact: HotelContactConfig;
  location: HotelLocationConfig;
  features: HotelFeaturesConfig;
  attractions: HotelAttraction[];
}

export const hotelConfig: HotelConfig = {
  id: "avat",

  brand: {
    id: "avat",
    nameFa: "هتل آوات اصفهان",
    nameEn: "Avat Hotel Isfahan",
    fullNameFa: "هتل آوات اصفهان",
    fullNameEn: "Avat Hotel Isfahan",
    subtitleFa: "هتل یک‌ستاره ممتاز در شرق میدان نقش جهان",
    subtitleEn: "A distinguished one-star hotel east of Naqsh-e Jahan Square",
  },

  meta: {
    id: "avat",
    siteUrl: "https://hotelavat.com",
    nameFa: "هتل آوات اصفهان",
    nameEn: "Avat Hotel Isfahan",
    fullNameFa: "هتل آوات اصفهان",
    fullNameEn: "Avat Hotel Isfahan",
    subtitleFa: "هتل یک‌ستاره ممتاز در شرق میدان نقش جهان",
    subtitleEn: "A distinguished one-star hotel east of Naqsh-e Jahan Square",
    badgeFa: "اصفهان · شرق میدان نقش جهان",
    badgeEn: "Isfahan · East of Naqsh-e Jahan Square",
    metaTitleFa: "هتل آوات اصفهان | اقامت در شرق میدان نقش جهان",
    metaTitleEn: "Avat Hotel Isfahan | Stay near Naqsh-e Jahan Square",
    metaDescriptionFa:
      "هتل آوات اصفهان، هتل یک‌ستاره ممتاز در خیابان نشاط و شرق میدان نقش جهان با ۲۱ اتاق، صبحانه، پذیرش ۲۴ ساعته و دسترسی آسان به جاذبه‌های تاریخی اصفهان. رزرو مستقیم.",
    metaDescriptionEn:
      "Avat Hotel Isfahan is a distinguished one-star hotel on Neshat Street, east of Naqsh-e Jahan Square, with 21 rooms, breakfast, 24-hour reception, and easy access to Isfahan landmarks.",
    keywordsFa: [
      "هتل آوات اصفهان",
      "رزرو هتل اصفهان",
      "هتل نزدیک میدان نقش جهان",
      "هتل خیابان نشاط اصفهان",
      "هتل شرق میدان نقش جهان",
      "هتل یک ستاره اصفهان",
    ],
    keywordsEn: [
      "Avat Hotel Isfahan",
      "Book hotel in Isfahan",
      "Hotel near Naqsh-e Jahan Square",
      "Neshat Street hotel Isfahan",
      "One-star hotel Isfahan",
    ],
    ogImage: "/images/avat-exterior.jpeg",
  },

  contact: {
    phone: {
      raw: "03132200257",
      international: "+983132200257",
      displayFa: "۰۳۱-۳۲۲۰۰۲۵۷",
      displayEn: "031 322 00 257",
    },
    mobile: {
      raw: "09131196054",
      international: "+989131196054",
      displayFa: "۰۹۱۳-۱۱۱-۹۶۰۵۴",
      displayEn: "+98 913 119 6054",
    },
    whatsapp: {
      number: "989131196054",
    },
    social: {
      instagramUrl: "https://instagram.com/hotelavat",
      instagramHandle: "@hotelavat",
    },
  },

  location: {
    cityFa: "اصفهان",
    cityEn: "Isfahan",
    addressFa: "اصفهان، خیابان نشاط، کوچه ۲۰",
    addressEn: "Neshat Street, Alley 20, Isfahan",
    coordinates: [32.65505, 51.68004],
    mapZoom: 16,
    routingAlleyFa: "کوچه ۲۰",
    routingAlleyEn: "Alley 20",
  },

  features: {
    snappPay: {
      enabled: true,
      installmentCount: 4,
      badgeFa: "۴ قسطه با اسنپ‌پی",
      badgeEn: "4 installments with Snapp! Pay",
      heroDescFa: "امکان پرداخت در ۴ قسط با اسنپ‌پی (بدون کارمزد و ضامن)",
      heroDescEn: "Pay in 4 installments with Snapp! Pay (no fee or guarantor)",
    },
    establishedEraFa: "افتتاح ۱۴۰۲ · ۷ طبقه · ۲۱ اتاق",
    establishedEraEn: "Opened in 2023 · 7 floors · 21 rooms",
  },

  attractions: [
    {
      id: 0,
      coords: [32.65491, 51.67782],
      routeMode: "WALKING",
      nameFa: "مسجد امام اصفهان",
      nameEn: "Imam Mosque of Isfahan",
      distFa: "۱٫۱ کیلومتر",
      distEn: "1.1 km",
      timeFa: "حدود ۵ دقیقه پیاده",
      timeEn: "About 5 min walk",
      icon: "🕌",
    },
    {
      id: 1,
      coords: [32.65745, 51.67854],
      routeMode: "WALKING",
      nameFa: "مسجد شیخ لطف‌الله",
      nameEn: "Sheikh Lotfollah Mosque",
      distFa: "۱٫۲ کیلومتر",
      distEn: "1.2 km",
      timeFa: "حدود ۶ دقیقه پیاده",
      timeEn: "About 6 min walk",
      icon: "🏛️",
    },
    {
      id: 2,
      coords: [32.65790, 51.67742],
      routeMode: "WALKING",
      nameFa: "میدان نقش جهان",
      nameEn: "Naqsh-e Jahan Square",
      distFa: "۹۵۰ متر",
      distEn: "950 m",
      timeFa: "حدود ۸ دقیقه پیاده",
      timeEn: "About 8 min walk",
      icon: "📍",
    },
    {
      id: 3,
      coords: [32.65710, 51.67670],
      routeMode: "WALKING",
      nameFa: "کاخ عالی‌قاپو",
      nameEn: "Ali Qapu Palace",
      distFa: "۱٫۲ کیلومتر",
      distEn: "1.2 km",
      timeFa: "حدود ۸ دقیقه پیاده",
      timeEn: "About 8 min walk",
      icon: "🏛️",
    },
    {
      id: 4,
      coords: [32.65720, 51.67700],
      routeMode: "DRIVING",
      nameFa: "کاخ چهل‌ستون",
      nameEn: "Chehel Sotoun Palace",
      distFa: "۲٫۱ کیلومتر",
      distEn: "2.1 km",
      timeFa: "حدود ۵ دقیقه با خودرو",
      timeEn: "About 5 min drive",
      icon: "🏛️",
    },
    {
      id: 5,
      coords: [32.63697, 51.68331],
      routeMode: "DRIVING",
      nameFa: "پل خواجو",
      nameEn: "Khaju Bridge",
      distFa: "۲٫۲ کیلومتر",
      distEn: "2.2 km",
      timeFa: "حدود ۴ دقیقه با خودرو",
      timeEn: "About 4 min drive",
      icon: "🌉",
    },
    {
      id: 6,
      coords: [32.64600, 51.67750],
      routeMode: "DRIVING",
      nameFa: "سی‌وسه‌پل",
      nameEn: "Si-o-se-pol Bridge",
      distFa: "۲٫۸ کیلومتر",
      distEn: "2.8 km",
      timeFa: "حدود ۶ دقیقه با خودرو",
      timeEn: "About 6 min drive",
      icon: "🌉",
    },
  ],
};

export default hotelConfig;
