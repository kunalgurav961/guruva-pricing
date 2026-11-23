export type Cur = 'INR' | 'USD'
export type PkgId = 'basic' | 'pro' | 'adv'
export type Cell = boolean | string

export interface Pkg {
  id: PkgId
  name: string
  sub: string
  tag: string
  price: Record<Cur, number>
  days: number
  pages: number
  support: number
  ideal: string
  head?: string
  feats: string[]
  rec?: boolean
}

export const SECTION_IDS = ['top', 'why', 'packages', 'compare', 'quote', 'plans', 'roi', 'process', 'faq', 'contact'] as const
export const NAV: [string, string][] = [
  ['why', 'Why'],
  ['packages', 'Packages'],
  ['compare', 'Compare'],
  ['quote', 'Quote'],
  ['plans', 'Payments'],
  ['roi', 'ROI'],
  ['process', 'Process'],
  ['faq', 'FAQ'],
]

export const PACKAGES: Pkg[] = [
  {
    id: 'basic',
    name: 'Basic',
    sub: 'Launch',
    tag: 'A clean, credible online presence for small businesses and professionals.',
    price: { INR: 19999, USD: 299 },
    days: 10,
    pages: 5,
    support: 30,
    ideal: 'Startups & local services',
    feats: [
      'Up to 5 pages (Home, About, Services, Gallery, Contact)',
      'Custom-styled responsive design',
      'Contact form with email alerts',
      'WhatsApp click-to-chat button',
      'Google Maps & social links',
      'On-page SEO basics + SSL setup',
      '2 revision rounds',
      '30 days free support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    sub: 'Growth',
    tag: 'A lead-generating site you can edit yourself, built to rank and convert.',
    rec: true,
    price: { INR: 54999, USD: 799 },
    days: 28,
    pages: 12,
    support: 60,
    ideal: 'Growing businesses',
    head: 'Everything in Basic, plus:',
    feats: [
      'Up to 12 pages with custom UI/UX design',
      'Easy CMS: edit text, images & blog yourself',
      'Blog / news setup',
      'SEO foundation: schema, sitemap, meta, redirects',
      'Speed tuning — target LCP under 2.5s',
      'Google Analytics 4 + conversion tracking',
      'Lead forms → email / CRM integration',
      '3 revision rounds + 1 training session',
      'Free SEO audit',
      '60 days free support',
    ],
  },
  {
    id: 'adv',
    name: 'Advanced',
    sub: 'Scale',
    tag: 'A custom e-commerce or web platform engineered for performance and scale.',
    price: { INR: 139999, USD: 1899 },
    days: 56,
    pages: 30,
    support: 90,
    ideal: 'E-commerce & custom portals',
    head: 'Everything in Pro, plus:',
    feats: [
      'Up to 30 pages or product catalogue setup',
      'Custom design system & brand-aligned UI',
      'Online store or custom web app features',
      'Payment gateway (Razorpay / Stripe) included',
      'User accounts, dashboards & roles',
      'Custom integrations & API work',
      'Advanced SEO, multilingual-ready structure',
      'Security hardening, backups, staging environment',
      'Performance budget & load testing',
      'Free SEO audit',
      '90 days free support + first 3 months of care plan free',
    ],
  },
]

export type MatrixRow = { group: string } | { label: string; v: [Cell, Cell, Cell] }
export const MATRIX: MatrixRow[] = [
  { group: 'Scope' },
  { label: 'Pages included', v: ['5', '12', '30'] },
  { label: 'Responsive, mobile-first design', v: [true, true, true] },
  { label: 'Custom UI/UX design', v: ['Styled', 'Custom', 'Design system'] },
  { label: 'Contact form & WhatsApp button', v: [true, true, true] },
  { group: 'Content & growth' },
  { label: 'Easy CMS (edit content yourself)', v: [false, true, true] },
  { label: 'Blog setup', v: [false, true, true] },
  { label: 'Basic on-page SEO', v: [true, true, true] },
  { label: 'Advanced SEO (schema, redirects, sitemap)', v: [false, true, true] },
  { label: 'Analytics & conversion tracking', v: [false, true, true] },
  { label: 'CRM / email integration', v: [false, true, true] },
  { group: 'Commerce & platform' },
  { label: 'Payment gateway', v: [false, false, true] },
  { label: 'User accounts & dashboards', v: [false, false, true] },
  { label: 'Custom integrations / API', v: [false, false, true] },
  { label: 'Multilingual-ready', v: [false, false, true] },
  { group: 'Quality & support' },
  { label: 'Speed target', v: ['Fast', 'LCP ≤ 2.5s', 'Perf. budget'] },
  { label: 'Security hardening & backups', v: [false, 'Basic', true] },
  { label: 'Staging environment', v: [false, false, true] },
  { label: 'Revision rounds', v: ['2', '3', '4'] },
  { label: 'Training session', v: [false, true, true] },
  { label: 'Free SEO audit', v: [false, true, true] },
  { label: 'Free support after launch', v: ['30 days', '60 days', '90 days'] },
  { label: 'Care plan included', v: [false, false, '3 months'] },
  { label: 'Typical delivery', v: ['~10 days', '~4 weeks', '8+ weeks'] },
]

export interface Addon {
  id: string
  name: string
  desc: string
  price: Record<Cur, number>
  step?: boolean
  per?: string
  inc?: PkgId[]
  days: number
}
export const ADDONS: Addon[] = [
  { id: 'pages', name: 'Extra pages', desc: 'Beyond the pages in your package', price: { INR: 2500, USD: 35 }, step: true, per: 'page', days: 0.5 },
  { id: 'blog', name: 'Blog setup', desc: 'Categories, author pages, SEO-ready templates', price: { INR: 5000, USD: 70 }, inc: ['pro', 'adv'], days: 2 },
  { id: 'brand', name: 'Logo & brand kit', desc: 'Logo, colours, fonts, social profile images', price: { INR: 8000, USD: 110 }, days: 4 },
  { id: 'copy', name: 'Professional copywriting', desc: 'Per page, written by our content team', price: { INR: 1500, USD: 20 }, step: true, per: 'page', days: 0.5 },
  { id: 'gateway', name: 'Payment gateway', desc: 'Razorpay / Stripe checkout integration', price: { INR: 12000, USD: 160 }, inc: ['adv'], days: 5 },
  { id: 'i18n', name: 'Multilingual (2 languages)', desc: 'Language switcher & translated structure', price: { INR: 15000, USD: 200 }, days: 7 },
]

export interface Recur {
  id: string
  name: string
  per: 'mo' | 'yr'
  desc: string
  flat?: Record<Cur, number>
  byPkg?: Record<PkgId, Record<Cur, number>>
  inc?: Partial<Record<PkgId, string>>
}
export const RECUR: Recur[] = [
  {
    id: 'care',
    name: 'Care plan',
    per: 'mo',
    desc: 'Backups, security updates, uptime monitoring and monthly changes',
    byPkg: { basic: { INR: 1500, USD: 20 }, pro: { INR: 3500, USD: 45 }, adv: { INR: 8000, USD: 100 } },
    inc: { adv: 'first 3 months free' },
  },
  {
    id: 'host',
    name: 'Domain + hosting + SSL',
    per: 'yr',
    desc: 'One yearly bill, registered in your name, renewals handled by us',
    byPkg: { basic: { INR: 5999, USD: 75 }, pro: { INR: 7999, USD: 100 }, adv: { INR: 16999, USD: 210 } },
  },
  { id: 'seoS', name: 'SEO Starter', per: 'mo', desc: 'Keyword tracking, 2 optimised pages a month, monthly report', flat: { INR: 10000, USD: 130 } },
  { id: 'seoG', name: 'SEO Growth', per: 'mo', desc: '5 pages a month, content & backlink outreach, monthly strategy call', flat: { INR: 20000, USD: 260 } },
]

export const EARLY = 0.05
export const HOURLY: Record<Cur, number> = { INR: 1000, USD: 15 }
export const AUDIT: Record<Cur, number> = { INR: 5000, USD: 65 }

export const STEPS = [
  { n: '01', t: 'Discover', d: [1, 2, 3], blurb: 'A short call to understand your goals, audience and competitors. We agree on the sitemap, features and success metrics.', out: ['Project brief & sitemap', 'Fixed-price proposal', 'Content checklist'] },
  { n: '02', t: 'Design', d: [2, 7, 14], blurb: 'Wireframes first, then the visual design of key pages in Figma. You review and request changes before we write any code.', out: ['Wireframes', 'Visual design mock-ups', 'Mobile + desktop views'] },
  { n: '03', t: 'Build', d: [4, 12, 28], blurb: 'We develop the pages, CMS and integrations on a private preview link so you can follow progress and give feedback.', out: ['Working preview site', 'CMS & integrations', 'Revision rounds'] },
  { n: '04', t: 'Launch', d: [1, 3, 5], blurb: 'Cross-device testing, speed and SEO checks, then we connect your domain and go live — with a launch checklist signed off by you.', out: ['QA & speed report', 'Domain, SSL & hosting live', 'Training session (Pro+)'] },
  { n: '05', t: 'Grow', d: [2, 4, 8], blurb: 'Free post-launch support, then an optional care plan for updates, security and continuous improvement.', out: ['Free support window', 'Analytics review', 'Optional care plan'] },
]

export const FAQ = [
  ['What’s not included in the price?', 'Domain, hosting and SSL (available as our optional yearly bundle, registered in your name), paid third-party tools or premium plugins, and stock photography or video. Copywriting and branding are available as add-ons.'],
  ['How do payments work?', '50% to start, 30% when the design is approved, and 20% before go-live. Prefer to pay once? Pay the full project fee upfront and take 5% off. Final files and access are handed over once the last payment is received.'],
  ['What if I need to cancel or pause?', 'The 50% start payment covers discovery and design work and is non-refundable. Any milestone already delivered is billed. You keep everything delivered up to that point once it is paid for.'],
  ['What if I want more changes than the revision rounds?', 'Each package includes fixed revision rounds (2, 3 or 4). Extra changes are billed hourly, and we quote the hours before starting so there are no surprises.'],
  ['Who owns the website?', 'You do. You get the code, design files, content and all accounts. No lock-in.'],
  ['How long will it take?', 'Roughly 10 working days for Basic, 4 weeks for Pro and 8+ weeks for Advanced. The biggest factor is how quickly content and feedback arrive — the quote builder shows an estimate for your exact selection.'],
  ['Can I upgrade later?', 'Yes. If you start on Basic or Pro and upgrade within 90 days, you pay only the price difference between the packages.'],
  ['What happens after launch?', 'Every package includes free post-launch support (30, 60 or 90 days). After that you can add a monthly care plan covering updates, backups, security checks and small changes — Advanced includes the first 3 months free. SEO retainers are also available.'],
  ['Can you work with my existing site or brand?', 'Absolutely. We can redesign, migrate content, or keep your existing branding. Tell us in the enquiry form and we’ll scope it.'],
]

export const QUIZ = [
  { q: 'What’s the main job of your website?', o: ['Look credible & share contact details', 'Generate enquiries, publish content, rank on Google', 'Sell online, take payments or run a custom app'] },
  { q: 'How many pages do you need?', o: ['Up to 5', '6 to 12', '12 or more, or lots of products'] },
  { q: 'Will you update content yourself?', o: ['Rarely — you can do it for me', 'Yes — I want an easy editor and a blog', 'Yes, plus user logins, dashboards or integrations'] },
  { q: 'What’s your budget range?', o: ['Under ₹35,000', '₹35,000 – ₹90,000', '₹90,000 or more'] },
]
