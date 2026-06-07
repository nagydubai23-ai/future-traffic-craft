import { MessageCircle } from "lucide-react";

const PHONE = "966500000000";
const MESSAGE = "مرحباً، أرغب في الاستفسار عن خدمات ارت ترافيك.";

export function WhatsAppFab() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="group fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-4 text-white shadow-[0_15px_40px_-10px_rgba(37,211,102,0.6)] transition-all hover:scale-105 hover:shadow-[0_20px_50px_-10px_rgba(37,211,102,0.8)] md:px-5"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-50 animate-ping" />
      <MessageCircle className="h-6 w-6" strokeWidth={2.2} />
      <span className="hidden md:inline text-sm font-semibold">تواصل واتساب</span>
    </a>
  );
}
