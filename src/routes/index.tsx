import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero/Hero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ارت ترافيك | حلول مرورية ذكية لمدن المستقبل" },
      { name: "description", content: "ارت ترافيك — استشارات هندسة المرور: دراسات الأثر المروري، السلامة المرورية، والتنقل الذكي." },
      { property: "og:title", content: "ارت ترافيك | حلول مرورية ذكية" },
      { property: "og:description", content: "دراسات وتحليلات مرورية متقدمة وفق أعلى المعايير الهندسية." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
    </main>
  );
}
