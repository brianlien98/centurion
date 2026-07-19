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
  Lock,
  Unlock,
  Plus,
  Trash2,
  Database,
  Layers,
  TrendingUp,
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

export default function CenturionPortal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // 1. 各資料表狀態
  const [items, setItems] = useState<WallOfFameItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loadingItems, setLoadingItems] = useState<boolean>(true);

  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [loadingPress, setLoadingItemsPress] = useState<boolean>(true);
  const [selectedPress, setSelectedPress] = useState<number | null>(null);

  const [showcaseItems, setShowcaseItems] = useState<LuxuryProduct[]>([]);
  const [loadingShowcase, setLoadingShowcase] = useState<boolean>(true);

  // 2. CMS 後台解鎖
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'showcase' | 'press' | 'wall'>('showcase');

  // 3. CMS 新增輸入
  const [newShowcase, setNewShowcase] = useState({
    name: '',
    price_tag: '',
    tagline: '',
    description: '',
    image_url: '',
    is_featured: true
  });
  
  const [newPress, setNewPress] = useState({
    title: '',
    summary: '',
    news_url: '',
    image_url: ''
  });

  const [newWall, setNewWall] = useState({
    year: '',
    brand: '',
    founder: '',
    category: 'artist-ip' as any,
    type: '',
    description: ''
  });

  const [cmsSubmitStatus, setCmsSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // 4. B2B 表單狀態
  const [formData, setFormData] = useState<PartnershipLeadInput>({
    company_name: '',
    contact_name: '',
    phone: '',
    email: '',
    business_area: '【百夫長品牌鏈】品牌授權計畫',
    timeframe: '加入百夫長，立即開始 (1個月內)',
    proposal_summary: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // 5. 資料庫讀取
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
        { id: 3, name: 'CENTURION Save Earth 自然保育系列旅行箱', price_tag: 'NT$ 10,800', tagline: '行走的地球永續環保宣言', description: '採用高彈性多格布袋、羽量級 PC 複合材質，配置 TSA 國際海關鎖，每一次出行都是對生命的致敬。', image_url: 'https://www.centuriontravel.tw/centurion', is_featured: true }
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

  const handleUnlockCms = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1978') {
      setAdminUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  // CMS 新增執行
  const handleAddShowcase = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSubmitStatus('submitting');
    try {
      const { error } = await supabaseCenturion.from('centurion_showcase').insert([newShowcase]);
      if (error) throw error;
      setCmsSubmitStatus('success');
      setNewShowcase({ name: '', price_tag: '', tagline: '', description: '', image_url: '', is_featured: true });
      await fetchShowcaseData();
    } catch (err) {
      setCmsSubmitStatus('error');
    }
  };

  const handleAddPress = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSubmitStatus('submitting');
    try {
      const { error } = await supabaseCenturion.from('centurion_press').insert([newPress]);
      if (error) throw error;
      setCmsSubmitStatus('success');
      setNewPress({ title: '', summary: '', news_url: '', image_url: '' });
      await fetchPressData();
    } catch (err) {
      setCmsSubmitStatus('error');
    }
  };

  const handleAddWall = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSubmitStatus('submitting');
    try {
      const { error } = await supabaseCenturion.from('centurion_wall_of_fame').insert([newWall]);
      if (error) throw error;
      setCmsSubmitStatus('success');
      setNewWall({ year: '', brand: '', founder: '', category: 'artist-ip', type: '', description: '' });
      await fetchWallData();
    } catch (err) {
      setCmsSubmitStatus('error');
    }
  };

  // CMS 刪除執行
  const handleDeleteShowcase = async (id: number) => {
    if (!confirm('您確定要永久下架此展示品嗎？')) return;
    try {
      const { error } = await supabaseCenturion.from('centurion_showcase').delete().eq('id', id);
      if (error) throw error;
      await fetchShowcaseData();
    } catch (err) {
      alert('刪除失敗。');
    }
  };

  const handleDeletePress = async (id: number) => {
    if (!confirm('確定下架此報導？')) return;
    try {
      const { error } = await supabaseCenturion.from('centurion_press').delete().eq('id', id);
      if (error) throw error;
      await fetchPressData();
    } catch (err) {
      alert('刪除失敗。');
    }
  };

  const handleDeleteWall = async (id: number) => {
    if (!confirm('確定下架此聯名夥伴？')) return;
    try {
      const { error } = await supabaseCenturion.from('centurion_wall_of_fame').delete().eq('id', id);
      if (error) throw error;
      await fetchWallData();
    } catch (err) {
      alert('刪除失敗。');
    }
  };

  // CMS 推薦切換
  const toggleFeatureShowcase = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabaseCenturion
        .from('centurion_showcase')
        .update({ is_featured: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      await fetchShowcaseData();
    } catch (err) {
      alert('切換失敗。');
    }
  };

  // 處理 B2B 表單提交（資料庫寫入 + API 自動發信雙向連動）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    try {
      // 1. 寫入 Supabase 資料庫
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

      // 2. 雙向對接：調用剛才建立的 Resend 郵件 API 發信給管理團隊
      const mailRes = await fetch('/api/send-partner-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
        business_area: '【百夫長品牌鏈】品牌授權計畫',
        timeframe: '加入百夫長，立即開始 (1個月內)',
        proposal_summary: ''
      });
    } catch (err) {
      console.error('Failed to submit B2B lead:', err);
      setSubmitStatus('error');
    }
  };

  // 前台精選過濾 (5~10品)
  const featuredShowcase = showcaseItems.filter(item => item.is_featured);

  // 篩選過濾聯名牆
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-[#AF8943] selection:text-white">
      
      {/* 導覽列 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/90 border-b border-[#EFECE6] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_100/1886487/831598_863023.png" 
              alt="CENTURION" 
              className="h-10 w-auto object-contain"
            />
            <span className="text-[9px] bg-[#AF8943]/10 text-[#AF8943] px-2.5 py-0.5 rounded-full font-mono font-semibold tracking-widest">PORTAL</span>
          </div>
          
          {/* 桌面端選單 */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 text-xs tracking-[0.15em] uppercase text-stone-500 font-medium">
            <a href="#vision" className="hover:text-[#AF8943] transition-colors">創辦理念</a>
            <a href="#pillars" className="hover:text-[#AF8943] transition-colors">控股子公司</a>
            <a href="#dna" className="hover:text-[#AF8943] transition-colors">核心基因</a>
            <a href="#esg" className="hover:text-[#AF8943] transition-colors">永續人文</a>
            <Link href="/showcase" className="hover:text-[#AF8943] transition-colors">典藏展廳</Link>
            <Link href="/press" className="hover:text-[#AF8943] transition-colors">百夫長新知</Link>
            <a href="#wall" className="hover:text-[#AF8943] transition-colors">聯名牆</a>
          </div>

          <div className="hidden md:block">
            <a 
              href="#b2b-form" 
              className="bg-[#AF8943] hover:bg-[#93702F] text-white font-semibold px-6 py-3 rounded-none text-xs tracking-[0.2em] transition-colors"
            >
              戰略合作
            </a>
          </div>

          {/* 行動端選單 */}
          <button 
            className="md:hidden text-stone-600 hover:text-stone-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-[#EFECE6] px-6 py-8 flex flex-col space-y-4 text-sm">
            <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">創辦理念</a>
            <a href="#pillars" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">五大版體</a>
            <a href="#dna" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">核心基因</a>
            <a href="#esg" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">永續人文</a>
            <a href="#insights" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">百夫長新知</a>
            <a href="#press" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">百夫長 PRESS</a>
            <a href="#wall" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">聯名牆</a>
            <a href="#b2b-form" onClick={() => setMobileMenuOpen(false)} className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold text-center py-4 rounded-none text-xs tracking-widest transition-colors">戰略合作</a>
          </div>
        )}
      </nav>

      {/* 第一畫面 (Hero Section + B2B OEM 招募提案入口) */}
      <section id="vision" className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 space-y-10">
          <div className="inline-flex items-center space-x-3 text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase font-mono">
            <span className="w-12 h-[1px] bg-[#AF8943]"></span>
            <span>CENTURION GROUP GLOBAL flag PORTAL</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-serif text-stone-900 leading-[1.15] font-light">
            你有好服務、好產品？<br />
            <span className="font-normal italic text-[#AF8943]">加入【百夫長品牌鏈】品牌授權計畫</span>
          </h1>
          <p className="text-stone-600 text-base lg:text-lg leading-relaxed max-w-2xl font-light">
            你負責追求品質極致，百夫長負責賦予產品品牌靈魂。百夫長與你一起立足台灣，走向世界。加入百夫長全球品牌美學體系，獲得高奢溢價賦能，徹底顛覆傳統價格戰。
          </p>
          <div className="flex flex-wrap gap-5 pt-4">
            <a href="#b2b-form" className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold px-8 py-4 rounded-none text-xs tracking-[0.2em] transition-all duration-300">
              申請加入百夫長品牌鏈 ➔
            </a>
            <Link href="/showcase" className="border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold px-8 py-4 rounded-none text-xs tracking-[0.15em] transition-all duration-300">
              檢視典藏展廳 (Showcase)
            </Link>
          </div>
        </div>

        {/* 創辦人與集團總裁神格化 diptych [造神單元] */}
        <div className="lg:col-span-5 bg-white p-10 rounded-none border border-[#EFECE6] shadow-sm space-y-8">
          <div className="inline-flex items-center space-x-2 text-[#AF8943] text-[10px] tracking-widest uppercase font-bold font-mono">
            <UserCheck size={14} />
            <span>集團品牌掌舵人 Visionary</span>
          </div>
          
          {/* 總裁雙重高規格照片並排 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden border border-[#EFECE6] relative group">
              <img 
                src="https://www.tristarnews.com.tw/upload/imgDB/202507101258184RWB.jpg" 
                alt="陳志彬 總裁 - 美國國家旅遊局特聘顧問" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[8px] px-2 py-0.5 font-mono">Brand USA Advisor</div>
            </div>
            <div className="aspect-[3/4] overflow-hidden border border-[#EFECE6] relative group">
              <img 
                src="https://s.yimg.com/ny/api/res/1.2/WPPeW6pzB.D6A7aDnRp8tg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQ4MA--/https://media.zenfs.com/ko/hoomedia_675/5602e44d27d26fdb2035132c90eb9579" 
                alt="陳志彬 總裁 - 新政治美學實踐家" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[8px] px-2 py-0.5 font-mono">New Political Aesthetic</div>
            </div>
          </div>

          <p className="text-xl italic font-serif text-stone-800 leading-relaxed font-light">
            「你負責追求品質極致，百夫長負責賦予產品品牌靈魂。百夫長與你一起立足台灣，走向世界。」
          </p>
          <div className="border-t border-[#EFECE6] pt-6">
            <h4 className="text-lg font-serif font-bold text-stone-900 tracking-wider">陳志彬 Chih-Pin Chen</h4>
            <p className="text-[10px] text-[#AF8943] uppercase tracking-widest mt-1">百夫長集團總裁 / 美國國家旅遊局特聘顧問</p>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed font-light">
            陳志彬總裁擁有逾 25 年的跨國貿易、品牌控股與美學整合戰略經驗。他首創「輕資產營運思維」，拒絕重資產束縛，專注品牌美學溢價。他創立的 CENTURION 品牌，引領了全亞洲箱包外觀大变革。受任美國國家旅遊局（Brand USA）兩年期顧問，深耕學術，並以「非典型政治參選」在台灣民主史上留下獨特的「陳志彬模式」清流印記。
          </p>
        </div>
      </section>

      {/* 第二單元：控股子公司矩陣 */}
      <section id="pillars" className="bg-[#F7F4EE] py-24 lg:py-32 border-t border-b border-[#EFECE6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">SUBSIDIARY MATRIX</span>
            <h2 className="text-4xl font-serif text-stone-900 font-light">旗下控股子公司</h2>
            <p className="text-stone-500 text-sm max-w-2xl mx-auto font-light">百夫長集團五大事業，各自引領行業產品與服務標準，構建多維度的高奢生活生態圈。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🧳</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">百夫長旅行箱股份</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  全球首創主題式旅行箱發行體系，擁有「灣流線條」專利外觀與多項軍規防護技術。深受全球航空空服人員熱愛，被冠以「空姐箱」美譽。
                </p>
              </div>
              <a href="https://store.eternal-bc.com/collections/%E7%99%BE%E5%A4%AB%E9%95%B7%E6%97%85%E8%A1%8C%E7%AE%B1" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>子公司官網 ➔</span>
              </a>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">✈️</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">百夫長旅行社</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  開啟高奢行旅「第二曲線」。主打極地探索、西非文明祕境、南極豪華游輪等全球高門檻、珍稀探險路線，為菁英提供一生一次的靈魂洗禮。
                </p>
              </div>
              <a href="https://www.centuriontravel.tw/centurion" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>旅行社官網 ➔</span>
              </a>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🍷</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">百夫長頂奢俱樂部</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  頂奢隱密交際會所。提供政商領袖、藝術大師、學術巨擘深度對談與社交密閉場所，融匯當代高尚美食品鑑與私人管家尊榮服務。
                </p>
              </div>
              <a href="https://centurionclub.tw/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>俱樂部官網 ➔</span>
              </a>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🥩</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">百選生鮮食品 (百選)</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  極致美味探尋。全球直飛產地採購，引進 A5 頂級和牛、極地野生海鮮等珍稀食材，專為高奢品味群體打造的高級美食矩陣。
                </p>
              </div>
              <a href="https://www.baixuanmaoyi.com.tw/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>百選官網 ➔</span>
              </a>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🎁</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">百夫長百禮精品</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  商務美學客製。專為跨國企業高管、高奢拍賣會、國際頂級酒店提供定製款伴手禮包，將心意昇華為可移動的當代藝術工藝。
                </p>
              </div>
              <a href="#b2b-form" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>定製諮詢 ➔</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 第三單元：【百夫長品牌鏈】品牌授權計畫 */}
      <section id="incubator" className="py-24 lg:py-32 max-w-7xl mx-auto px-6 border-b border-[#EFECE6]">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase inline-flex items-center space-x-2 font-mono">
              <Sparkles size={16} />
              <span>INCUBATE YOUR CENTURION</span>
            </span>
            <h2 className="text-4xl font-serif text-stone-900 font-light leading-tight">
              加入【百夫長品牌鏈】<br />
              <span className="italic font-normal text-[#AF8943]">立足台灣，走向世界</span>
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              你有好服務、好產品，想加入百夫長品牌？請在此遞交品牌授權與審核提案。我們將在兩個工作天內由集團品牌鏈顧問 連仲賢親自對接。
            </p>
            <div className="p-6 bg-[#FAF8F5] border border-[#EFECE6] space-y-3">
              <h4 className="text-sm font-serif font-bold text-stone-900">品牌鏈顧問與品質審核：</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed font-light">
                百夫長絕不對品質妥協。所有參與「品牌鏈計畫」的產品，必須經過百夫長品牌鏈首席顧問連仲賢先生與品管工程師的壓力、老化、環保與耐用度多重檢測。通過審核者，方可正式冠以百夫長品牌商標，立足台灣，共同進軍東南亞、日本及北美高階市場。
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-[#EFECE6] space-y-4">
              <div className="text-2xl text-[#AF8943] font-mono">01</div>
              <h3 className="text-base font-serif font-bold text-stone-900">品牌高奢化，徹底告別價格戰</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                傳統代工與普通品牌只能打價格戰。透過掛牌百夫長（CENTURION）商標，賦予產品品牌故事與名牌地位，產品單價即刻躍升。
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EFECE6] space-y-4">
              <div className="text-2xl text-[#AF8943] font-mono">02</div>
              <h3 className="text-base font-serif font-bold text-stone-900">無縫對接全球頂級聯名 IP</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                你的貼牌產品將有資格對接百夫長長期持有的迪士尼、京都 SOU‧SOU、故宮、幾米等一線 IP，開發高回報的限量珍藏款。
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EFECE6] space-y-4">
              <div className="text-2xl text-[#AF8943] font-mono">03</div>
              <h3 className="text-base font-serif font-bold text-stone-900">全面解鎖全球主流分銷通路</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                百夫長擁有與 7-ELEVEN、全聯福利中心、蝦皮商城等跨國與大型通路的集點和上架合作通路。你只需提供品質極致的生產，通路我們來打通。
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EFECE6] space-y-4">
              <div className="text-2xl text-[#AF8943] font-mono">04</div>
              <h3 className="text-base font-serif font-bold text-stone-900">高溢價，利潤共享共榮</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                「你負責追求品質極致，百夫長負責賦予產品品牌靈魂。」雙方以品牌鏈高度進行商業分潤合作，攜手共創長線、健康的第二增長曲線。
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
            <h2 className="text-4xl font-serif text-stone-900 font-light">首頁精選典藏</h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
              此處為後台管理員自主挑選與精選（is_featured）之 5~10 品頂規認證產品，代表集團對品質的最高背書。
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
              進入獨立會館 檢視完整高奢品線 ➔
            </Link>
          </div>

        </div>
      </section>

      {/* 第五單元：品牌核心 DNA */}
      <section id="dna" className="py-24 lg:py-32 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">THE BRAND ESSENCE</span>
          <h2 className="text-4xl font-serif text-stone-900 font-light">世紀箱包的卓越基因</h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">百夫長秉持奢侈品牌的嚴苛標準，將設計專利、永續理念與功能細節完美融為一體。</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 border border-[#EFECE6] space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-[#AF8943]/5 rounded-none flex items-center justify-center text-[#AF8943]">
              <Sparkles size={22} />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">輕資產營運巔峰</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              比照 Apple 與 Nike 營運模式，「本身不是工廠，而且沒有工廠。」專注於美學研發與品牌跨界，成功打破重型製造業對創意的禁錮。
            </p>
          </div>

          <div className="bg-white p-8 border border-[#EFECE6] space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-[#AF8943]/5 rounded-none flex items-center justify-center text-[#AF8943]">
              <Globe size={22} />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">全球美學發行體系</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              我們將旅行箱視為「移動的藝術畫幅」。如同郵局有系統地發行郵票，定期發表涵蓋當代歷史、自然科學等主題的美學設計款。
            </p>
          </div>

          <div className="bg-white p-8 border border-[#EFECE6] space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-[#AF8943]/5 rounded-none flex items-center justify-center text-[#AF8943]">
              <Scale size={22} />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">不分尺寸均一價</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              打破傳統「大箱必貴、小箱便宜」的銷售慣例，實行「不分尺寸均一價」政策，大幅簡化尊榮顧客的決策成本，實現渠道利潤共榮。
            </p>
          </div>

          <div className="bg-white p-8 border border-[#EFECE6] space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-[#AF8943]/5 rounded-none flex items-center justify-center text-[#AF8943]">
              <Award size={22} />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">「胖胖箱」全球命名者</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              2015年由創辦人陳志彬親自發明並定義「胖胖箱」詞語，改寫了華人世界對深度 5:5 比例箱體的形式稱呼，引領全球箱包設計。
            </p>
          </div>
        </div>

        {/* 技術品質與常識檢定 */}
        <div className="mt-16 grid md:grid-cols-2 gap-10">
          <div className="bg-[#FAF8F5] p-10 border border-[#EFECE6] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[#AF8943] font-mono text-xs font-bold tracking-widest uppercase">QUALITY COMPLIANCE 01</span>
              <h4 className="text-xl font-serif text-stone-900">為什麼 CENTURION 絕不銷售「擴充拉鏈」箱？</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                托運行李極易因撞擊產生巨大外力。為保護長途航空托運安全、降低超重對地勤人員造成的職業勞損傷害，百夫長始終堅守無拉鏈擴充一體化結構，追求高安全性的結構完整度。
              </p>
            </div>
            <div className="pt-8 text-[#AF8943] text-[10px] font-mono tracking-widest">STRUCTURE COMPLIANCE</div>
          </div>

          <div className="bg-[#FAF8F5] p-10 border border-[#EFECE6] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[#AF8943] font-mono text-xs font-bold tracking-widest uppercase">QUALITY COMPLIANCE 02</span>
              <h4 className="text-xl font-serif text-stone-900">為什麼 CENTURION 絕不銷售「純鋁製」旅行箱？</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                純鋁箱體抗震性較弱，在托運撞擊下極易發生不可逆的嚴重金屬凹陷或卡死。我們堅持採用高衝擊強度、高回彈韌性的 PC/ABS 複合材質。
              </p>
            </div>
            <div className="pt-8 text-[#AF8943] text-[10px] font-mono tracking-widest">MATERIAL PERFORMANCE</div>
          </div>
        </div>
      </section>

      {/* 第六單元：永續承諾與自然保育 */}
      <section id="esg" className="bg-[#F7F4EE] py-24 lg:py-32 border-t border-b border-[#EFECE6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">HUMANITY & ECOLOGY</span>
            <h2 className="text-4xl font-serif text-stone-900 font-light">物種與人文保育承諾</h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">奢華的核心，在於對生命與社會的溫暖關懷。百夫長將人文高度融入每一次的旅程。</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
              <div className="w-12 h-12 bg-emerald-500/5 rounded-none flex items-center justify-center text-emerald-700">
                <Leaf size={22} />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">IUCN 紅色名單瀕危物種合作</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                百夫長長期關注地球棲息地危機。我們依照「國際自然保護聯盟 (IUCN)」名單，發行包含美洲獅、孟加拉虎、綠蠵龜、台灣黑熊、大熊貓等濒危主題旅行箱。每次出行，都是喚醒物種保育的優雅宣導。
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
              <div className="w-12 h-12 bg-blue-500/5 rounded-none flex items-center justify-center text-blue-700">
                <Droplets size={22} />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">氣候暖化與 Can use but save</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                「我們面臨暖化危機，不能僅消極逃避，更應採取積極綠色行為。」設計融合環境保護概念（Save Water, Save Earth 等主題），倡導減碳旅程與資源再利用。
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
              <div className="w-12 h-12 bg-[#AF8943]/5 rounded-none flex items-center justify-center text-[#AF8943]">
                <TreePine size={22} />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">森林保育「森、林、少、空」</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                百夫長發表專屬木紋質感箱體，探討森林資源過度消耗警訊。創辦人相信：「唯有在幼年期，就將環境保育理念深植於社會未來的領導階層，我們才能為後代留下更好的地球。」
              </p>
            </div>
          </div>

          {/* 人文深度 CSR 故事 */}
          <div className="mt-16 bg-white p-10 border border-[#EFECE6] grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 text-[#AF8943] text-xs font-semibold tracking-widest uppercase">
                <HeartHandshake size={14} />
                <span>CSR HUMANITY STORIES</span>
              </div>
              <h3 className="text-2xl font-serif text-stone-900 font-light">家與傳承的重量：遠行的畫作</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                "曾有一位知名企業家，長年培育女兒在藝術領域創作。在女兒獲國外頂尖學府錄取遠行之際，他委託百夫長，將女兒手繪畫作高解析客製印刷於行李箱體，作為公司創立 30 周年的特製貴賓禮贈。這只旅行箱，不僅裝載著父親對女兒遠行深造的溫暖祝福，更承載了一個企業對夥伴最誠懇的情誼傳承。"
              </p>
            </div>
            <div className="lg:col-span-5 bg-[#FAF8F5] p-8 border border-[#EFECE6] space-y-4">
              <div className="flex items-center space-x-2 text-[#AF8943]">
                <GraduationCap size={18} />
                <span className="text-xs font-bold tracking-widest uppercase">學術與社會支持</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                我們長期贊助並支持國立台灣體育運動大學、清華大學、輔仁大學、中國文化大學、宜蘭體育會等機構的青年發展。並數度榮幸伴隨中華職棒代表團與國家代表隊征戰國際，成爲選手優雅前進的強大防護後盾。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 第七單元：百夫長新知與媒體觀點 */}
      <section id="insights" className="py-24 lg:py-32 max-w-7xl mx-auto px-6 border-b border-[#EFECE6]">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">CENTURION INSIGHTS</span>
          <h2 className="text-4xl font-serif text-stone-900 font-light">百夫長新知與媒體觀點</h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
            匯聚當代主流財經媒體、電視专题報導與綠色旅程的前沿探討，深入剖析陳志彬先生的跨界美學哲思。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* 新知 1 */}
          <div className="bg-white border border-[#EFECE6] flex flex-col justify-between p-8 transition-all duration-300 hover:shadow-md group">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-widest">
                <span className="flex items-center space-x-1">
                  <FileText size={12} className="text-[#AF8943]" />
                  <span>主流財經專訪</span>
                </span>
                <span>2022.08</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 leading-snug group-hover:text-[#AF8943] transition-colors">
                「以箱為郵票，發行地球美學」— 專訪創辦人陳志彬的品牌無邊界戰略
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                詳細報導陳志彬先生如何運用 Apple 與 Nike 模式的「輕資產營運思維」，將全部精神凝聚於專利美學研發與 IUCN 物種保育的跨界融合，顛覆百年箱包產業。
              </p>
            </div>
            <a 
              href="https://money.udn.com/money/story/5612/8929993" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-bold tracking-widest pt-6 border-t border-[#F5F2EB] mt-8"
            >
              <span>閱讀完整報導</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* 新知 2 */}
          <div className="bg-white border border-[#EFECE6] flex flex-col justify-between p-8 transition-all duration-300 hover:shadow-md group">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-widest">
                <span className="flex items-center space-x-1">
                  <Video size={12} className="text-[#AF8943]" />
                  <span>電視媒體影音</span>
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
                一只裝載溫暖的「胖胖箱」：探索 CENTURION 席捲大眾行旅美學的幕後祕辛
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                深度影音专题報導。詳細解構百夫長如何開創「胖胖箱」 5:5 深度美學比例，並探討「不分尺寸均一價」如何從根本上免除消費者在旅行前夕的繁瑣計較，重新喚起行旅的幸福初衷。
              </p>
            </div>
            <a 
              href="https://www.centurionbuy.com/blog/categories/%E5%AA%92%E9%AB%94%E5%A0%B1%E5%B0%8E" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-bold tracking-widest pt-6 border-t border-[#F5F2EB] mt-8"
            >
              <span>觀看專題影片</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* 新知 3 */}
          <div className="bg-white border border-[#EFECE6] flex flex-col justify-between p-8 transition-all duration-300 hover:shadow-md group">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-widest">
                <span className="flex items-center space-x-1">
                  <FileText size={12} className="text-[#AF8943]" />
                  <span>綠色永續論壇</span>
                </span>
                <span>2023.04</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 leading-snug group-hover:text-[#AF8943] transition-colors">
                「每一次旅程，都是對綠色地球的致敬」— CENTURION 瀕危保育系列引爆綠色行旅迴響
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                探討百夫長秉持的「Can use but save」之自然永續精神。報導詳細列舉其「森、林、少、空」木紋警示概念箱體，以及攜手國際物種保育組織的驚艷設計，如何啟迪新一代消費者對森林資源與漸逝生態的熱忱守護。
              </p>
            </div>
            <a 
              href="https://www.centuriontravel.tw/centurion" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-bold tracking-widest pt-6 border-t border-[#F5F2EB] mt-8"
            >
              <span>閱讀永續專題</span>
              <ExternalLink size={12} />
            </a>
          </div>

        </div>
      </section>

      {/* 全新第八單元：百夫長 PRESS (CENTURION PRESS) */}
      <section id="press" className="py-24 lg:py-32 max-w-7xl mx-auto px-6 border-b border-[#EFECE6]">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* 左欄：介紹 */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="inline-flex items-center space-x-3 text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">
              <BookOpen size={16} />
              <span>CENTURION PRESS</span>
            </div>
            <h2 className="text-4xl font-serif text-stone-900 font-light leading-tight">
              品牌影響力與<br />
              <span className="italic font-normal">社會公眾實踐</span>
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              系統性整理百夫長（CENTURION）品牌生態圈、智財博弈、國際自駕觀光推廣與創辦人陳志彬先生之非典型參選政見、學術講座文獻，展現堅實的社會影響力與法理深度。
            </p>
            <div className="pt-6 border-t border-[#EFECE6] text-[10px] font-mono text-[#AF8943] tracking-widest">
              PUBLIC DOCUMENT ARCHIVE
            </div>
          </div>

          {/* 右欄：30 筆文獻可折疊式年報清單 */}
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
                      <a 
                        href={p.news_url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-bold tracking-widest"
                      >
                        <span>檢視外部文獻</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 展開更多提示 */}
            <div className="pt-4 text-center">
              <span className="text-[11px] text-stone-400 italic font-light">
                已載入最新 10 筆核心文獻。更多完整 30 筆商務及法律公報文獻已同步於 Supabase 中端隔離運行。
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 第九單元：法式聯名榮譽牆 */}
      <section id="wall" className="py-24 lg:py-32 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">WALL OF FAME</span>
          <h2 className="text-4xl font-serif text-stone-900 font-light">聯名榮譽牆</h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
            融匯時尚雜誌、跨國民生與文化機構的跨界品味，百夫長深獲全球菁英合作夥伴的高度信賴。
          </p>
        </div>

        {/* 快篩按鈕組 */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {[
            { label: '全部合作', value: 'all' },
            { label: '藝人 / IP 聯名', value: 'artist-ip' },
            { label: '媒體 / 雜誌', value: 'media' },
            { label: '民生與零售通路', value: 'brand-retail' },
            { label: '文化 / 藝術', value: 'culture' }
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
            <p className="text-xs text-stone-400 tracking-widest">正在載入合作典藏紀錄...</p>
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
                  <h4 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#AF8943] transition-colors">
                    {item.brand}
                  </h4>
                  {item.founder && (
                    <p className="text-[11px] text-stone-500 italic">主導/創辦人：{item.founder}</p>
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

      {/* 第十單元：CMS 媒體文獻高奢上架與下架管理後台 */}
      <section id="cms-admin" className="bg-[#FAF8F5] py-20 border-t border-[#EFECE6]">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          {/* 安全驗證標題 */}
          <div className="text-center space-y-4">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase inline-flex items-center space-x-2">
              {adminUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
              <span>CENTURION CMS｜品牌文獻管理系統</span>
            </span>
            <p className="text-stone-500 text-xs font-light max-w-md mx-auto">
              此為百夫長集團內部行政管理後台。請輸入安全授權碼以解鎖動態文章上架、刪除與資料庫即時維護權限。
            </p>
          </div>

          {!adminUnlocked ? (
            /* 未解鎖：密碼輸入框 */
            <form onSubmit={handleUnlockCms} className="max-w-sm mx-auto bg-white p-8 border border-[#EFECE6] space-y-6 text-center">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-widest">安全解鎖驗證碼</label>
                <input 
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] text-center rounded-none py-3 text-stone-900 focus:outline-none focus:border-[#AF8943] text-sm tracking-widest transition-colors font-mono"
                  placeholder="ENTER PASSCODE"
                />
              </div>
              {passcodeError && (
                <p className="text-xs text-rose-600 font-medium">❌ 授權驗證碼不正確，請重新輸入。</p>
              )}
              <button 
                type="submit"
                className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold py-3 px-8 text-xs tracking-widest uppercase transition-colors w-full rounded-none"
              >
                驗證安全憑證
              </button>
            </form>
          ) : (
            /* 已解鎖：動態 CMS 管理界面 */
            <div className="space-y-12 animate-fadeIn">
              
              {/* 1. 新增報導表單 */}
              <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
                <div className="flex items-center space-x-2 text-[#AF8943] pb-3 border-b border-[#F5F2EB]">
                  <Plus size={18} />
                  <span className="text-xs font-bold tracking-widest uppercase">發佈全新媒體報導文獻</span>
                </div>

                <form onSubmit={handleAddPress} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">媒體標題與報導類型</label>
                      <input 
                        type="text"
                        required
                        value={newPress.title}
                        onChange={(e) => setNewPress({ ...newPress, title: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs transition-colors"
                        placeholder="例：經濟日報專訪：陳志彬品牌觀"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">外部新聞原始連結 (URL)</label>
                      <input 
                        type="url"
                        value={newPress.news_url}
                        onChange={(e) => setNewPress({ ...newPress, news_url: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">報導重點摘要 (100 字內)</label>
                    <textarea 
                      rows={3}
                      required
                      value={newPress.summary}
                      onChange={(e) => setNewPress({ ...newPress, summary: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs transition-colors"
                      placeholder="請輸入此報導的精簡重點與核心觀點闡述..."
                    />
                  </div>

                  {cmsSubmitStatus === 'success' && (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                      <CheckCircle size={14} />
                      <span>✨ 文獻發佈成功！已動態寫入 Supabase 資料表，前端已即時更新。</span>
                    </p>
                  )}

                  <div className="text-right">
                    <button 
                      type="submit"
                      disabled={cmsSubmitStatus === 'submitting'}
                      className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold py-3.5 px-8 text-xs tracking-widest uppercase transition-colors rounded-none inline-flex items-center space-x-2"
                    >
                      {cmsSubmitStatus === 'submitting' ? (
                        <>
                          <Loader2 className="animate-spin" size={12} />
                          <span>寫入資料庫中...</span>
                        </>
                      ) : (
                        <span>發佈至資料庫</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. 現有文獻清單與即時下架 */}
              <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
                <div className="flex items-center space-x-2 text-[#AF8943] pb-3 border-b border-[#F5F2EB]">
                  <Database size={18} />
                  <span className="text-xs font-bold tracking-widest uppercase">現存文獻列表與即時下架 (實時資料庫)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#EFECE6] text-stone-400 font-mono tracking-widest">
                        <th className="py-3 font-semibold">ID</th>
                        <th className="py-3 font-semibold">標題</th>
                        <th className="py-3 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pressItems.map((p) => (
                        <tr key={p.id} className="border-b border-[#FAF8F5] hover:bg-[#FAF8F5]/40 transition-colors">
                          <td className="py-4 font-mono text-[#AF8943]">#{p.id.toString().padStart(3, '0')}</td>
                          <td className="py-4 font-serif font-bold text-stone-900">{p.title}</td>
                          <td className="py-4 text-center">
                            <button 
                              onClick={() => handleDeletePress(p.id)}
                              className="text-stone-400 hover:text-rose-600 p-2 transition-colors"
                              title="永久從資料庫刪除並下架"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 第十一單元：B2B 合作意向資料收集門戶 (專屬「加入百夫長品牌鏈」 招募漏斗) */}
      <section id="b2b-form" className="bg-[#FAF8F5] py-24 lg:py-32 border-t border-[#EFECE6]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">PARTNERSHIP ENQUIRY</span>
            <h2 className="text-4xl font-serif text-stone-900 font-light">開啟【加入百夫長品牌鏈】提案</h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
              你有好服務、好產品，想加入百夫長品牌？請在此遞交品牌授權與審核提案。我們將在兩個工作天內由集團品牌鏈顧問 連仲賢親自對接。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-10 border border-[#EFECE6] shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">公司 / 組織名稱</label>
                <input 
                  type="text" 
                  required 
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors"
                  placeholder="請輸入公司完整法人名稱"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">聯絡人姓名與職稱</label>
                <input 
                  type="text" 
                  required 
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors"
                  placeholder="例：王經理 / 品牌總監"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">聯絡電話</label>
                <input 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors"
                  placeholder="請輸入直撥聯絡號碼"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">電子郵件信箱</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors"
                  placeholder="例：direct@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">預計合作領域</label>
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
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">預計合作時程</label>
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
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">產品技術優勢與專利構想簡述</label>
              <textarea 
                rows={5} 
                required 
                value={formData.proposal_summary}
                onChange={(e) => setFormData({ ...formData, proposal_summary: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors" 
                placeholder="請描述您目前擁有的優質產品、技術、專利，或您期望掛上百夫長品牌進行市場溢價的商業計畫..."
              />
            </div>

            {submitStatus === 'success' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-none flex items-center space-x-3">
                <CheckCircle className="text-emerald-600" size={18} />
                <span className="font-medium">您的提案已順利遞交。商務部資深主管將於兩個工作天內親自致電與您對話。</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-none">
                系統暫時連線異常，提案未能成功發送。請檢查網路狀態或重整頁面後再次嘗試。
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
                    <span>傳送中...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>送出戰略合作提案</span>
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
