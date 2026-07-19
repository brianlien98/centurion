'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseCenturion, type WallOfFameItem, type PartnershipLeadInput } from '@/lib/supabase';
import { 
  Briefcase, 
  Globe, 
  Award, 
  ShieldCheck, 
  Compass, 
  CheckCircle, 
  Leaf, 
  GraduationCap, 
  Send,
  Loader2,
  Menu,
  X,
  Star,
  ChevronRight,
  Anchor,
  Droplets,
  TreePine,
  UserCheck,
  Scale,
  Sparkles,
  HeartHandshake,
  Play,
  FileText,
  Video,
  ExternalLink,
  BookOpen,
  Eye
} from 'lucide-react';

interface PressItem {
  id: number;
  title: string;
  summary: string;
  news_url: string;
  image_url: string;
}

interface LuxuryProduct {
  id: number;
  name: string;
  price_tag: string;
  tagline: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

type LangType = 'zh' | 'ja' | 'en';

export default function CenturionPortal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<LangType>('zh');

  // 各資料表唯讀展示狀態
  const [items, setItems] = useState<WallOfFameItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loadingItems, setLoadingItems] = useState<boolean>(true);

  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [loadingPress, setLoadingItemsPress] = useState<boolean>(true);
  const [selectedPress, setSelectedPress] = useState<number | null>(null);

  const [showcaseItems, setShowcaseItems] = useState<LuxuryProduct[]>([]);
  const [loadingShowcase, setLoadingShowcase] = useState<boolean>(true);

  // B2B 表單狀態
  const [formData, setFormData] = useState<PartnershipLeadInput>({
    company_name: '',
    contact_name: '',
    phone: '',
    email: '',
    business_area: '【百夫長✜品牌鏈】品牌授權計畫',
    timeframe: '加入百夫長，立即開始 (1個月內)',
    proposal_summary: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // 三語對照字典
  const dict = {
    zh: {
      brandChain: '【百夫長✜品牌鏈】品牌授權計畫',
      slogan: '你負責追求品質極致，百夫長負責賦予產品品牌靈魂。百夫長與你一起立足台灣，走向世界。',
      ctaApply: '申請加入百夫長✜品牌鏈 ➔',
      ctaExhibition: '探索高奢產品展示',
      visionLink: '創辦理念',
      pillarsLink: '集團事業',
      dnaLink: '核心基因',
      esgLink: '永續人文',
      showcaseLink: '典藏展廳',
      insightsLink: '百夫長新知',
      wallLink: '聯名牆',
      coopBtn: '戰略合作',
      introDesc: '你負責追求品質極致，百夫長負責賦予產品品牌靈魂。百夫長與你一起立足台灣，走向世界。加入百夫長全球品牌美學體系，獲得高奢溢價賦能，徹底顛覆傳統價格戰。',
      founderTitle: '集團品牌掌舵人 Visionary',
      founderQuote: '「你負責追求品質極致，百夫長負責賦予產品品牌靈魂。百夫長與你一起立足台灣，走向世界。」',
      founderBio: '陳志彬總裁擁有逾 25 年 agency/品牌控股經驗。他首創「輕資產營運思維」，拒絕重資產束縛，專注品牌美學溢價。受任美國國家旅遊局兩年期顧問，深耕學術，並以「非典型政治參選」在台灣民主史上留下獨特的「陳志彬模式」清流印記。',
      subTitle: '旗下控股子公司',
      subDesc: '百夫長集團五大事業，各自引領行業產品與服務標準，構建多維度的高奢生活生態圈。',
      p1Title: '百夫長旅行箱',
      p1Desc: '全球首創主題式旅行箱發行體系，擁有「灣流線條」專利外觀與多項軍規防護技術。深受全球航空空服人員熱愛，被冠以「空姐箱」美譽。',
      p2Title: '百夫長旅行社',
      p2Desc: '開啟高奢行旅「第二曲線」。主打極地探索、西非文明祕境、南極豪華游輪等全球高門檻、珍稀探險路線，為菁英提供一生一次的靈魂洗禮。',
      p3Title: '百夫長頂奢俱樂部',
      p3Desc: '頂奢隱密交際會所。提供政商領袖、藝術大師、學術巨擘深度對談與社交密閉場所，融匯當代高尚美食品鑑與私人管家尊榮服務。',
      p4Title: '百選生鮮食品 (百選)',
      p4Desc: '極致美味探尋。全球直飛產地採購，引進 A5 頂級和牛、極地野生海鮮等珍稀食材，專為高奢品味群體打造的高級美食矩陣。',
      p5Title: '百夫長百禮精品',
      p5Desc: '商務美學客製。專為跨國企業高管、高奢拍賣會、國際頂級酒店提供定製款伴手禮包，將心意昇華為可移動的當代藝術工藝。',
      pBtn: '官網 ➔',
      consultantTitle: '品牌鏈顧問與品質審核：',
      consultantDesc: '百夫長絕不對品質妥協。所有參與「品牌鏈計畫」的產品或服務，必須經過百夫長集團陳志彬總裁與品牌鏈首席顧問連仲賢先生確認與檢測。通過審核者，方可正式冠以百夫長品牌商標，立足台灣，共同進軍中國、日本、東南亞及歐美高階市場。'
    },
    ja: {
      brandChain: '【センチュリオン✜ブランドチェーン】ライセンス計画',
      slogan: 'あなたが品質の極致を追求し、センチュリオンが製品にブランドの魂を吹き込む。センチュリオンはあなたと共に台湾に立脚し、世界へ羽ばたきます。',
      ctaApply: 'ブランドチェーンへの加入を申請する ➔',
      ctaExhibition: 'プレミアム展示を見る',
      visionLink: '創業理念',
      pillarsLink: 'グループ事業',
      dnaLink: 'ブランドDNA',
      esgLink: 'サステナビリティ',
      showcaseLink: 'プレミアム展示',
      insightsLink: 'ブランドニュース',
      wallLink: 'コラボ壁',
      coopBtn: '戦略提携',
      introDesc: 'あなたが品質の極致を追求し、センチュリオンが製品にブランドの魂を吹き込む。センチュリオンはあなたと共に台湾に立脚し、世界へ羽ばたきます。価格競争から完全に脱却しましょう。',
      founderTitle: 'グループ創業者 Visionary',
      founderQuote: '「あなたが品質の極致を追求し、センチュリオンが製品にブランドの魂を吹き込む。センチュリオンはあなたと共に台湾に立脚し、世界へ羽ばたきます。」',
      founderBio: '陳志彬総裁は、25年以上のグローバル貿易とブランド持分の経験を持っています。アセットライト経営を提唱し、米観光局のブランド顧問を務めています。学術支援にも熱心であり、「新政治美学」を掲げた選挙戦は、台湾の民主主義の歴史に独自の足跡を残しました。',
      subTitle: '主要ホールディングス事業',
      subDesc: 'センチュリオン・グループの5大事業は、それぞれの業界で製品とサービスの基準をリードし、プレミアムなライフスタイルを構築しています。',
      p1Title: 'センチュリオン・スーツケース',
      p1Desc: '世界初のテーマ性スーツケース発行体系。特許取得済みの「ガルフストリーム・ライン」外観を採用し、CA（キャビンアテンダント）に深く愛されています。',
      p2Title: 'センチュリオン・トラベル',
      p2Desc: 'ハイエンド旅行の「第二曲線」を開拓。極地探検、西アフリカ文明秘境、南極豪華クルーズなど、エリート向けの体験を提供します。',
      p3Title: 'センチュリオン・クラブ',
      p3Desc: '最高峰のプライベートサロン。政財界のリーダーや芸術家たちに深い対話の場を提供し、ソムリエによる美食サービスを提供します。',
      p4Title: '百選生鮮食品（百選）',
      p4Desc: '究極の美食探求。世界中からA5最高ランク和牛や極地シーフードなどの希少な食材を直輸入し、一流のグルメ体験を演出します。',
      p5Title: 'センチュリオン・ギフト',
      p5Desc: 'プレミアムギフトの特注。グローバル企業幹部、オークション、一流ホテル向けのカスタマイズギフトを提供し、移動する現代アートへと昇華させます。',
      pBtn: '公式サイト ➔',
      consultantTitle: '顧問および品質審査：',
      consultantDesc: 'センチュリオンは品質に一切妥協しません。参加するすべての製品やサービスは、陳志彬総裁とブランドチェーン主席顧問の連仲賢氏による厳格な審査に合格する必要があります。審査を通過したものだけが、センチュリオンの商標を冠し、グローバル市場へ進出できます。'
    },
    en: {
      brandChain: '[CENTURION✜Brand Link] Licensing Program',
      slogan: 'You pursue the ultimate quality; Centurion breathes the brand\'s soul into the product. Together with you, Centurion stands firm in Taiwan and marches toward the world.',
      ctaApply: 'Apply to Join CENTURION Brand Link ➔',
      ctaExhibition: 'Explore Luxury Exhibition',
      visionLink: 'Philosophy',
      pillarsLink: 'Subsidiaries',
      dnaLink: 'Brand DNA',
      esgLink: 'Humanity',
      showcaseLink: 'Showcase',
      insightsLink: 'Insights',
      wallLink: 'Wall of Fame',
      coopBtn: 'Strategic Coop',
      introDesc: 'You pursue the ultimate quality; Centurion breathes the brand\'s soul into the product. Together with you, Centurion stands firm in Taiwan and marches toward the world. Escape the price war forever.',
      founderTitle: 'Group Founder & Visionary',
      founderQuote: '"You pursue the ultimate quality; Centurion breathes the brand\'s soul into the product. Together with you, Centurion stands firm in Taiwan and marches toward the world."',
      founderBio: 'President Chih-Pin Chen possesses over 25 years of global trade and brand holding expertise. He pioneered the "Asset-Light Strategy", avoiding heavy assets to focus on aesthetic premiums. Appointed as a brand consultant for Brand USA for a two-year term, he deeply supports academia and left a unique footprint of "New Political Aesthetic" in Taiwan\'s democratic history.',
      subTitle: 'Subsidiary Matrix',
      subDesc: 'The five core businesses of the Centurion Group each lead their respective industry standards, building a multi-dimensional luxury lifestyle ecosystem.',
      p1Title: 'CENTURION Luggage',
      p1Desc: 'The world\'s first themed luggage system. Featuring the patented "Gulfstream Line" exterior, it is deeply loved by flight crews worldwide.',
      p2Title: 'CENTURION Travel',
      p2Desc: 'Unlocking the "second curve" of luxury travel. Focusing on polar exploration, West African expeditions, and luxury Antarctic cruises.',
      p3Title: 'CENTURION Club',
      p3Desc: 'An elite private salon providing a space for deep dialogue and networking for political, business, and artistic leaders.',
      p4Title: 'CENTURION Select (Baixuan)',
      p4Desc: 'The ultimate culinary exploration. Directly importing rare ingredients such as A5 Wagyu beef and polar wild seafood from global origins.',
      p5Title: 'CENTURION Gifts',
      p5Desc: 'Premium corporate gifts. Tailored for multinational executives, luxury auctions, and top-tier hotels, elevating gifts into mobile contemporary art.',
      pBtn: 'Website ➔',
      consultantTitle: 'Advisors & Quality Audit:',
      consultantDesc: 'Centurion never compromises on quality. All products or services must be verified by President Chih-Pin Chen and Chief Consultant Lien Chung-Hsien. Only those who pass the audit can officially bear the Centurion trademark to expand globally.'
    }
  };

  // 資料庫讀取
  const fetchShowcaseData = async () => {
    try {
      setLoadingShowcase(true);
      const { data, error } = await supabaseCenturion
        .from('centurion_showcase')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: false });

      if (error || !data || data.length === 0) throw new Error('Showcase empty');
      const safeData = (data as any) as LuxuryProduct[];
      setShowcaseItems(safeData);
    } catch (err) {
      setShowcaseItems([
        { id: 1, name: 'CENTURION 麥迪遜藍 29吋旗艦款旅行箱', price_tag: 'NT$ 12,800', tagline: '裝載最重要一切的移動城堡', description: '經典雙輪避震設計搭配專利灣流抗衝擊箱體，以高密度法式噴塗麥迪遜藍，體現商務長途飛行的優雅品味。', image_url: 'https://store.eternal-bc.com/zh-TW/products/centurion%E7%99%BE%E5%A4%AB%E9%95%B7%E6%8B%89%E9%8D%8A%E6%AC%BE%E8%A1%8E%E6%9D%8E%E7%AE%B1-%E9%BA%A5%E8%BF%CD%E9%81%9C%E8%97%8D-29%E5%90%8B', is_featured: true },
        { id: 2, name: 'CENTURION × Excell 限量聯名登機箱', price_tag: 'NT$ 8,800', tagline: '街頭藝術與工業美學的極致跨界', description: '與工業包材大廠 Excell 共同開發，將大膽的街頭警示膠帶元素，完美融匯進 20 吋精鋼防禦登機箱面。', image_url: 'https://centurion.tw/news_inner_pages-106.html', is_featured: true },
        { id: 3, name: 'CENTURION Save Earth 自然保育系列旅行箱', price_tag: 'NT$ 10,800', tagline: '行走的地球永續環保宣言', description: '採用高彈性多格布袋、羽量級 PC 複合材質，配置 TSA 國際海關鎖，每一次出行裝載的是對自然的致敬。', image_url: 'https://www.centuriontravel.tw/centurion', is_featured: true }
      ]);
    } finally {
      setLoadingShowcase(false);
    }
  };

  const fetchPressData = async () => {
    try {
      setLoadingItemsPress(true);
      const { data, error } = await supabaseCenturion
        .from('centurion_press')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: false });

      if (error || !data || data.length === 0) throw new Error('Press empty');
      const safeData = (data as any) as PressItem[];
      setPressItems(safeData);
    } catch (err) {
      setPressItems([
        { id: 1, title: '百夫長行李箱2019年生產優化開箱評測', summary: '針對早期手把零件疑慮，證實品牌自2019年10月起委託全新新代工廠，全面升級引進防滑多段式拉桿與360度靜音大四輪，有效重塑品牌耐用與卓越美譽。', news_url: 'https://www.centurionbuy.com/blog/202311', image_url: '' },
        { id: 2, title: '經典黑色拉鍊款百夫長行李箱開箱實測', summary: '部落客針對經典24吋麥迪遜藍與曜石黑箱進行極致開箱。引述創辦人陳志彬500公克環保法則，指出每減少重量即能有效減輕飛行燃油碳排放。', news_url: 'https://ee025479.pixnet.net/blog/posts/17347319871', image_url: '' },
        { id: 3, title: 'CENTURION百夫長品牌環保起源與設計哲學', summary: '記載創辦人陳志彬因見證全球自然破壞，於2015年發表CENTURION品牌，成為全球首個宣傳海洋、森林與動物保育三大主題之旅行箱品牌。其著名的「灣流式」線條專利設計，象徵不分民族的團結精神與文化傳承。', news_url: 'https://www.centuriontravel.tw/centurion', image_url: '' }
      ]);
    } finally {
      setLoadingItemsPress(false);
    }
  };

  const fetchWallData = async () => {
    try {
      setLoadingItems(true);
      const { data, error } = await supabaseCenturion
        .from('centurion_wall_of_fame')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false });

      if (error || !data || data.length === 0) throw new Error('Wall empty');
      setItems((data as any) as WallOfFameItem[]);
    } catch (err) {
      setItems([
        { id: '1', year: '2018', brand: 'STAGE (小豬 羅志祥)', founder: '羅志祥', category: 'artist-ip', type: '藝人潮流品牌', description: '潮流時尚與旅行箱的跨界碰撞，引領街頭行旅風潮。' },
        { id: '2', year: '2019', brand: 'DEBRAND (陳冠希)', founder: '陳冠希', category: 'artist-ip', type: '潮流設計師聯名', description: '以華人文字與街頭文化為核心，探索旅行箱的叛逆美學。' },
        { id: '3', year: '2019', brand: 'Andox & Box', founder: '劉德華活動合作', category: 'artist-ip', type: '角色 IP', description: '劉德華設計的經典牛公仔，注入可愛與玩味的潮流旅行體驗。' }
      ]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchShowcaseData();
    fetchPressData();
    fetchWallData();
  }, []);

  // 處理 B2B 表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    try {
      const { error } = await supabaseCenturion
        .from('centurion_partnership_leads')
        .insert([{
          company_name: formData.company_name,
          contact_name: formData.contact_name,
          phone: formData.phone,
          email: formData.email,
          business_area: formData.business_area,
          timeframe: formData.timeframe,
          proposal_summary: formData.proposal_summary,
          status: 'pending'
        }]);

      if (error) throw error;

      const mailRes = await fetch('/api/send-partner-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }) // 同步攜帶當前語系送出
      });
      
      if (!mailRes.ok) {
        console.warn('自動郵件通知發送失敗，但提案資料已成功備份寫入資料庫。');
      }

      setSubmitStatus('success');
      setFormData({
        company_name: '',
        contact_name: '',
        phone: '',
        email: '',
        business_area: '【百夫長✜品牌鏈】品牌授權計畫',
        timeframe: '加入百夫長，立即開始 (1個月內)',
        proposal_summary: ''
      });
    } catch (err) {
      console.error('Failed to submit B2B lead:', err);
      setSubmitStatus('error');
    }
  };

  const featuredShowcase = showcaseItems.filter(item => item.is_featured);
  const filteredItems = filter === 'all' ? items : items.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-[#AF8943] selection:text-white">
      
      {/* 導覽列 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/90 border-b border-[#EFECE6] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo 與語系切換器 */}
          <div className="flex items-center space-x-4">
            <img 
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_100/1886487/831598_863023.png" 
              alt="CENTURION" 
              className="h-10 w-auto object-contain"
            />
            {/* 高奢極簡三國語語系切換器 */}
            <div className="flex items-center space-x-2 border-l border-[#EFECE6] pl-4 font-mono text-[10px] tracking-widest text-stone-400">
              <button onClick={() => setLang('zh')} className={`hover:text-[#AF8943] transition-colors ${lang === 'zh' ? 'text-[#AF8943] font-bold' : ''}`}>ZH</button>
              <span>|</span>
              <button onClick={() => setLang('ja')} className={`hover:text-[#AF8943] transition-colors ${lang === 'ja' ? 'text-[#AF8943] font-bold' : ''}`}>JA</button>
              <span>|</span>
              <button onClick={() => setLang('en')} className={`hover:text-[#AF8943] transition-colors ${lang === 'en' ? 'text-[#AF8943] font-bold' : ''}`}>EN</button>
            </div>
          </div>
          
          {/* 桌面端選單 */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 text-xs tracking-[0.15em] uppercase text-stone-500 font-medium">
            <a href="#vision" className="hover:text-[#AF8943] transition-colors">{dict[lang].visionLink}</a>
            <a href="#pillars" className="hover:text-[#AF8943] transition-colors">{dict[lang].pillarsLink}</a>
            <a href="#dna" className="hover:text-[#AF8943] transition-colors">{dict[lang].dnaLink}</a>
            <a href="#esg" className="hover:text-[#AF8943] transition-colors">{dict[lang].esgLink}</a>
            <Link href="/showcase" className="hover:text-[#AF8943] transition-colors">{dict[lang].showcaseLink}</Link>
            <Link href="/press" className="hover:text-[#AF8943] transition-colors">{dict[lang].insightsLink}</Link>
            <a href="#wall" className="hover:text-[#AF8943] transition-colors">{dict[lang].wallLink}</a>
          </div>

          <div className="hidden md:block">
            <a 
              href="#b2b-form" 
              className="bg-[#AF8943] hover:bg-[#93702F] text-white font-semibold px-6 py-3 rounded-none text-xs tracking-[0.2em] transition-colors"
            >
              {dict[lang].coopBtn}
            </a>
          </div>

          <button 
            className="md:hidden text-stone-600 hover:text-stone-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* 第一畫面 (Hero Section) */}
      <section id="vision" className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 space-y-10">
          <div className="inline-flex items-center space-x-3 text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase font-mono">
            <span className="w-12 h-[1px] bg-[#AF8943]"></span>
            <span>CENTURION GROUP GLOBAL flag PORTAL</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-serif text-stone-900 leading-[1.15] font-light">
            {lang === 'zh' && <>你有好服務、好產品？<br /><span className="font-normal italic text-[#AF8943]">加入【百夫長✜品牌鏈】品牌授權計畫</span></>}
            {lang === 'ja' && <>優れたサービスや製品？<br /><span className="font-normal italic text-[#AF8943]">【ブランドチェーン】へ加入する</span></>}
            {lang === 'en' && <>Great Products or Services?<br /><span className="font-normal italic text-[#AF8943]">Join [CENTURION Brand Link] Program</span></>}
          </h1>
          <p className="text-stone-600 text-base lg:text-lg leading-relaxed max-w-2xl font-light">
            {dict[lang].introDesc}
          </p>
          <div className="flex flex-wrap gap-5 pt-4">
            <a href="#b2b-form" className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold px-8 py-4 rounded-none text-xs tracking-[0.2em] transition-all duration-300">
              {dict[lang].ctaApply}
            </a>
            <Link href="/showcase" className="border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold px-8 py-4 rounded-none text-xs tracking-[0.15em] transition-all duration-300">
              {dict[lang].ctaExhibition}
            </Link>
          </div>
        </div>

        {/* 創辦人與集團總裁神格化 diptych [造神單元] */}
        <div className="lg:col-span-5 bg-white p-10 rounded-none border border-[#EFECE6] shadow-sm space-y-8">
          <div className="inline-flex items-center space-x-2 text-[#AF8943] text-[10px] tracking-widest uppercase font-bold font-mono">
            <UserCheck size={14} />
            <span>{dict[lang].founderTitle}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden border border-[#EFECE6] relative group">
              <img 
                src="https://www.tristarnews.com.tw/upload/imgDB/202507101258184RWB.jpg" 
                alt="陳志彬 總裁" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[8px] px-2 py-0.5 font-mono">Brand USA Advisor</div>
            </div>
            <div className="aspect-[3/4] overflow-hidden border border-[#EFECE6] relative group">
              <img 
                src="https://s.yimg.com/ny/api/res/1.2/WPPeW6pzB.D6A7aDnRp8tg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQ4MA--/https://media.zenfs.com/ko/hoomedia_675/5602e44d27d26fdb2035132c90eb9579" 
                alt="陳志彬 總裁" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[8px] px-2 py-0.5 font-mono">New Political Aesthetic</div>
            </div>
          </div>

          <p className="text-xl italic font-serif text-stone-800 leading-relaxed font-light">
            {dict[lang].founderQuote}
          </p>
          <div className="border-t border-[#EFECE6] pt-6">
            <h4 className="text-lg font-serif font-bold text-stone-900 tracking-wider">陳志彬 Chih-Pin Chen</h4>
            <p className="text-[10px] text-[#AF8943] uppercase tracking-widest mt-1">FOUNDER & CEO / BRAND USA ADVISOR</p>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed font-light">
            {dict[lang].founderBio}
          </p>
        </div>
      </section>

      {/* 第二單元：控股子公司 */}
      <section id="pillars" className="bg-[#F7F4EE] py-24 lg:py-32 border-t border-b border-[#EFECE6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">SUBSIDIARY MATRIX</span>
            <h2 className="text-4xl font-serif text-stone-900 font-light">{dict[lang].subTitle}</h2>
            <p className="text-stone-500 text-sm max-w-2xl mx-auto font-light">{dict[lang].subDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🧳</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">{dict[lang].p1Title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">{dict[lang].p1Desc}</p>
              </div>
              <a href="https://store.eternal-bc.com/collections/%E7%99%BE%E5%A4%AB%E9%95%B7%E6%97%85%E8%A1%8C%E7%AE%B1" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>{dict[lang].pBtn}</span>
              </a>
            </div>

            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">✈️</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">{dict[lang].p2Title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">{dict[lang].p2Desc}</p>
              </div>
              <a href="https://www.centuriontravel.tw/centurion" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>{dict[lang].pBtn}</span>
              </a>
            </div>

            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🍷</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">{dict[lang].p3Title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">{dict[lang].p3Desc}</p>
              </div>
              <a href="https://centurionclub.tw/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>{dict[lang].pBtn}</span>
              </a>
            </div>

            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🥩</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">{dict[lang].p4Title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">{dict[lang].p4Desc}</p>
              </div>
              <a href="https://www.baixuanmaoyi.com.tw/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>{dict[lang].pBtn}</span>
              </a>
            </div>

            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🎁</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">{dict[lang].p5Title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">{dict[lang].p5Desc}</p>
              </div>
              <a href="#b2b-form" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>{dict[lang].coopBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 第三單元：【百夫長✜品牌鏈】 */}
      <section id="incubator" className="py-24 lg:py-32 max-w-7xl mx-auto px-6 border-b border-[#EFECE6]">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase inline-flex items-center space-x-2 font-mono">
              <Sparkles size={16} />
              <span>INCUBATE YOUR CENTURION</span>
            </span>
            <h2 className="text-4xl font-serif text-stone-900 font-light leading-tight">
              {dict[lang].brandChain}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {dict[lang].slogan}
            </p>
            <div className="p-6 bg-[#FAF8F5] border border-[#EFECE6] space-y-3">
              <h4 className="text-sm font-serif font-bold text-stone-900">{dict[lang].consultantTitle}</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed font-light">
                {dict[lang].consultantDesc}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-[#EFECE6] space-y-4">
              <div className="text-2xl text-[#AF8943] font-mono">01</div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                {lang === 'zh' && '品牌高奢化，徹底告別價格戰'}
                {lang === 'ja' && 'ブランドプレミアム化、価格競争から脱却'}
                {lang === 'en' && 'Brand Premiumization, Escape Price Wars'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                {lang === 'zh' && '傳統代工只能打價格戰。透過掛牌百夫長（CENTURION）商標，產品價值即刻躍升。'}
                {lang === 'ja' && 'OEMの薄利から脱却。センチュリオン商標を冠することで、ブランド価値が即座に跳ね上がります。'}
                {lang === 'en' && 'OEM margins are slim. By bearing the Centurion mark, your product value leaps instantaneously.'}
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EFECE6] space-y-4">
              <div className="text-2xl text-[#AF8943] font-mono">02</div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                {lang === 'zh' && '無縫對接全球頂級聯名 IP'}
                {lang === 'ja' && 'グローバルIPとのシームレス提携'}
                {lang === 'en' && 'Seamless Integration with Global IPs'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                {lang === 'zh' && '你的貼牌產品將有資格對接百夫長長期持有的迪士尼、京都 SOU‧SOU、故宮等一線 IP。'}
                {lang === 'ja' && 'あなたの製品は、ディズニー、SOU・SOU、故宮など、提携IPとの特別限定モデルを開発可能になります。'}
                {lang === 'en' && 'Your authorized products will be eligible to co-brand with Disney, SOU・SOU, and the Palace Museum.'}
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EFECE6] space-y-4">
              <div className="text-2xl text-[#AF8943] font-mono">03</div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                {lang === 'zh' && '全面解鎖全球主流分銷通路'}
                {lang === 'ja' && 'グローバル販売網の解放'}
                {lang === 'en' && 'Unlock Global Distribution Channels'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                {lang === 'zh' && '我們提供品牌加值，我們將多方業務提案，您也能自由進行通路、銷售佈局。'}
                {lang === 'ja' && 'ブランド付加価値を提供し、独自のチャネルや販売網も自由に展開していただけます。'}
                {lang === 'en' && 'We provide the brand equity. You are free to distribute and manage your channels with no limits.'}
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EFECE6] space-y-4">
              <div className="text-2xl text-[#AF8943] font-mono">04</div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                {lang === 'zh' && '高溢價，利潤共享共榮'}
                {lang === 'ja' && '高プレミアム、共存共栄の利益分配'}
                {lang === 'en' && 'High Premium, Shared Prosperity'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                {lang === 'zh' && '「你負責追求品質極致，百夫長負責賦予產品品牌靈魂。」雙方進行商業加值合作，共創健康長線。'}
                {lang === 'ja' && '「あなたが品質の極致を追求し、センチュリオンが製品にブランドの魂を吹き込む。」共同で価値を創造します。'}
                {lang === 'en' && '\"You pursue the ultimate quality; Centurion breathes the brand\'s soul.\" Let\'s scale premium value together.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 第四單元：首頁動態精選 5~10 品展廳 */}
      <section id="luxury-exhibition" className="bg-[#FAF8F5] py-24 lg:py-32 border-b border-[#EFECE6]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center space-y-4 mb-20">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase font-mono">HOME FEATURED SELECTIONS</span>
            <h2 className="text-4xl font-serif text-stone-900 font-light">
              {lang === 'zh' && '首頁精選典藏'}
              {lang === 'ja' && 'ホームプレミアムコレクション'}
              {lang === 'en' && 'Home Premium Curations'}
            </h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
              {lang === 'zh' && '此處為後台自主挑選與精選之 5~10 品頂規認證產品，代表集團對品質的最高背書。'}
              {lang === 'ja' && '管理者によって厳選された、品質を100%保証する5〜10のフラッグシップ商品。'}
              {lang === 'en' && 'Curated items hand-selected by admin, representing the absolute standard of our holding.'}
            </p>
          </div>

          {loadingShowcase ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-[#AF8943]" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {featuredShowcase.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-white border border-[#EFECE6] p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-md group"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-widest">
                      <span>PREMIUM CERTIFIED</span>
                      <span className="text-[#AF8943] font-bold">{prod.price_tag}</span>
                    </div>
                    
                    <div className="aspect-[4/3] bg-[#FAF8F5] border border-[#EFECE6] flex flex-col justify-center items-center p-6 relative overflow-hidden">
                      <span className="text-[#AF8943] font-serif font-bold text-xl">{prod.price_tag}</span>
                      <span className="text-[9px] text-stone-400 font-mono mt-1 uppercase tracking-widest">{prod.tagline}</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-[#AF8943] transition-colors leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      {prod.description}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-[#F5F2EB] mt-8 flex justify-between items-center">
                    <span className="text-[10px] text-[#AF8943] font-bold tracking-widest font-mono">CENTURION APPROVED</span>
                    <Link href="/showcase" className="text-stone-400 hover:text-[#AF8943] transition-colors">
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              href="/showcase" 
              className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold px-8 py-4 rounded-none text-xs tracking-[0.2em] transition-all duration-300 inline-block"
            >
              {lang === 'zh' && '進入獨立會館 檢視完整高奢品線 ➔'}
              {lang === 'ja' && '独立展示会館で全ての商品ラインを見る ➔'}
              {lang === 'en' && 'Enter Subpage & View All Products ➔'}
            </Link>
          </div>

        </div>
      </section>

      {/* 第五單元：品牌核心 DNA */}
      <section id="dna" className="py-24 lg:py-32 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase font-mono">BRAND DNA</span>
          <h2 className="text-4xl font-serif text-stone-900 font-light">
            {lang === 'zh' && '世紀箱包的卓越基因'}
            {lang === 'ja' && 'スーツケースの卓越した遺伝子'}
            {lang === 'en' && 'The Grand Legacy DNA'}
          </h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
            {lang === 'zh' && '百夫長秉持奢侈品牌的嚴苛標準，將設計專利、永續理念與功能細節完美融為一體。'}
            {lang === 'ja' && 'センチュリオンは高貴な品質基準を遵守し、デザイン意匠、サステナビリティ、機能美を融合します。'}
            {lang === 'en' && 'Strictly adhering to global standards, fusing designs with environmental protection.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 border border-[#EFECE6] space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-[#AF8943]/5 rounded-none flex items-center justify-center text-[#AF8943]">
              <Sparkles size={22} />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              {lang === 'zh' && '輕資產營運與美學'}
              {lang === 'ja' && 'アセットライト経営'}
              {lang === 'en' && 'Asset-Light Design'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {lang === 'zh' && '比照 Apple 與 Nike 營運模式，專注於美學研發與品牌跨界，成功打破重型製造業對創意的禁錮。'}
              {lang === 'ja' && 'Apple や Nike と同様、美学設計とグローバル提携にリソースを集中し、製造業の常識を打破。'}
              {lang === 'en' && 'Just like Apple and Nike, focused strictly on curation and global design capabilities.'}
            </p>
          </div>

          <div className="bg-white p-8 border border-[#EFECE6] space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-[#AF8943]/5 rounded-none flex items-center justify-center text-[#AF8943]">
              <Globe size={22} />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              {lang === 'zh' && '全球美學發行體系'}
              {lang === 'ja' && 'グローバル発行体系'}
              {lang === 'en' && 'Global Curation'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {lang === 'zh' && '我們將旅行箱視為「移動的藝術畫幅」。如同郵局發行郵票，定期發表美學設計款。'}
              {lang === 'ja' && 'スーツケースは「移動するキャンバス」。郵便局が切手を発行するように美学をリリース。'}
              {lang === 'en' && 'Publishing themed designs as if post offices publishing stamps. A true aesthetic gallery.'}
            </p>
          </div>

          <div className="bg-white p-8 border border-[#EFECE6] space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-[#AF8943]/5 rounded-none flex items-center justify-center text-[#AF8943]">
              <Scale size={22} />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              {lang === 'zh' && '不分尺寸均一價'}
              {lang === 'ja' && 'サイズ不問一律価格'}
              {lang === 'en' && 'Flat-Pricing Rule'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {lang === 'zh' && '實行不分尺寸均一價政策，大幅簡化尊榮顧客的決策成本，實現渠道利潤共榮。'}
              {lang === 'ja' && 'サイズによる価格格差を廃止し、顧客の選択コストを最小限に。共栄の精神。'}
              {lang === 'en' && 'Eradicated traditional pricing based on size. Simplified purchase path for elites.'}
            </p>
          </div>

          <div className="bg-white p-8 border border-[#EFECE6] space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-[#AF8943]/5 rounded-none flex items-center justify-center text-[#AF8943]">
              <Award size={22} />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              {lang === 'zh' && '「胖胖箱」全球命名者'}
              {lang === 'ja' && '胖胖箱のグローバル命名者'}
              {lang === 'en' && 'Pang-Pang Creator'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {lang === 'zh' && '2015年由創辦人陳志彬親自定義「胖胖箱」詞語，引領全球箱包設計。'}
              {lang === 'ja' && '2015年、総裁の陳志彬が「胖胖箱（5:5比率）」を自ら定義。市場のトレンドをリード。'}
              {lang === 'en' && 'First defined and named the 5:5 golden ratio luggage in the Chinese-speaking world.'}
            </p>
          </div>
        </div>
      </section>

      {/* 第六單元：永續承諾與自然保育 */}
      <section id="esg" className="bg-[#F7F4EE] py-24 lg:py-32 border-t border-b border-[#EFECE6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">HUMANITY & ECOLOGY</span>
            <h2 className="text-4xl font-serif text-stone-900 font-light">
              {lang === 'zh' && '物種與人文保育承諾'}
              {lang === 'ja' && '種と地球サステナビリティ'}
              {lang === 'en' && 'Species and Sustainability'}
            </h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
              {lang === 'zh' && '奢華的核心，在於對生命與社會的溫暖關懷。百夫長將人文高度融入每一次的旅程。'}
              {lang === 'ja' && '高貴の真髄は自然への敬意にあります。あらゆる旅に人文の品格を吹き込みます。'}
              {lang === 'en' && 'The true core of luxury lies in the warmth and deep concern for our fragile biosphere.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
              <div className="w-12 h-12 bg-emerald-500/5 rounded-none flex items-center justify-center text-emerald-700">
                <Leaf size={22} />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                {lang === 'zh' && 'IUCN 紅色名單瀕危物種合作'}
                {lang === 'ja' && 'IUCNレッドリスト絶滅危惧種'}
                {lang === 'en' && 'IUCN Red-List Partnership'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {lang === 'zh' && '百夫長長期關注地球棲息地危機。我們依照「國際自然保護聯盟 (IUCN)」名單，發行保育主題旅行箱，喚起對物種的宣導。'}
                {lang === 'ja' && '絶滅危惧種の保護を訴え、パンダやトキなどのテーマ箱をリリース。すべての移動が、声なき生命を守る啓発活動です。'}
                {lang === 'en' && 'Focused long-term on biodiversity. Every single journey acts as a silent advocate for endangered species.'}
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
              <div className="w-12 h-12 bg-blue-500/5 rounded-none flex items-center justify-center text-blue-700">
                <Droplets size={22} />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                {lang === 'zh' && '氣候暖化與 Can use but save'}
                {lang === 'ja' && '地球温暖化防止と環境保護'}
                {lang === 'en' && 'Can Use But Save'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {lang === 'zh' && '「我們面臨暖化危機，不能僅消極逃避，更應採取積極綠色行為。」倡導低碳旅程。'}
                {lang === 'ja' && '「温暖化の危機に対し、消極的でなく、積極的な緑の行動をとるべきだ（Can use but save）」低炭素な行旅を提唱。'}
                {lang === 'en' && '\"We face warming crisis; we must take active green actions rather than escape.\" Shifting global carbon habits.'}
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
              <div className="w-12 h-12 bg-[#AF8943]/5 rounded-none flex items-center justify-center text-[#AF8943]">
                <TreePine size={22} />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                {lang === 'zh' && '森林保育「森、林、少、空」'}
                {lang === 'ja' && '森林資源と「森林少空」'}
                {lang === 'en' && 'Forest Conservation Concept'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {lang === 'zh' && '百夫長發表專屬木紋質感箱體，探討森林資源過度消耗警訊。教育新世代關注自然。'}
                {lang === 'ja' && '過度な森林伐採に警告を発する専用の木目テクスチャ。次世代が自然保護に関心を持つよう教育。'}
                {lang === 'en' && 'Specially printed woodgrain luggage warning against global logging. Educating the future leaders.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 第七單元：百夫長新知與媒體觀點 */}
      <section id="insights" className="py-24 lg:py-32 max-w-7xl mx-auto px-6 border-b border-[#EFECE6]">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">CENTURION INSIGHTS</span>
          <h2 className="text-4xl font-serif text-stone-900 font-light">
            {lang === 'zh' && '百夫長新知與媒體觀點'}
            {lang === 'ja' && 'センチュリオン新知識とメディア'}
            {lang === 'en' && 'Aesthetic Insights & Media'}
          </h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
            {lang === 'zh' && '匯聚當代主流財經媒體、電視專題報導與綠色旅程的前沿探討。'}
            {lang === 'ja' && '一流の経済メディア、テレビ特集報道を通じて、総裁の美学と戦術を紐解く。'}
            {lang === 'en' && 'Fusing top-tier business journals with direct public media broadcasts.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          <div className="bg-white border border-[#EFECE6] flex flex-col justify-between p-8 transition-all duration-300 hover:shadow-md group">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-widest">
                <span className="flex items-center space-x-1">
                  <FileText size={12} className="text-[#AF8943]" />
                  <span>{lang === 'zh' ? '主流財經專訪' : lang === 'ja' ? 'ビジネスインタビュー' : 'FINANCE INTERVIEW'}</span>
                </span>
                <span>2022.08</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 leading-snug group-hover:text-[#AF8943] transition-colors">
                {lang === 'zh' && '「以箱為郵票，發行地球美學」— 專訪創辦人陳志彬的品牌無邊界戰略'}
                {lang === 'ja' && '「スーツケースを切手のように、地球美学を発行する」ブランド無境界戦略'}
                {lang === 'en' && '\"Issuing luggage like stamps, presenting global aesthetics.\"'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {lang === 'zh' && '詳細報導陳志彬先生如何運用 Apple 與 Nike 模式的「輕資產營運思維」，拒絕重資產束縛，專注專利美學研發與物種保育的跨界。'}
                {lang === 'ja' && '重いアセットを拒否し、デザインと物種保護の提携に集中する「アセットライト」モデル。製造業の常識をくつがえす。'}
                {lang === 'en' && 'Detailing how President Chen utilizes Apple-like light asset paradigms to bypass heavy industry limitations.'}
              </p>
            </div>
            <a 
              href="https://money.udn.com/money/story/5612/8929993" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-bold tracking-widest pt-6 border-t border-[#F5F2EB] mt-8"
            >
              <span>{lang === 'zh' ? '閱讀完整報導' : 'READ REPORT'}</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="bg-white border border-[#EFECE6] flex flex-col justify-between p-8 transition-all duration-300 hover:shadow-md group">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-widest">
                <span className="flex items-center space-x-1">
                  <Video size={12} className="text-[#AF8943]" />
                  <span>{lang === 'zh' ? '電視媒體影音' : lang === 'ja' ? 'テレビ特集ビデオ' : 'BROADCAST SPECIAL'}</span>
                </span>
                <span>VIDEO SPOTLIGHT</span>
              </div>
              
              <div className="relative w-full h-44 bg-stone-100 border border-[#EFECE6] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-stone-950/5 group-hover:bg-stone-950/10 transition-colors z-10" />
                <div className="w-12 h-12 rounded-full bg-[#AF8943]/95 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform z-20">
                  <Play size={18} className="ml-1 fill-current" />
                </div>
                <div className="absolute bottom-3 left-4 z-20 text-[10px] font-mono text-[#AF8943] tracking-widest uppercase font-bold">
                  CENTURION Brand Story
                </div>
              </div>

              <h3 className="text-xl font-serif font-bold text-stone-900 leading-snug group-hover:text-[#AF8943] transition-colors">
                {lang === 'zh' && '一只裝載溫暖的「胖胖箱」：探索 CENTURION 席捲大眾行旅美學的幕後祕辛'}
                {lang === 'ja' && '温もりを運ぶ「胖胖箱」：センチュリオンが席巻した裏側に迫る'}
                {lang === 'en' && 'A luggage full of warmth: Uncovering the success of the golden 5:5 trunk'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {lang === 'zh' && '解構百夫長如何開創「胖胖箱」5:5 深度美學比例，並探討均一價如何從根本上免除消費者在旅行前夕的繁瑣計較。'}
                {lang === 'ja' && '5:5 の深さ黄金比を採用した胖胖箱の美学。旅行者の精神的、物理的コストをいかに削減したかを分析。'}
                {lang === 'en' && 'Deconstructing the design rules behind the 5:5 luggage, simplifying decision metrics for elites.'}
              </p>
            </div>
            <a 
              href="https://www.centurionbuy.com/blog/categories/%E5%AA%92%E9%AB%94%E5%A0%B1%E5%B0%8E" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-bold tracking-widest pt-6 border-t border-[#F5F2EB] mt-8"
            >
              <span>{lang === 'zh' ? '觀看專題影片' : 'WATCH VIDEO'}</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="bg-white border border-[#EFECE6] flex flex-col justify-between p-8 transition-all duration-300 hover:shadow-md group">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-widest">
                <span className="flex items-center space-x-1">
                  <FileText size={12} className="text-[#AF8943]" />
                  <span>{lang === 'zh' ? '綠色永續論壇' : lang === 'ja' ? 'グリーン・サステナブル' : 'GREEN FUTURE'}</span>
                </span>
                <span>2023.04</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 leading-snug group-hover:text-[#AF8943] transition-colors">
                {lang === 'zh' && '「每一次旅程，都是對綠色地球的致敬」— CENTURION 保育系列引爆迴響'}
                {lang === 'ja' && '「すべての旅は緑の地球へのオマージュ」センチュリオン保護シリーズの響き'}
                {lang === 'en' && '\"Every journey is a tribute to our green earth.\" - Species conservation echoes globally.'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {lang === 'zh' && '探討百夫長秉持的「Can use but save」之自然永續精神。報導詳細列舉其「森、林、少、空」木紋警示概念箱體，啟迪消費者。'}
                {lang === 'ja' && '「Can use but save」に込められたエコロジー精神。「森、林、少、空」の木目概念。'}
                {lang === 'en' && 'Delving into our core value \"Can use but save\". How environmental designs inspire citizens.'}
              </p>
            </div>
            <a 
              href="https://www.centuriontravel.tw/centurion" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-bold tracking-widest pt-6 border-t border-[#F5F2EB] mt-8"
            >
              <span>{lang === 'zh' ? '閱讀永續專題' : 'READ FORUM'}</span>
              <ExternalLink size={12} />
            </a>
          </div>

        </div>
      </section>

      {/* 全新第八單元：百夫長 PRESS (CENTURION PRESS) */}
      <section id="press" className="py-24 lg:py-32 max-w-7xl mx-auto px-6 border-b border-[#EFECE6]">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="inline-flex items-center space-x-3 text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">
              <BookOpen size={16} />
              <span>CENTURION PRESS</span>
            </div>
            <h2 className="text-4xl font-serif text-stone-900 font-light leading-tight">
              {lang === 'zh' && <>品牌影響力與<br /><span className="italic font-normal">社會公眾實踐</span></>}
              {lang === 'ja' && <>ブランド力と<br /><span className="italic font-normal">社会公衆実践</span></>}
              {lang === 'en' && <>Corporate Impact &<br /><span className="italic font-normal">Public Documentation</span></>}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {lang === 'zh' && '系統性整理百夫長（CENTURION）品牌生態圈、智財博弈、國際自駕觀光推廣與創辦人陳志彬先生之非典型參選政見、學術講座文獻，展現堅實的社會影響力與法理深度。'}
              {lang === 'ja' && 'センチュリオン・ブランドエコシステム、商標防衛戦、米国観光局顧問聘任、総裁・陳志彬の非典型政治理念を体系的にアーカイブ。'}
              {lang === 'en' && 'A comprehensive public archive mapping our global IPs, trademark victories (Supreme Court No.922), and President Chen\'s typical political aesthetics.'}
            </p>
            <div className="pt-6 border-t border-[#EFECE6] text-[10px] font-mono text-[#AF8943] tracking-widest">
              PUBLIC DOCUMENT ARCHIVE
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {pressItems.slice(0, 10).map((p) => (
              <div 
                key={p.id} 
                className="bg-white border border-[#EFECE6] p-6 hover:border-[#AF8943]/40 transition-all duration-300"
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setSelectedPress(selectedPress === p.id ? null : p.id)}
                >
                  <h4 className="text-sm font-serif font-bold text-stone-900 pr-4 hover:text-[#AF8943] transition-colors leading-snug">
                    {p.title}
                  </h4>
                  <ChevronRight 
                    size={16} 
                    className={`text-[#AF8943] transform transition-transform duration-300 ${selectedPress === p.id ? 'rotate-90' : ''}`} 
                  />
                </div>
                
                {selectedPress === p.id && (
                  <div className="mt-4 pt-4 border-t border-[#F5F2EB] space-y-4 animate-fadeIn">
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      {p.summary}
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-stone-400 font-mono">DOCUMENT ID: #{p.id.toString().padStart(3, '0')}</span>
                      {p.news_url && (
                        <a 
                          href={p.news_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-bold tracking-widest"
                        >
                          <span>{lang === 'zh' ? '檢視外部文獻' : 'VIEW DOCUMENT'}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 text-center">
              <span className="text-[11px] text-stone-400 italic font-light">
                {lang === 'zh' && '已載入最新 10 筆核心文獻。'}
                {lang === 'ja' && '最新 10 件の文献が読み込まれました。'}
                {lang === 'en' && 'Latest 10 core public archives loaded.'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 第九單元：法式聯名榮譽牆 */}
      <section id="wall" className="py-24 lg:py-32 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">WALL OF FAME</span>
          <h2 className="text-4xl font-serif text-stone-900 font-light">{dict[lang].wallLink}</h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
            {lang === 'zh' && '融匯時尚雜誌、跨國民生與文化機構的跨界品味，百夫長深獲全球菁英合作夥伴的高度信賴。'}
            {lang === 'ja' && 'ファッション誌、主要スーパー、文化機関との提携を通じて、洗練されたコラボ作品を世に送り出してきました。'}
            {lang === 'en' && 'Fusing top-tier lifestyle magazines and global channels, representing standard of co-branding.'}
          </p>
        </div>

        {/* 快篩按鈕組 */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {[
            { label: lang === 'zh' ? '全部合作' : 'ALL', value: 'all' },
            { label: lang === 'zh' ? '藝人 / IP 聯名' : 'ARTIST / IP', value: 'artist-ip' },
            { label: lang === 'zh' ? '媒體 / 雜誌' : 'MEDIA', value: 'media' },
            { label: lang === 'zh' ? '民生與零售通路' : 'RETAIL', value: 'brand-retail' },
            { label: lang === 'zh' ? '文化 / 藝術' : 'CULTURE', value: 'culture' }
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-5 py-2.5 text-xs font-medium tracking-[0.15em] transition-all duration-300 rounded-none border ${
                filter === btn.value
                  ? 'bg-[#AF8943] border-[#AF8943] text-white font-semibold'
                  : 'bg-white border-[#EFECE6] text-stone-500 hover:text-stone-900 hover:border-stone-400'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* 聯名牆 Grid */}
        {loadingItems ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <Loader2 className="animate-spin text-[#AF8943]" size={32} />
            <p className="text-xs text-stone-400 tracking-widest">loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-8 border border-[#EFECE6] flex flex-col justify-between hover:shadow-md hover:border-[#AF8943]/40 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#AF8943] font-mono text-sm font-semibold tracking-wider">{item.year}</span>
                    <span className="text-[9px] bg-[#FAF8F5] text-[#AF8943] px-2.5 py-1 rounded-none border border-[#EFECE6] uppercase tracking-widest font-semibold">
                      {item.type}
                    </span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#AF8943] transition-colors leading-snug">
                    {item.brand}
                  </h4>
                  {item.founder && (
                    <p className="text-[11px] text-stone-500 italic">FOUNDER: {item.founder}</p>
                  )}
                  <p className="text-xs text-stone-600 leading-relaxed pt-4 border-t border-[#F5F2EB] font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 第十單元：B2B 合作意向資料收集門戶 */}
      <section id="b2b-form" className="bg-[#FAF8F5] py-24 lg:py-32 border-t border-[#EFECE6]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">PARTNERSHIP ENQUIRY</span>
            <h2 className="text-4xl font-serif text-stone-900 font-light">{lang === 'zh' ? '開啟【加入百夫長品牌鏈】提案' : 'B2B PARTNERSHIP PORTAL'}</h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
              {lang === 'zh' && '歡迎品牌聯名、跨國採購與貼牌、品牌授權合作。請填寫下方意向，我們將在兩個工作天內親自致電與您對談。'}
              {lang === 'ja' && 'OEM提携、ブランドライセンス、コラボに関する提案。2営業日以内に専任チームよりご連絡いたします。'}
              {lang === 'en' && 'We welcome global co-branding and licensing applications. We will reach back within 2 business days.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-10 border border-[#EFECE6] shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
                  {lang === 'zh' ? '公司 / 組織名稱' : 'COMPANY NAME'}
                </label>
                <input 
                  type="text" 
                  required 
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
                  {lang === 'zh' ? '聯絡人姓名與職稱' : 'CONTACT NAME / TITLE'}
                </label>
                <input 
                  type="text" 
                  required 
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
                  {lang === 'zh' ? '聯絡電話' : 'PHONE NUMBER'}
                </label>
                <input 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
                  {lang === 'zh' ? '電子郵件信箱' : 'EMAIL ADDRESS'}
                </label>
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
                  {lang === 'zh' ? '預計合作領域' : 'BUSINESS FIELD'}
                </label>
                <select 
                  value={formData.business_area}
                  onChange={(e) => setFormData({ ...formData, business_area: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-700 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors"
                >
                  <option>【百夫長品牌鏈】品牌授權計畫 </option>
                  <option>百夫長旅行箱 (大宗採購/IP聯名)</option>
                  <option>百夫長生鮮選物 (百選經銷合作)</option>
                  <option>百夫長禮贈精品 (百禮開發/採購)</option>
                  <option>百夫長旅行社 (深度行程合作)</option>
                  <option>跨界品牌戰略合作</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
                  {lang === 'zh' ? '預計合作時程' : 'TIMEFRAME'}
                </label>
                <select 
                  value={formData.timeframe}
                  onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-700 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors"
                >
                  <option>立即開始 (1個月內)</option>
                  <option>中期規劃 (3個月內)</option>
                  <option>長期籌備 (半年內)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
                {lang === 'zh' ? '產品技術優勢與專利構想簡述' : 'PROPOSAL DETAILS'}
              </label>
              <textarea 
                rows={5} 
                required 
                value={formData.proposal_summary}
                onChange={(e) => setFormData({ ...formData, proposal_summary: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors" 
              />
            </div>

            {submitStatus === 'success' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-none flex items-center space-x-3">
                <CheckCircle className="text-emerald-600" size={18} />
                <span className="font-medium">
                  {lang === 'zh' && '您的提案已順利遞交。品牌鏈團隊將儘快與您對話。'}
                  {lang === 'ja' && '提案が正常に送信されました。お早めにご連絡いたします。'}
                  {lang === 'en' && 'Proposal received. Our Brand Link director will call back shortly.'}
                </span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-none">
                Error.
              </div>
            )}

            <div className="text-center pt-4">
              <button 
                type="submit" 
                disabled={submitStatus === 'submitting'}
                className="bg-[#AF8943] hover:bg-[#93702F] disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold px-16 py-4 rounded-none text-xs tracking-[0.2em] uppercase transition-colors w-full md:w-auto inline-flex items-center justify-center space-x-2"
              >
                {submitStatus === 'submitting' ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>{lang === 'zh' ? '送出戰略合作提案' : 'SUBMIT PROPOSAL'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 頁尾 */}
      <footer className="bg-[#FAF8F5] py-20 border-t border-[#EFECE6] text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="font-serif font-bold tracking-[0.3em] text-stone-900 text-2xl">CENTURION</div>
          <p className="tracking-widest font-light text-stone-400 uppercase">CENTURION GROUP © {new Date().getFullYear()} ALL RIGHTS RESERVED.</p>
          <div className="flex justify-center space-x-4 text-[10px] text-stone-400 font-mono">
            <span>MULTIPLE TENANT SEPARATION ACTIVE</span>
            <span>•</span>
            <span>LV PREMIUM DESIGN ARCHITECTURE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

---

## 📄 第二部分：完全覆蓋 `app/layout.tsx` (修正 Favicon 路徑)

由於 Facebook 的 CDN 連結在 **24 小時後就會自動過期** 導致 `403 (Forbidden)`。在生產環境中，網頁圖標（Favicon）一律應指回你放置在 `public/` 資料夾下的實體圖片：

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CENTURION 百夫長集團官網 - 以家為名，以旅為道",
  description: "全球唯一主題式旅行箱發行商，引領多角化頂級生活美學生態系統。",
  icons: {
    icon: "/favicon.jpg" // ➔ 100% 穩定、不失效、不產生 403 錯誤
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}