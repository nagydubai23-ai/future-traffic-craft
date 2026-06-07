import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  FileText,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const SERVICES = [
  "دراسة التأثير المروري TIA",
  "دراسات السلامة المرورية",
  "تحليل حجم الحركة المرورية",
  "دراسات السرعة",
  "دراسات مواقف السيارات",
  "دراسات المشاة والدراجات",
  "تصميم التقاطعات والإشارات",
  "خطط إدارة المرور TMP",
];

const CITIES = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "أبها",
  "بريدة",
  "حائل",
  "نجران",
  "جازان",
];

const STEPS = [
  { id: 1, title: "الخدمة" },
  { id: 2, title: "تفاصيل المشروع" },
  { id: 3, title: "الموقع" },
  { id: 4, title: "معلومات التواصل" },
  { id: 5, title: "الملفات" },
];

interface FormState {
  service: string;
  details: string;
  city: string;
  district: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  files: { name: string; size: number }[];
}

const INITIAL: FormState = {
  service: "",
  details: "",
  city: "",
  district: "",
  name: "",
  company: "",
  phone: "",
  email: "",
  files: [],
};

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function QuoteModal({ open, onOpenChange }: QuoteModalProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const update = (patch: Partial<FormState>) => setData((d) => ({ ...d, ...patch }));

  const canNext = () => {
    switch (step) {
      case 1: return !!data.service;
      case 2: return data.details.trim().length >= 10;
      case 3: return !!data.city;
      case 4:
        return (
          data.name.trim().length >= 2 &&
          /^[0-9+\-\s]{7,20}$/.test(data.phone) &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
        );
      case 5: return true;
      default: return false;
    }
  };

  const next = () => {
    if (!canNext()) return;
    if (step < STEPS.length) setStep(step + 1);
  };
  const prev = () => step > 1 && setStep(step - 1);

  const submit = () => {
    if (!canNext()) return;
    setSubmitted(true);
    toast.success("تم استلام طلبك بنجاح، سنتواصل معك قريباً.");
    setTimeout(() => {
      onOpenChange(false);
      setTimeout(() => {
        setStep(1);
        setData(INITIAL);
        setSubmitted(false);
      }, 300);
    }, 1800);
  };

  const progress = (step / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-w-2xl p-0 overflow-hidden border-0 bg-white sm:rounded-3xl"
      >
        <DialogTitle className="sr-only">طلب دراسة مرورية</DialogTitle>
        <DialogDescription className="sr-only">
          نموذج متعدد الخطوات لطلب دراسة مرورية متخصصة.
        </DialogDescription>

        {/* Header */}
        <div className="relative bg-[var(--color-primary)] px-7 pt-7 pb-6 text-white overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div
            className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                <Sparkles className="h-3 w-3 text-[var(--color-accent)]" />
                <span className="text-[11px] font-medium tracking-wide">طلب دراسة مرورية</span>
              </div>
              <h2 className="mt-3 text-2xl font-extrabold">احصل على عرض سعر مخصص</h2>
              <p className="mt-1 text-sm text-white/65">
                خطوة {step} من {STEPS.length} · {STEPS[step - 1].title}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="relative mt-6">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <ol className="mt-4 flex items-center justify-between">
              {STEPS.map((s) => {
                const done = s.id < step;
                const active = s.id === step;
                return (
                  <li key={s.id} className="flex flex-col items-center gap-1.5">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                        done
                          ? "bg-[var(--color-accent)] text-[var(--color-primary)]"
                          : active
                          ? "bg-white text-[var(--color-primary)] ring-4 ring-[var(--color-accent)]/30"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                    </span>
                    <span className={`hidden sm:block text-[10px] ${active ? "text-white" : "text-white/45"}`}>
                      {s.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-7 min-h-[280px] relative">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]">
                <Check className="h-8 w-8 text-[var(--color-primary)]" strokeWidth={3} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-[var(--color-primary)]">تم إرسال طلبك</h3>
              <p className="mt-1 text-sm text-[oklch(0.45_0.02_247)]">سيتواصل معك فريقنا خلال 24 ساعة.</p>
            </div>
          ) : (
            <StepContent key={step} step={step} data={data} update={update} />
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="flex items-center justify-between gap-3 border-t border-[oklch(0.929_0.013_255.508)] bg-[var(--color-muted)] px-7 py-4">
            <button
              type="button"
              onClick={prev}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition-all hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ArrowRight className="h-4 w-4" />
              السابق
            </button>

            {step < STEPS.length ? (
              <button
                type="button"
                onClick={next}
                disabled={!canNext()}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[var(--color-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                التالي
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-bold text-[var(--color-primary)] shadow-[0_10px_30px_-10px_rgba(200,241,53,0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_40px_-10px_rgba(200,241,53,0.9)]"
              >
                إرسال الطلب
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepShell({ children }: { children: ReactNode }) {
  return <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{children}</div>;
}

function StepContent({
  step,
  data,
  update,
}: {
  step: number;
  data: FormState;
  update: (patch: Partial<FormState>) => void;
}) {
  if (step === 1) {
    return (
      <StepShell>
        <Label className="text-sm font-semibold text-[var(--color-primary)]">اختر نوع الخدمة</Label>
        <p className="mt-1 mb-4 text-xs text-[oklch(0.45_0.02_247)]">حدد الدراسة التي تحتاجها لمشروعك.</p>
        <Select value={data.service} onValueChange={(v) => update({ service: v })} dir="rtl">
          <SelectTrigger className="h-12 text-right">
            <SelectValue placeholder="اختر من القائمة..." />
          </SelectTrigger>
          <SelectContent>
            {SERVICES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </StepShell>
    );
  }

  if (step === 2) {
    return (
      <StepShell>
        <Label className="text-sm font-semibold text-[var(--color-primary)]">تفاصيل المشروع</Label>
        <p className="mt-1 mb-4 text-xs text-[oklch(0.45_0.02_247)]">
          صف نوع المشروع، النطاق، والأهداف (10 أحرف على الأقل).
        </p>
        <Textarea
          dir="rtl"
          rows={7}
          value={data.details}
          onChange={(e) => update({ details: e.target.value })}
          maxLength={2000}
          placeholder="مثال: مجمع تجاري بمساحة 25,000م² يقع على شارع رئيسي، يحتاج دراسة تأثير مروري لاعتماد البلدية..."
          className="resize-none text-right"
        />
        <div className="mt-2 text-left text-[11px] text-[oklch(0.45_0.02_247)]">
          {data.details.length} / 2000
        </div>
      </StepShell>
    );
  }

  if (step === 3) {
    return (
      <StepShell>
        <Label className="text-sm font-semibold text-[var(--color-primary)]">موقع المشروع</Label>
        <p className="mt-1 mb-4 text-xs text-[oklch(0.45_0.02_247)]">المدينة والحي يساعدنا في تقدير دقيق.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-[oklch(0.45_0.02_247)]">المدينة</Label>
            <Select value={data.city} onValueChange={(v) => update({ city: v })} dir="rtl">
              <SelectTrigger className="mt-1 h-11 text-right">
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-[oklch(0.45_0.02_247)]">الحي (اختياري)</Label>
            <Input
              dir="rtl"
              value={data.district}
              onChange={(e) => update({ district: e.target.value })}
              maxLength={100}
              placeholder="مثال: حي الملقا"
              className="mt-1 h-11 text-right"
            />
          </div>
        </div>
      </StepShell>
    );
  }

  if (step === 4) {
    return (
      <StepShell>
        <Label className="text-sm font-semibold text-[var(--color-primary)]">معلومات التواصل</Label>
        <p className="mt-1 mb-4 text-xs text-[oklch(0.45_0.02_247)]">سنستخدمها للتواصل معك بخصوص الطلب فقط.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="الاسم الكامل">
            <Input
              dir="rtl"
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              maxLength={100}
              placeholder="الاسم"
              className="h-11 text-right"
            />
          </Field>
          <Field label="الشركة (اختياري)">
            <Input
              dir="rtl"
              value={data.company}
              onChange={(e) => update({ company: e.target.value })}
              maxLength={150}
              placeholder="اسم الشركة"
              className="h-11 text-right"
            />
          </Field>
          <Field label="رقم الجوال">
            <Input
              dir="ltr"
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
              maxLength={20}
              placeholder="+966 5X XXX XXXX"
              className="h-11"
            />
          </Field>
          <Field label="البريد الإلكتروني">
            <Input
              dir="ltr"
              type="email"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              maxLength={255}
              placeholder="name@example.com"
              className="h-11"
            />
          </Field>
        </div>
      </StepShell>
    );
  }

  // Step 5
  return (
    <StepShell>
      <Label className="text-sm font-semibold text-[var(--color-primary)]">إرفاق ملفات (اختياري)</Label>
      <p className="mt-1 mb-4 text-xs text-[oklch(0.45_0.02_247)]">
        مخططات، صور الموقع، أو أي مستندات تساعد فريقنا.
      </p>

      <label className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-primary)]/20 bg-[var(--color-muted)] px-6 py-10 text-center cursor-pointer transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-primary)]/10 transition-all group-hover:ring-[var(--color-accent)] group-hover:scale-110">
          <Upload className="h-5 w-5 text-[var(--color-primary)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">اسحب الملفات هنا أو اضغط للرفع</p>
          <p className="mt-1 text-xs text-[oklch(0.45_0.02_247)]">PDF, DWG, JPG, PNG · حتى 20MB</p>
        </div>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []).slice(0, 10).map((f) => ({
              name: f.name,
              size: f.size,
            }));
            update({ files: [...data.files, ...files].slice(0, 10) });
          }}
        />
      </label>

      {data.files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {data.files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 rounded-xl border border-[oklch(0.929_0.013_255.508)] bg-white px-4 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-4 w-4 text-[var(--color-secondary)] shrink-0" />
                <span className="text-sm text-[var(--color-primary)] truncate">{f.name}</span>
                <span className="text-xs text-[oklch(0.45_0.02_247)] shrink-0">
                  {(f.size / 1024).toFixed(0)} KB
                </span>
              </div>
              <button
                type="button"
                onClick={() => update({ files: data.files.filter((_, j) => j !== i) })}
                className="rounded-full p-1 text-[oklch(0.45_0.02_247)] hover:bg-[var(--color-muted)] hover:text-[var(--color-primary)]"
                aria-label="إزالة"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </StepShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-[oklch(0.45_0.02_247)]">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
