import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type Props = {
  content: string;
  className?: string;
  dir?: "rtl" | "ltr";
};

export function MarkdownContent({ content, className = "", dir = "rtl" }: Props) {
  return (
    <div
      dir={dir}
      className={`lovable-prose max-w-none ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
