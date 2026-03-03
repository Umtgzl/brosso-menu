import React, { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import { menuData } from "./data/menu";
import { getGeminiResponse } from "./services/geminiService";

const CURRENCY = "₺";
const MILK_TEXT = "Süt Seçenekleri: Laktozsuz · Badem · Yulaf";

const CATEGORIES = [
  { id: "hot-brosso", name: "Hot Brosso", iconId: "coffee-hot" },
  { id: "ice-brosso", name: "Ice Brosso", iconId: "coffee-cold" },
  { id: "third-wave", name: "3. Nesil Demleme", iconId: "brew" },
  { id: "frappe", name: "Frappeler", iconId: "coffee-cold" },
  { id: "hot-drinks", name: "Sıcak İçecekler", iconId: "coffee-hot" },
  { id: "tea", name: "Tea", iconId: "tea" },
  { id: "soft-drinks", name: "Soft Drinks", iconId: "bottle" },
  { id: "sandwiches", name: "Sandviçler", iconId: "sandwich" },
  { id: "desserts", name: "Desserts", iconId: "cake" },
  { id: "matcha", name: "Matcha", iconId: "leaf" },
  { id: "ice-matcha", name: "Ice Matcha", iconId: "leaf" },
];

const CATEGORY_BG: Record<string, string> = {
  "hot-brosso":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop&q=70",
  "ice-brosso":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&auto=format&fit=crop&q=70",
  "third-wave":
    "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=900&auto=format&fit=crop&q=70",
  frappe:
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&auto=format&fit=crop&q=70",
  "hot-drinks":
    "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=900&auto=format&fit=crop&q=70",
  tea: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=900&auto=format&fit=crop&q=70",
  "soft-drinks":
    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=900&auto=format&fit=crop&q=70",
  sandwiches:
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=900&auto=format&fit=crop&q=70",
  desserts:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&auto=format&fit=crop&q=70",
  matcha:
    "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=900&auto=format&fit=crop&q=70",
  "ice-matcha":
    "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=900&auto=format&fit=crop&q=70",
};

const FALLBACK_IMAGES: Record<string, string> = {
  "hot-brosso":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
  "ice-brosso":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
  "third-wave":
    "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600",
  frappe: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
  "hot-drinks":
    "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600",
  tea: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600",
  "soft-drinks":
    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600",
  sandwiches:
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600",
  desserts:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600",
  matcha: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600",
  "ice-matcha":
    "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600",
};

// ====== Icons =====
const SparklesIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </svg>
);

const XIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const SendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const BotIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const CategoryIcon = ({ iconId }: { iconId?: string }) => {
  const icons: Record<string, ReactNode> = {
    "coffee-hot": (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <path d="M7 2c0 1.6.7 2.2 1.8 3.2" />
        <path d="M11 2c0 1.6.7 2.2 1.8 3.2" />
        <path d="M15 2c0 1.6.7 2.2 1.8 3.2" />
      </svg>
    ),
    "coffee-cold": (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 4h12l-1 16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 4Z" />
        <path d="M8 8h8" />
        <path d="M9 12l2-2 2 2 2-2" />
        <path d="M10 15h4" />
        <path d="M9.5 6l1.5-2h2l1.5 2" />
      </svg>
    ),
    tea: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 9h1a3.5 3.5 0 0 1 0 7h-1" />
        <path d="M4 9h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" />
        <path d="M9 3c0 1.2.5 1.8 1.6 2.7" />
      </svg>
    ),
    bottle: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 2h4" />
        <path d="M10 2v3l-1 1v3c0 1-2 2-2 4v6a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-6c0-2-2-3-2-4V6l-1-1V2" />
        <path d="M9 11h6" />
      </svg>
    ),
    cake: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
        <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
        <path d="M2 21h20" />
        <path d="M7 8v2" />
        <path d="M12 8v2" />
        <path d="M17 8v2" />
        <path d="M7 4h.01" />
        <path d="M12 4h.01" />
        <path d="M17 4h.01" />
      </svg>
    ),
    leaf: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    brew: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 3h10" />
        <path d="M9 3v3" />
        <path d="M15 3v3" />
        <path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" />
        <path d="M9 12h6" />
        <path d="M10 15h4" />
      </svg>
    ),
    sandwich: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M3 11V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
        <path d="M3 15h18" />
      </svg>
    ),
  };
  return iconId ? icons[iconId] || null : null;
};

// ====== AI UI ======
const QuickChip = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-xs px-3 py-1.5 rounded-full bg-white border border-beige-dark text-text-muted hover:text-text-dark hover:bg-beige transition"
    type="button"
  >
    {text}
  </button>
);

const AiBarista = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: 'Hoş geldin! "sıcak kahveleri listele", "latte fiyat" ya da "öneri" yazabilirsin.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const pushUser = async (t: string) => {
    const user = (t || "").trim();
    if (!user || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: user }]);
    setIsLoading(true);

    try {
      const res = await getGeminiResponse(user);
      setMessages((prev) => [...prev, { role: "model", text: res }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Bir hata oldu. Tekrar dener misin?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const send = () => pushUser(input);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md bg-cream rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[88vh] max-h-[680px] border border-beige-dark animate-fade-in-up">
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <span className="text-yellow-300">
                <SparklesIcon size={20} />
              </span>
            </div>
            <div>
              <div className="font-semibold text-lg">Brosso Barista</div>
              <div className="text-xs text-white/70">Hızlı yardım</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10"
            aria-label="Kapat"
            type="button"
          >
            <XIcon />
          </button>
        </div>

        <div className="px-4 py-3 bg-white border-b border-beige-dark flex flex-wrap gap-2">
          <QuickChip
            text="Sıcak kahveler"
            onClick={() => pushUser("sıcak kahveleri listele")}
          />
          <QuickChip
            text="Soğuk kahveler"
            onClick={() => pushUser("soğuk kahveleri listele")}
          />
          <QuickChip
            text="Tatlılar"
            onClick={() => pushUser("tatlıları göster")}
          />
          <QuickChip
            text="Kategoriler"
            onClick={() => pushUser("kategorileri göster")}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-beige/50 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md ${m.role === "user" ? "bg-neutral-900 text-cream" : "bg-khaki text-white"}`}
              >
                {m.role === "user" ? <UserIcon /> : <BotIcon />}
              </div>
              <div
                className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-neutral-900 text-white rounded-br-none"
                    : "bg-white text-text-dark border border-beige-dark rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2">
              <div className="w-9 h-9 rounded-full bg-khaki text-white flex items-center justify-center shrink-0 shadow-md">
                <BotIcon />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-beige-dark shadow-sm text-sm text-text-muted">
                Yazıyorum...
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div className="p-4 bg-white border-t border-beige-dark">
          <div className="flex items-center gap-2 bg-beige rounded-full px-4 py-2 border border-transparent focus-within:border-khaki">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Bir şey sor... (örn: latte fiyat)"
              className="flex-1 bg-transparent outline-none text-text-dark text-sm py-2 placeholder-text-muted"
              aria-label="Mesaj"
            />
            <button
              onClick={send}
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-khaki text-white rounded-full hover:bg-khaki-dark disabled:opacity-50 shadow-md"
              aria-label="Gönder"
              type="button"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== Auto images =====
const UNSPLASH_SIZE = 420;
const IMAGE_KEYWORDS: Record<string, string[]> = {
  espresso: ["espresso", "coffee"],
  americano: ["americano", "coffee"],
  latte: ["latte", "coffee"],
  cortado: ["cortado", "coffee"],
  cappuccino: ["cappuccino", "coffee"],
  mocha: ["mocha", "coffee"],
  "white mocha": ["white-chocolate", "mocha", "coffee"],
  "black mocha": ["dark-chocolate", "mocha", "coffee"],
  "flat white": ["flat-white", "coffee"],
  "turk kahvesi": ["turkish-coffee", "coffee"],
  "filtre kahve": ["filter-coffee", "coffee"],
  "sutlu filtre kahve": ["coffee", "latte"],
  v60: ["pour-over", "coffee"],
  chemex: ["chemex", "coffee"],
  "ice americano": ["iced-americano", "coffee"],
  "ice latte": ["iced-latte", "coffee"],
  "ice mocha": ["iced-mocha", "coffee"],
  "ice white mocha": ["iced-mocha", "coffee"],
  "ice black mocha": ["iced-mocha", "coffee"],
  "ice filtre kahve": ["iced-coffee", "coffee"],
  "cold brew": ["cold-brew", "coffee"],
  "turk cayi": ["turkish-tea", "tea"],
  "white earl grey": ["earl-grey", "tea"],
  "rooibos vanilla": ["rooibos", "tea"],
  su: ["water", "bottle"],
  soda: ["mineral-water", "bottle"],
  "portakal suyu": ["orange-juice", "juice"],
  redbull: ["energy-drink", "drink"],
  churchill: ["lemon", "drink"],
  "tahinli brownie": ["brownie", "dessert"],
  "beyaz cikolatali brownie": ["white-chocolate", "brownie", "dessert"],
  "cream puff": ["cream-puff", "dessert"],
  pavlova: ["pavlova", "dessert"],
  "havuclu kek": ["carrot-cake", "dessert"],
  tartolet: ["fruit-tart", "dessert"],
  "balkabakli cheesecake": ["cheesecake", "pumpkin", "dessert"],
  "frambuazli cheesecake": ["cheesecake", "raspberry", "dessert"],
  matcha: ["matcha-latte", "matcha"],
  "strawberry matcha": ["strawberry", "matcha", "latte"],
};

const categoryImageKeywords = (catId?: string) => {
  switch (catId) {
    case "hot-brosso":
      return ["coffee", "espresso"];
    case "ice-brosso":
      return ["iced-coffee", "coffee"];
    case "third-wave":
      return ["pour-over", "v60", "coffee"];
    case "frappe":
      return ["frappe", "iced-coffee"];
    case "hot-drinks":
      return ["hot-chocolate", "drink"];
    case "tea":
      return ["tea", "teacup"];
    case "soft-drinks":
      return ["drink", "bottle"];
    case "sandwiches":
      return ["sandwich", "food"];
    case "desserts":
      return ["dessert", "cake"];
    case "matcha":
      return ["matcha", "latte"];
    case "ice-matcha":
      return ["iced-matcha", "latte"];
    default:
      return ["coffee"];
  }
};

const buildUnsplashUrl = (keywordsArr: string[], sig: string | number) => {
  const q = (keywordsArr || ["coffee"])
    .map((k) => String(k).trim().replace(/\s+/g, "-"))
    .filter(Boolean)
    .join(",");
  return `https://source.unsplash.com/${UNSPLASH_SIZE}x${UNSPLASH_SIZE}/?${q}&sig=${sig || 1}`;
};

const getAutoImageUrl = (item: any) => {
  const raw = item?.image || "";
  const isLocal = raw.startsWith("assets/");
  if (raw && isLocal) return raw;

  const key = String(item?.name || "")
    .toLowerCase()
    .trim()
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u");
  const keywords = IMAGE_KEYWORDS[key] || categoryImageKeywords(item?.category);
  return buildUnsplashUrl(keywords, item?.id || 1);
};

const ExtrasBar = ({ extras }: { extras: any[] }) => {
  if (!Array.isArray(extras) || extras.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg text-text-dark font-bold">
          Ekstralar
        </h3>
        <span className="text-xs text-text-muted">İsteğe bağlı</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {extras.map((ex) => (
          <div
            key={ex.id}
            className="bg-white border border-beige-dark rounded-2xl p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-text-dark">
                  {ex.name}
                </div>
                {ex.description && (
                  <div className="text-xs text-text-muted mt-1 leading-relaxed">
                    {ex.description}
                  </div>
                )}
              </div>

              <div className="shrink-0 font-semibold text-khaki-dark text-sm bg-beige px-2.5 py-1 rounded-full whitespace-nowrap">
                {ex.price} {CURRENCY}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuItemCard = ({
  item,
  delay = 0,
}: {
  key?: any;
  item: any;
  delay?: number;
}) => {
  const [imgError, setImgError] = useState(false);
  const fallbackImg = FALLBACK_IMAGES[item.category];
  const imgSrc = imgError ? fallbackImg : getAutoImageUrl(item);
  const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;

  return (
    <div
      className="bg-cream rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(92,64,51,0.10)] hover:shadow-[0_10px_26px_rgba(92,64,51,0.15)] transition-all duration-300 flex animate-fade-in-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative w-28 sm:w-32 shrink-0 overflow-hidden bg-beige-dark min-h-[7rem] sm:min-h-[8rem]">
        <img
          src={imgSrc}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {item.tags?.length > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-br from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm tracking-wide uppercase">
            {item.tags[0]}
          </div>
        )}
      </div>

      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-serif text-text-dark font-semibold text-base sm:text-lg leading-tight">
            {item.name}
          </h3>
          {hasVariants ? (
            <div className="bg-beige px-3 py-2 rounded-2xl border border-beige-dark text-right min-w-[110px]">
              {item.variants.map((v: any, i: number) => (
                <div
                  key={i}
                  className="text-[11px] sm:text-xs leading-tight flex items-center justify-between gap-3"
                >
                  <span className="text-text-muted font-medium">{v.label}</span>
                  <span className="text-khaki-dark font-semibold whitespace-nowrap">
                    {v.price} {CURRENCY}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="font-semibold text-khaki-dark text-sm bg-beige px-2.5 py-1 rounded-full whitespace-nowrap">
              {item.price} {CURRENCY}
            </span>
          )}
        </div>

        <p className="text-text-muted text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {item.milk === true && (
          <div className="mt-2 text-[11px] text-text-muted bg-beige/70 inline-flex rounded-full px-2.5 py-1 w-fit">
            {MILK_TEXT}
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryNav = ({
  categories,
  activeCategory,
  onSelectCategory,
  onGoHome,
}: any) => (
  <div className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm py-3 border-b border-beige-dark shadow-sm">
    <div className="flex items-center overflow-x-auto hide-scrollbar px-4 space-x-2">
      <button
        onClick={onGoHome}
        className="shrink-0 w-10 h-10 rounded-full bg-beige hover:bg-khaki hover:text-white transition-colors flex items-center justify-center text-text-dark mr-2"
        aria-label="Geri"
        type="button"
      >
        ←
      </button>

      {categories.map((cat: any) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border whitespace-nowrap ${
            activeCategory === cat.id
              ? "bg-khaki text-white border-khaki shadow-md"
              : "bg-white text-text-muted border-beige-dark hover:bg-beige hover:text-text-dark"
          }`}
          type="button"
        >
          {cat.name}
        </button>
      ))}
    </div>
  </div>
);

const CategoryCard = ({
  cat,
  onClick,
  delay,
}: {
  key?: any;
  cat: any;
  onClick: () => void;
  delay: number;
}) => {
  const bg = CATEGORY_BG[cat.id] || "";
  return (
    <button
      onClick={onClick}
      className="cat-card p-5 flex flex-col items-center text-center group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
      type="button"
    >
      <div className="cat-bg" style={{ backgroundImage: `url('${bg}')` }}></div>
      <div className="cat-overlay"></div>

      <div className="cat-inner flex flex-col items-center">
        <div className="cat-icon-box">
          <CategoryIcon iconId={cat.iconId} />
        </div>
        <h3 className="font-serif font-bold text-lg text-text-dark">
          {cat.name}
        </h3>
      </div>
    </button>
  );
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [view, setView] = useState<"HOME" | "DETAIL">("HOME");

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    setView("DETAIL");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    setView("HOME");
    setActiveCategory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredItems = useMemo(
    () =>
      menuData.items.filter(
        (item) => activeCategory === null || item.category === activeCategory,
      ),
    [activeCategory],
  );

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory);
  const showAiEntry = view === "HOME";

  return (
    <div className="min-h-screen bg-beige pb-safe">
      <header className="premium-header header-pad px-6 text-center">
        {showAiEntry && (
          <div className="header-ai">
            <button onClick={() => setIsAiOpen(true)} type="button">
              <div className="ai-badge">
                <SparklesIcon size={18} />
              </div>
              <span>Brosso Barista</span>
            </button>
          </div>
        )}

        <div className="header-particles" aria-hidden="true">
          <span className="particle particle-1"></span>
          <span className="particle particle-2 particle-warm"></span>
          <span className="particle particle-3"></span>
          <span className="particle particle-4 particle-gold"></span>
          <span className="particle particle-5"></span>
          <span className="particle particle-6 particle-warm"></span>
          <span className="particle particle-7"></span>
          <span className="particle particle-8 particle-gold"></span>
          <span className="particle particle-9"></span>
          <span className="particle particle-10 particle-warm"></span>
          <span className="particle particle-11"></span>
          <span className="particle particle-12 particle-gold"></span>
        </div>

        <div className="header-grain" aria-hidden="true"></div>

        <div className="header-content animate-fade-in-up flex flex-col items-center">
          <img
            src="assets/brosso-wordmark.png"
            alt="Brosso Coffee"
            className="wordmark-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextSibling) nextSibling.style.display = 'block';
            }}
          />
          <h1
            className="text-4xl font-black tracking-wider mb-2 hidden text-white"
            style={{ fontFamily: "Arial Black, sans-serif" }}
          >
            BROSSO
          </h1>
          <div className="submark">COFFEE SHOP</div>
        </div>
      </header>

      {view === "DETAIL" && (
        <CategoryNav
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={handleCategoryClick}
          onGoHome={handleGoHome}
        />
      )}

      <main className="container mx-auto px-4 py-6 relative z-20 max-w-2xl">
        {view === "HOME" && (
          <div className="animate-fade-in-up">
            <h2 className="font-serif text-2xl text-text-dark text-center mb-4">
              Menü
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat, idx) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  onClick={() => handleCategoryClick(cat.id)}
                  delay={idx * 50}
                />
              ))}
            </div>
          </div>
        )}

        {view === "DETAIL" && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-beige-dark">
              <div className="w-14 h-14 rounded-2xl bg-khaki/10 flex items-center justify-center">
                <div className="w-8 h-8 text-khaki-dark">
                  <CategoryIcon iconId={currentCategory?.iconId} />
                </div>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-text-dark font-bold">
                  {currentCategory?.name}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((item, idx) => (
                <MenuItemCard key={item.id} item={item} delay={idx * 50} />
              ))}
            </div>

            {["hot-brosso", "ice-brosso", "third-wave"].includes(
              activeCategory || "",
            ) && <ExtrasBar extras={menuData.extras} />}
          </div>
        )}
      </main>

      {showAiEntry && (
        <div className="ai-fab">
          <button onClick={() => setIsAiOpen(true)} type="button">
            <div className="ai-badge">
              <SparklesIcon size={18} />
            </div>
            <span>Brosso Barista</span>
          </button>
        </div>
      )}

      <AiBarista isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      <footer className="text-center py-8 text-text-muted text-xs opacity-70 mt-10 flex flex-col items-center gap-2">
        <p>©2026 Brosso Coffee. Crafted with ☕ in Bursa</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] tracking-wide">Created by</span>
          <a href="https://arvel.tr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-semibold hover:text-khaki transition-colors group">
            <img 
              src="assets/arvel-logo.png" 
              alt="Arvel" 
              className="h-12 opacity-80 group-hover:opacity-100 transition-opacity" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const span = e.currentTarget.nextElementSibling as HTMLElement;
                if (span) span.style.display = 'inline';
              }} 
            />
            <span style={{ display: 'none' }}>Arvel</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
