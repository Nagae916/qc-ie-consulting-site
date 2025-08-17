import { Helmet } from 'react-helmet';

export default function ConsultingSiteJP() {
  return (
    <div className="min-h-screen bg-white text-slate-800" style={{fontFamily: '"Noto Sans JP", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'}}>
      <Helmet htmlAttributes={{ lang: 'ja' }}>
        <title>品質管理・経営工学コンサル｜QC × IE Consulting</title>
        <meta name="description" content="QC七つ道具・SPC・DOE・IEで不良率/リードタイムを改善。ISO 9001/IATF 16949準拠のQMS設計と現場実装を支援します。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://example.com/" />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <meta property="og:title" content="品質管理・経営工学コンサル｜QC × IE Consulting" />
        <meta property="og:description" content="QC七つ道具・SPC・DOE・IEで不良率/リードタイムを改善。ISO 9001/IATF 16949準拠のQMS設計と現場実装を支援します。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com/" />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:site_name" content="QC × IE Consulting" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="品質管理・経営工学コンサル｜QC × IE Consulting" />
        <meta name="twitter:description" content="QC七つ道具・SPC・DOE・IEで不良率/リードタイムを改善。ISO 9001/IATF 16949準拠のQMS設計と現場実装を支援します。" />
        <meta name="twitter:image" content="https://example.com/og-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'QC × IE Consulting',
          url: 'https://example.com/',
          logo: 'https://example.com/logo.png',
          sameAs: [
            'https://www.instagram.com/n.ieqclab',
            'https://x.com/n_ieqclab'
          ],
          contactPoint: [{
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: 'hello@example.com',
            areaServed: 'JP',
            availableLanguage: ['ja']
          }]
        })}</script>
      </Helmet>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="#home" className="flex items-center gap-2 font-bold text-slate-900">
              <span>QC × IE Consulting</span>
            </a>
            <nav className="hidden gap-6 text-sm font-medium md:flex">
              <a href="#services" className="hover:text-slate-900 text-slate-600">サービス</a>
              <a href="#approach" className="hover:text-slate-900 text-slate-600">アプローチ</a>
              <a href="#cases" className="hover:text-slate-900 text-slate-600">事例・成果</a>
              <a href="#training" className="hover:text-slate-900 text-slate-600">研修</a>
              <a href="#resources" className="hover:text-slate-900 text-slate-600">根拠・出典</a>
              <a href="#faq" className="hover:text-slate-900 text-slate-600">FAQ</a>
              <a href="#contact" className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">お問い合わせ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero (minimal) */}
      <section id="home" className="bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            品質管理 × 経営工学コンサルティング
          </h1>
          <p className="mt-4 text-slate-600">SPC / DOE / IE を現場に実装し、再現性ある成果を。ISO/IATF準拠。</p>
        </div>
      </section>

      {/* Social / SNS */}
      <section id="social" className="border-t bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">SNS</h2>
              <p className="mt-3 text-slate-600">最新情報やTipsを発信中。フォローいただけると嬉しいです。</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href="https://x.com/n_ieqclab" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 hover:bg-white bg-slate-900 text-white hover:text-slate-900 hover:border-slate-900">
                  <XIcon/>
                  <span>@n_ieqclab</span>
                </a>
                <a href="https://www.instagram.com/n.ieqclab" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-slate-700 hover:bg-white">
                  <InstagramIcon/>
                  <span>n.ieqclab</span>
                </a>
              </div>
            </div>
            <div className="grow">
              <h3 className="text-base font-semibold text-slate-900">Instagram 最新投稿</h3>
              <InstagramFeed/>
              <p className="mt-2 text-xs text-slate-500">※表示は直近の3件。クリックでInstagramに移動します。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="border-t bg-slate-900 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm">© {new Date().getFullYear()} QC × IE Consulting. All rights reserved.</p>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm text-slate-300">
              <a href="#services" className="hover:text-white">サービス</a>
              <a href="#approach" className="hover:text-white">アプローチ</a>
              <a href="#resources" className="hover:text-white">根拠・出典</a>
              <a href="#contact" className="hover:text-white">お問い合わせ</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

function XIcon(){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 10.4 22 2h-2.8l-5.3 6.1L9.2 2H2l7.7 10.9L2 22h2.8l5.9-6.8 4.9 6.8H22l-7.3-10.4Zm-2.1 2.4-.7-.9L5 3.8h2.2l4.5 6.2.7.9 7.2 9.8h-2.2l-4.8-6.9Z"/></svg>
  )
}
function InstagramIcon(){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm11 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"/></svg>
  )
}

function InstagramFeed(){
  const placeholder = [
    { id: '1', permalink: 'https://www.instagram.com/n.ieqclab/', media_url: 'https://placehold.co/600x600/png', caption: 'Instagram Post 1'},
    { id: '2', permalink: 'https://www.instagram.com/n.ieqclab/', media_url: 'https://placehold.co/600x600/png', caption: 'Instagram Post 2'},
    { id: '3', permalink: 'https://www.instagram.com/n.ieqclab/', media_url: 'https://placehold.co/600x600/png', caption: 'Instagram Post 3'},
  ];
  return (
    <div className="mt-3 grid grid-cols-3 gap-3">
      {placeholder.map(p => (
        <a key={p.id} href={p.permalink} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="aspect-square w-full bg-slate-100">
            <img src={p.media_url} alt={p.caption} className="h-full w-full object-cover"/>
          </div>
          <div className="p-2 text-xs text-slate-600 group-hover:underline">{p.caption}</div>
        </a>
      ))}
    </div>
  )
}