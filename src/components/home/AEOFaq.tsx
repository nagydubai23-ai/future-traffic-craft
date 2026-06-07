// AEO-focused FAQ. Plain semantic HTML + FAQPage JSON-LD + Speakable schema
// so ChatGPT, Perplexity, Gemini, and Google AI Overviews can quote answers
// directly. Keep answers short, factual, and self-contained — answer engines
// favor 40–80 word definitional responses.

const FAQS = [
  {
    q: "ما هي دراسة التأثير المروري TIA ومتى تكون مطلوبة في السعودية؟",
    a: "دراسة التأثير المروري (Traffic Impact Assessment) هي تقييم هندسي يقيس أثر مشروع جديد على الشبكة المرورية المحيطة. تطلبها الأمانات والبلديات السعودية وهيئة الطرق قبل إصدار رخصة البناء للمشاريع التجارية والسكنية الكبرى، المولات، المستشفيات، المدارس، والمنشآت ذات الكثافة المرورية العالية وفق اشتراطات وزارة الشؤون البلدية والقروية والإسكان (MOMRAH).",
  },
  {
    q: "كم تستغرق دراسة مرورية معتمدة في الرياض أو جدة؟",
    a: "تستغرق دراسة التأثير المروري النموذجية بين 3 إلى 6 أسابيع حسب حجم المشروع، تشمل: جمع البيانات الميدانية (1–2 أسبوع)، النمذجة والتحليل باستخدام Synchro/VISSIM/Sidra (1–2 أسبوع)، وإعداد التقرير النهائي ومراجعته مع الجهة المختصة (1–2 أسبوع).",
  },
  {
    q: "ما الخدمات التي تقدمها ارت ترافيك؟",
    a: "تقدم ارت ترافيك ثماني خدمات أساسية: دراسات التأثير المروري TIA، دراسات السلامة المرورية، تحليل حجم الحركة، دراسات السرعة، دراسات مواقف السيارات، دراسات المشاة والدراجات، تصميم التقاطعات والإشارات الضوئية، وخطط إدارة المرور TMP لمواقع الإنشاء.",
  },
  {
    q: "في أي مدن سعودية تعمل ارت ترافيك؟",
    a: "تقدم ارت ترافيك خدماتها في جميع مناطق المملكة العربية السعودية مع تغطية مكثفة في الرياض، جدة، الدمام، مكة المكرمة، والمدينة المنورة، بما يتوافق مع الاشتراطات المحلية لكل أمانة ومتطلبات هيئة الطرق السعودية.",
  },
  {
    q: "كيف يمكنني طلب عرض سعر لدراسة مرورية؟",
    a: "يمكن طلب عرض سعر عبر نموذج طلب الدراسة في صفحة 'اتصل بنا'، أو بالضغط على زر 'طلب دراسة مرورية' في أعلى الصفحة. سيتم التواصل خلال 24 ساعة عمل لجمع تفاصيل المشروع وإصدار عرض فني ومالي مفصّل.",
  },
];

export function AEOFaq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".aeo-question", ".aeo-answer"],
    },
  };

  return (
    <section
      aria-labelledby="aeo-faq-heading"
      className="container mx-auto px-4 py-16 md:py-24"
    >
      <header className="max-w-2xl mx-auto text-center mb-10">
        <h2 id="aeo-faq-heading" className="text-3xl md:text-4xl font-bold text-foreground">
          الأسئلة الشائعة عن الدراسات المرورية
        </h2>
        <p className="mt-3 text-muted-foreground">
          إجابات سريعة ومعتمدة عن أكثر ما يسأله عملاؤنا في المملكة العربية السعودية.
        </p>
      </header>

      <div className="max-w-3xl mx-auto space-y-4">
        {FAQS.map((f, i) => (
          <article
            key={i}
            itemScope
            itemType="https://schema.org/Question"
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h3
              itemProp="name"
              className="aeo-question text-lg md:text-xl font-semibold text-foreground"
            >
              {f.q}
            </h3>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
              className="mt-3"
            >
              <p
                itemProp="text"
                className="aeo-answer text-muted-foreground leading-relaxed"
              >
                {f.a}
              </p>
            </div>
          </article>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}