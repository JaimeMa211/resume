import Link from "next/link";
import HeaderAuthActions from "@/components/HeaderAuthActions";
import HomeHighlightPreview from "@/components/HomeHighlightPreview";

const featureItems = [
  {
    title: "即时匹配分数",
    description: "通过实时百分比分数，精准了解您的简历与职位描述的匹配程度。",
  },
  {
    title: "AI 智能改写",
    description: "自动改写简历要点，利用行业关键词突出相关的技能和成就。",
  },
  {
    title: "智能占位符",
    description: "识别缺失信息，并根据职位要求提供智能填充建议。",
  },
];

const homePlans = [
  {
    name: "免费版",
    price: "¥0/月",
    description: "每月 3 次优化，适合初次尝试",
    features: ["基础匹配评分", "3 套模板", "PDF 导出"],
  },
  {
    name: "专业版",
    price: "¥5/月",
    description: "高性价比月付方案，适合持续投递",
    features: ["每月 120 次优化", "高级关键词建议", "优先模型通道"],
    highlighted: true,
  },
  {
    name: "终身版",
    price: "¥20/终身",
    description: "一次购买长期使用，适合长期职业发展",
    features: ["终身不限次数优化", "终身模板更新", "专属客服支持"],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f6] text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ec5b13] text-sm font-bold text-white">AI</div>
            <span className="text-lg font-bold tracking-tight">AI 简历助手</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-semibold text-[#ec5b13]">
              首页
            </Link>
            <Link href="/features" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#ec5b13]">
              功能
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#ec5b13]">
              价格
            </Link>
          </nav>


          <HeaderAuthActions
            loginClassName="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block"
            registerClassName="px-5 py-2 transition-all"
          />
        </div>
      </header>

      <main>
        <section className="px-6 pb-16 pt-20">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ec5b13]/20 bg-[#ec5b13]/10 px-3 py-1 text-xs font-bold text-[#ec5b13]">
              新发布：AI 简历优化专家 2.0
            </div>
            <h1 className="mx-auto mb-8 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              利用 <span className="text-[#ec5b13]">AI 简历优化</span>，助你斩获心仪 Offer。
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
              利用先进 AI 技术，数秒内根据职位描述优化您的简历，将面试邀约率提升高达 3 倍。
            </p>

            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#resume-optimizer"
                className="w-full rounded-xl bg-[#ec5b13] px-8 py-4 text-center text-lg font-bold text-white shadow-lg shadow-[#ec5b13]/25 transition-all hover:bg-[#d6500f] sm:w-auto"
              >
                查看优化展示
              </Link>
              <Link
                href="/pricing"
                className="w-full rounded-xl border border-slate-200 bg-white px-8 py-4 text-center text-lg font-bold text-slate-900 transition-all hover:bg-slate-50 sm:w-auto"
              >
                查看价格方案
              </Link>
            </div>

            <div id="preview" className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex h-10 items-center gap-2 border-b border-slate-200 bg-slate-50 px-4">
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <div className="mx-auto rounded border border-slate-200 bg-white px-3 py-0.5 text-[10px] text-slate-400">app.airesumetailor.io</div>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-4 space-y-4 border-r border-slate-200 bg-slate-50 p-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-slate-500">匹配分数</p>
                    <p className="mt-2 text-3xl font-black text-[#ec5b13]">84%</p>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full rounded-full bg-slate-200" />
                    <div className="h-3 w-4/5 rounded-full bg-slate-200" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="col-span-8 space-y-4 bg-slate-100/60 p-8">
                  <div className="h-6 w-1/3 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3 w-full rounded bg-slate-200" />
                    <div className="h-3 w-11/12 rounded bg-slate-200" />
                    <div className="h-3 w-4/5 rounded bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold">助你职场进阶的强大功能</h2>
              <p className="text-slate-600">提供通过 ATS 筛选并吸引招聘人员所需的一切功能。</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featureItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
                  <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                  <p className="leading-relaxed text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="#resume-optimizer"
                className="inline-flex items-center rounded-lg border border-[#ec5b13] px-5 py-2 text-sm font-bold text-[#ec5b13] transition hover:bg-[#ec5b13] hover:text-white"
              >
                查看简历优化展示
              </Link>
            </div>
          </div>
        </section>

        <section id="resume-optimizer" className="scroll-mt-24 border-y border-slate-200 bg-[#fff7f3] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_48px_rgba(15,23,42,0.08)]">

              <div className="grid lg:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="border-b border-slate-100 bg-slate-50 lg:border-b-0 lg:border-r lg:border-slate-100">
                  <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ec5b13] text-white">AI</div>
                    <h3 className="text-3xl font-black tracking-tight">AI 简历优化器</h3>
                  </div>

                  <div className="space-y-6 p-6">
                    <div>
                      <p className="mb-3 text-sm font-semibold text-slate-800">原始简历</p>
                      <div className="flex min-h-36 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center text-slate-500">
                        <div>
                          <p className="text-base font-medium">拖拽 PDF 到这里，或点击上传</p>
                          <p className="mt-1 text-sm">仅支持 .pdf 格式</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-semibold text-slate-800">目标职位描述（JD）</p>
                      <div className="min-h-52 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-400">
                        请粘贴职位描述，AI 会按岗位要求优化你的简历...
                      </div>
                    </div>

                    <button type="button" className="w-full cursor-not-allowed rounded-xl bg-slate-300 px-4 py-3 text-sm font-semibold text-white" disabled>
                      优化简历（首页仅展示）
                    </button>
                  </div>
                </aside>

                <section className="bg-white">
                  <HomeHighlightPreview />
                </section>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black md:text-4xl">选择适合你的方案</h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600">支持月付与终身方案，按你的使用周期灵活选择。</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {homePlans.map((plan) => (
                <article
                  key={plan.name}
                  className={`rounded-2xl border p-6 shadow-sm ${
                    plan.highlighted
                      ? "border-[#ec5b13] bg-[#fff7f3] shadow-[0_16px_34px_rgba(236,91,19,0.12)]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-3xl font-black text-slate-900">{plan.price}</p>
                  <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                    {plan.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-xl bg-[#ec5b13] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d6500f]"
              >
                查看完整价格页
              </Link>
            </div>
          </div>
        </section>

        <section id="reviews" className="border-y border-slate-200 bg-white px-6 py-12">
          <div className="mx-auto max-w-6xl text-center">
            <h4 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">深受全球知名企业人才信赖</h4>
            <div className="flex flex-wrap items-center justify-center gap-5 opacity-60 grayscale">
              <div className="h-8 w-28 rounded bg-slate-200" />
              <div className="h-8 w-28 rounded bg-slate-200" />
              <div className="h-8 w-28 rounded bg-slate-200" />
              <div className="h-8 w-28 rounded bg-slate-200" />
              <div className="h-8 w-28 rounded bg-slate-200" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-sm text-slate-500 md:flex-row">
          <div className="font-semibold text-slate-800">AI 简历助手</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#ec5b13]">
              隐私政策
            </a>
            <a href="#" className="hover:text-[#ec5b13]">
              服务条款
            </a>
            <a href="#" className="hover:text-[#ec5b13]">
              联系支持
            </a>
          </div>
          <div>© 2026 AI 简历助手。保留所有权利。</div>
        </div>
      </footer>
    </div>
  );
}









