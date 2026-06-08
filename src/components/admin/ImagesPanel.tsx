import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listImages, setImageAlt, type ImageRow } from "@/lib/images.functions";
import { transformImage } from "@/lib/image-url";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ImageIcon, Search } from "lucide-react";

export function ImagesPanel() {
  const qc = useQueryClient();
  const list = useServerFn(listImages);
  const save = useServerFn(setImageAlt);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<ImageRow[]>({
    queryKey: ["admin-images"],
    queryFn: () => list(),
  });

  const update = useMutation({
    mutationFn: ({ storage_path, alt_text }: { storage_path: string; alt_text: string }) =>
      save({ data: { storage_path, alt_text } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-images"] });
      toast.success("تم حفظ النص البديل");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = (data ?? []).filter((r) =>
    !search.trim() || r.path.toLowerCase().includes(search.toLowerCase()) || r.alt_text.toLowerCase().includes(search.toLowerCase()),
  );

  const missing = (data ?? []).filter((r) => !r.alt_text.trim()).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-bold text-[var(--color-primary)] flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> الصور والنصوص البديلة (Alt Text)
        </h3>
        <span className="text-xs rounded-full bg-amber-50 text-amber-700 px-2 py-0.5">
          ناقص alt: {missing} / {data?.length ?? 0}
        </span>
        <div className="relative ms-auto">
          <Search className="absolute end-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="ps-3 pe-8 w-64" />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">جاري التحميل...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا توجد صور.</p>
      ) : (
        <div className="grid gap-3">
          {rows.map((r) => (
            <ImageRowCard key={r.path} row={r} onSave={(alt) => update.mutate({ storage_path: r.path, alt_text: alt })} saving={update.isPending} />
          ))}
        </div>
      )}
    </div>
  );
}

function ImageRowCard({ row, onSave, saving }: { row: ImageRow; onSave: (alt: string) => void; saving: boolean }) {
  const [alt, setAlt] = useState(row.alt_text);
  const dirty = alt !== row.alt_text;
  return (
    <div className="rounded-2xl border bg-white p-3 flex gap-4">
      <img
        src={transformImage(row.public_url, { width: 200, format: "webp" })}
        alt={alt || row.name}
        loading="lazy"
        className="w-28 h-28 object-cover rounded-lg border bg-muted shrink-0"
      />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <code className="text-xs text-muted-foreground truncate">{row.path}</code>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {(row.size / 1024).toFixed(0)} KB
          </span>
        </div>
        <div className="flex gap-2">
          <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="اكتب وصف الصورة (Alt text) — مهم للـ SEO" maxLength={140} />
          <button
            onClick={() => onSave(alt)}
            disabled={!dirty || saving}
            className="rounded-md bg-[var(--color-primary)] text-white text-sm px-3 disabled:opacity-50"
          >
            حفظ
          </button>
        </div>
        {row.references.length > 0 ? (
          <div className="text-[11px] text-muted-foreground flex flex-wrap gap-1">
            <span>مستخدمة في:</span>
            {row.references.map((ref, i) => (
              <span key={i} className="rounded-full bg-muted px-2 py-0.5">
                {ref.table}.{ref.column} — {ref.label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-amber-700">غير مرتبطة بأي صفحة (يمكن حذفها)</p>
        )}
      </div>
    </div>
  );
}