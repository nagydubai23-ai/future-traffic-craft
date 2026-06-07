import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Heading4,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Undo,
  Redo,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Loader2,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
  minHeight?: number;
};

export function RichTextEditor({ value, onChange, placeholder, dir = "rtl", minHeight = 220 }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[var(--color-secondary)] underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl my-3 max-w-full h-auto" } }),
      Placeholder.configure({ placeholder: placeholder ?? "اكتب هنا..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        dir,
        class:
          "prose prose-sm max-w-none focus:outline-none px-4 py-3 leading-relaxed text-foreground",
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return null;

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار صورة");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("الحجم الأقصى 5MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("cms-images").upload(path, file, { cacheControl: "31536000", upsert: false });
      if (upErr) throw upErr;
      // Long-lived signed URL (~10 years) since the bucket is private.
      const { data, error } = await supabase.storage.from("cms-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (error || !data) throw error ?? new Error("signed url failed");
      editor.chain().focus().setImage({ src: data.signedUrl }).run();
      toast.success("تم رفع الصورة");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const Btn = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`h-8 w-8 inline-flex items-center justify-center rounded-md text-[var(--color-primary)] hover:bg-[var(--color-muted)] ${
        active ? "bg-[var(--color-accent)]/30" : ""
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border border-[oklch(0.929_0.013_255.508)] bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-[oklch(0.929_0.013_255.508)] px-2 py-1.5 bg-[var(--color-muted)]/40">
        <Btn title="عريض" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Btn>
        <Btn title="مائل" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Btn>
        <span className="mx-1 h-5 w-px bg-[oklch(0.929_0.013_255.508)]" />
        <Btn title="عنوان H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Btn>
        <Btn title="عنوان H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Btn>
        <Btn title="عنوان H4" active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 className="h-4 w-4" /></Btn>
        <span className="mx-1 h-5 w-px bg-[oklch(0.929_0.013_255.508)]" />
        <Btn title="قائمة" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Btn>
        <Btn title="قائمة مرقمة" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Btn>
        <Btn title="اقتباس" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Btn>
        <span className="mx-1 h-5 w-px bg-[oklch(0.929_0.013_255.508)]" />
        <Btn title="محاذاة يمين" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight className="h-4 w-4" /></Btn>
        <Btn title="توسيط" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter className="h-4 w-4" /></Btn>
        <Btn title="محاذاة يسار" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft className="h-4 w-4" /></Btn>
        <span className="mx-1 h-5 w-px bg-[oklch(0.929_0.013_255.508)]" />
        <Btn
          title="رابط"
          active={editor.isActive("link")}
          onClick={() => {
            const prev = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("أدخل الرابط", prev ?? "https://");
            if (url === null) return;
            if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
            else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </Btn>
        <Btn title="رفع صورة" onClick={() => fileInputRef.current?.click()}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </Btn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
        />
        <span className="mx-1 h-5 w-px bg-[oklch(0.929_0.013_255.508)]" />
        <Btn title="تراجع" onClick={() => editor.chain().focus().undo().run()}><Undo className="h-4 w-4" /></Btn>
        <Btn title="إعادة" onClick={() => editor.chain().focus().redo().run()}><Redo className="h-4 w-4" /></Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}