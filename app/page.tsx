'use client';

import React, { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';

export default function CenturionPortal() {
  // 控制行動裝置導覽列開關
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // 聯名牆狀態
  const [items, setItems] = useState<WallOfFameItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loadingItems, setLoadingItems] = useState<boolean>(true);

  // 表單提交狀態
  const [formData, setFormData] = useState<PartnershipLeadInput>({
    company_name: '',
    contact_name: '',
    phone: '',
    email: '',
    business_area: '百夫長旅行箱 (大宗採購/IP聯名)',
    timeframe: '立即開始 (1個月內)',
    proposal_summary: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // 取得聯名牆動態資料
  useEffect(() => {
    async function fetchWallData() {
      try {
        setLoadingItems(true);
        const { data, error } = await supabaseCenturion
          .from('centurion_wall_of_fame')
          .select('*')
          .eq('is_active', true)
          .order('year', { ascending: false });

        if (error) {
          console.warn('嘗試讀取 public.centurion_wall_of_fame 失敗，降級載入預設本地資料。錯誤訊息:', error.message);
          throw error;
        }
        
        const safeData = (data as any) as WallOfFameItem[];
        setItems(safeData || []);
      } catch (err) {
        // 載入 100% 語法安全的高精度聯名牆資料備份
        const mockData: WallOfFameItem[] = [
          { id: '1', year: '2018', brand: 'STAGE (小豬 羅志祥)', founder: '羅志祥', category: 'artist-ip', type: '藝人潮流品牌', description: '潮流時尚與旅行箱的跨界碰撞，引領街頭行旅風潮。' },
          { id: '2', year: '2019', brand: 'DEBRAND (陳冠希)', founder: '陳冠希', category: 'artist-ip', type: '潮流設計師聯名', description: '以華人文字與街頭文化為核心，探索旅行箱的叛逆美學。' },
          { id: '3', year: '2019', brand: 'Andox & Box', founder: '劉德華活動合作', category: 'artist-ip', type: '角色 IP', description: '劉德華設計的經典牛公仔，注入可愛與玩味的潮流旅行體驗。' },
          { id: '4', year: '2021', brand: '九澤 CP (陳零九 / 邱鋒澤)', founder: '五堅情主導', category: 'artist-ip', type: '新生代偶像', description: '結合音樂與年輕世代的社群影響力，打造限量聯動企劃。' },
          { id: '5', year: '2020', brand: 'KAKAO FRIENDS', founder: null, category: 'artist-ip', type: '角色 IP', description: '韓系經典人氣角色官方授權，將超萌暖意帶入旅途。' },
          { id: '6', year: '2020', brand: 'LINE FRIENDS', founder: null, category: 'artist-ip', type: '角色 IP', description: '全球知名通訊角色官方聯名，創造療癒滿分的出行伴侶。' },
          { id: '7', year: '2021', brand: 'Disney 迪士尼', founder: null, category: 'artist-ip', type: '夢幻經典 IP', description: '全球夢幻迪士尼角色系列聯名，重現童話般的行旅記憶。' },
          { id: '8', year: '2016', brand: '天氣女孩 (Weather Girls)', founder: '女子偶像團體', category: 'artist-ip', type: '女子偶像團體', description: '聯名合作案例第 Q14WW 號，展現專屬設計與限量美學。' },
          { id: '9', year: '2019', brand: 'Vogue 時尚雜誌', founder: null, category: 'media', type: '時尚權威', description: '與時尚指標 Vogue 深度合作，以跨界收納備品包演繹頂級行旅品味。' },
          { id: '10', year: '2020', brand: 'GQ 雜誌', founder: null, category: 'media', type: '紳士風尚', description: '專為菁英男士打造的商務旅行箱企劃，體現沉穩洗鍊的極致紳士感。' },
          { id: '11', year: '2020', brand: 'ELLE 雜誌', founder: null, category: 'media', type: '優雅法式', description: '優雅且具質感的法式旅行風格，完美演繹現代都會女性的自在風采。' },
          { id: '12', year: '2021', brand: 'Bella 儂儂', founder: null, category: 'media', type: '都會美學', description: '專注都會女性的旅行美學與生活質感探索，傳遞時尚生活主張。' },
          { id: '13', year: '2021', brand: '7-ELEVEN', founder: null, category: 'brand-retail', type: '民生通路', description: '全國性大型集點兌換合作，將百夫長精緻箱體走入萬千家庭。' },
          { id: '14', year: '2022', brand: '全聯福利中心', founder: null, category: 'brand-retail', type: '大型零售', description: '民生超市龍頭年度集點企劃，展現品牌貼近生活的日常高度。' },
          { id: '15', year: '2020', brand: '台灣啤酒', founder: null, category: 'brand-retail', type: '國民品牌', description: '台灣在地經典品牌跨界，揉合本土在地趣味與摩登旅行風貌。' },
          { id: '16', year: '2017', brand: '中華航空 & 華信航空', founder: '航空巨擘授權', category: 'brand-retail', type: '航空巨擘', description: '華航機組員熱情愛用，推出聯名機上備品過夜包，彰顯商務飛行質感。' },
          { id: '17', year: '2018', brand: 'UNIQLO 優衣庫', founder: null, category: 'brand-retail', type: '跨國服飾', description: '跨國服飾品牌包裝與活動聯名，結合機能性與極簡生活美學。' },
          { id: '18', year: '2020', brand: '誠品 eslite', founder: null, category: 'culture', type: '文化地標', description: '文化通路 × 旅行的跨界對話，勾勒出極具人文氣息的行旅想像。' },
          { id: '19', year: '2021', brand: 'SOU‧SOU (京都)', founder: null, category: 'culture', type: '京都傳統印花', description: '京都百年和風美學 × 現代旅行箱體的交融，刻畫細緻優雅的東方印記。' },
          { id: '20', year: '2019', brand: '故宮博物院', founder: null, category: 'culture', type: '國家級博物館', description: '將典藏文物之美與古典墨寶融入現代行李箱，讓東方文化隨行世界。' },
          { id: '21', year: '2020', brand: '幾米 (Jimmy)', founder: null, category: 'culture', type: '繪本藝術家', description: '將療癒人心的幾米繪本世界帶入行李箱面，溫暖每一段孤獨旅程。' },
          { id: '22', year: '2017', brand: '老夫子 (Old Master Q)', founder: '經典漫畫 IP', category: 'culture', type: '經典漫畫 IP', description: '華人世界最具代表性的漫畫 IP，結合懷舊與幽默生活的聯名紀念款。' },
          { id: '23', year: '2018', brand: '寶島一村', founder: '經典舞台劇', category: 'culture', type: '經典舞台劇', description: '結合眷村文化與舞台劇美學的經典限量款行李箱，訴說光陰的故事。' },
          { id: '24', year: '2016', brand: '搞笑者們 3.0', founder: '舞台藝術劇團', category: 'culture', type: '舞台藝術', description: '支持在地原創劇團與青年藝術工作者，跨界舞台喜劇的活力合作。' }
        ];
        setItems(mockData);
      } finally {
        setLoadingItems(false);
      }
    }
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
      setSubmitStatus('success');
      setFormData({
        company_name: '',
        contact_name: '',
        phone: '',
        email: '',
        business_area: '百夫長旅行箱 (大宗採購/IP聯名)',
        timeframe: '立即開始 (1個月內)',
        proposal_summary: ''
      });
    } catch (err) {
      console.error('Failed to submit B2B lead:', err);
      setSubmitStatus('error');
    }
  };

  // 篩選過濾
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-[#AF8943] selection:text-white">
      
      {/* 導覽列 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/90 border-b border-[#EFECE6] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo 置換為使用者指定之高奢圖片 */}
          <div className="flex items-center space-x-3">
            <img 
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_100/1886487/831598_863023.png" 
              alt="CENTURION" 
              className="h-10 w-auto object-contain"
            />
            <span className="text-[9px] bg-[#AF8943]/10 text-[#AF8943] px-2.5 py-0.5 rounded-full font-mono font-semibold tracking-widest">PORTAL</span>
          </div>
          
          {/* 桌面端選單 */}
          <div className="hidden md:flex space-x-8 text-xs tracking-[0.15em] uppercase text-stone-500 font-medium">
            <a href="#vision" className="hover:text-[#AF8943] transition-colors">創辦理念</a>
            <a href="#pillars" className="hover:text-[#AF8943] transition-colors">五大版圖</a>
            <a href="#dna" className="hover:text-[#AF8943] transition-colors">核心基因</a>
            <a href="#esg" className="hover:text-[#AF8943] transition-colors">永續人文</a>
            <a href="#insights" className="hover:text-[#AF8943] transition-colors">百夫長新知</a>
            <a href="#wall" className="hover:text-[#AF8943] transition-colors">聯名牆</a>
          </div>

          <div className="hidden md:block">
            <a 
              href="#b2b-form" 
              className="bg-[#AF8943] hover:bg-[#93702F] text-white font-semibold px-6 py-3 rounded-none text-xs tracking-[0.2em] transition-colors"
            >
              合作提案
            </a>
          </div>

          {/* 行動端選單按鈕 */}
          <button 
            className="md:hidden text-stone-600 hover:text-stone-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 行動端下拉選單 */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-[#EFECE6] px-6 py-8 flex flex-col space-y-4 text-sm">
            <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">創辦理念</a>
            <a href="#pillars" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">五大版圖</a>
            <a href="#dna" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">核心基因</a>
            <a href="#esg" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">永續人文</a>
            <a href="#insights" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">百夫長新知</a>
            <a href="#wall" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 hover:text-[#AF8943] py-1 transition-colors tracking-widest">聯名牆</a>
            <a href="#b2b-form" onClick={() => setMobileMenuOpen(false)} className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold text-center py-4 rounded-none text-xs tracking-widest transition-colors">合作提案</a>
          </div>
        )}
      </nav>

      {/* 第一單元：高奢首頁視覺 (Hero Section) */}
      <section id="vision" className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 space-y-10">
          <div className="inline-flex items-center space-x-3 text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">
            <span className="w-12 h-[1px] bg-[#AF8943]"></span>
            <span>HERITAGE & EXPLORATION</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-serif text-stone-900 leading-[1.15] font-light">
            以「家」為名<br />
            <span className="font-normal italic">以「旅」為道</span>
          </h1>
          <p className="text-stone-600 text-base lg:text-lg leading-relaxed max-w-2xl font-light">
            從一只旅行箱出發，百夫長（CENTURION）逐步建構起橫跨旅遊、生活選物、頂級禮贈的跨界生態。我們將「家」的歸屬感，注入複合品牌產品，演繹法式美學對非凡生活的不懈追求。
          </p>
          <div className="flex flex-wrap gap-5 pt-4">
            <a href="#b2b-form" className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold px-8 py-4 rounded-none text-xs tracking-[0.2em] transition-all duration-300">
              B2B 合作洽談
            </a>
            <a href="https://example-distributor.com" target="_blank" rel="noopener noreferrer" className="border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold px-8 py-4 rounded-none text-xs tracking-[0.15em] transition-all duration-300">
              探索官方旗艦商城
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-10 rounded-none border border-[#EFECE6] shadow-sm space-y-8">
          <p className="text-xl italic font-serif text-stone-800 leading-relaxed font-light">
            「一只旅行箱，承載的不只是衣物，而是一整個家的重量與溫度。我們打造的，是陪伴每一段生命旅程的優雅歸屬。」
          </p>
          <div className="border-t border-[#EFECE6] pt-6">
            <h4 className="text-lg font-serif font-bold text-stone-900 tracking-wider">陳志彬</h4>
            <p className="text-xs text-[#AF8943] uppercase tracking-widest mt-1">FOUNDER OF CENTURION GROUP</p>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed font-light">
            陳志彬先生將「溫暖、品質、創新」的核心哲理注入百夫長，打破旅行箱僅是硬質塑料容器的通俗想像，將其昇華為個人旅行的移動博物館，奠定其高奢品牌底蘊。
          </p>
        </div>
      </section>

      {/* 第二單元：五大事業版圖 (The Five Pillars) */}
      <section id="pillars" className="bg-[#F7F4EE] py-24 lg:py-32 border-t border-b border-[#EFECE6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">THE FIVE PILLARS</span>
            <h2 className="text-4xl font-serif text-stone-900 font-light">五大事業版圖</h2>
            <p className="text-stone-500 text-sm max-w-2xl mx-auto font-light">以「旅行美學」為發端，百夫長集團整合五大商業主軸，全面覆蓋頂級生活面向。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🧳</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">百夫長旅行箱</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  移動的防禦城堡。擁有數百款獨家專利美學印花與結構，採用符合人體工學的雙輪配置與軍規防護構造，融合藝術美學與極致抗震功能。
                </p>
              </div>
              <a href="https://example-distributor.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>EXPLORE LUGGAGE</span>
                <span>→</span>
              </a>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">✈️</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">百夫長旅行社</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  靈魂的深度洗禮。避開庸俗行程，專注於小眾人文、奢華旅宿與藝術策展主題。讓每一次出發，都是自我探索的極致體驗。
                </p>
              </div>
              <a href="https://example-travel.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>VIEW JOURNEYS</span>
                <span>→</span>
              </a>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🍷</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">百夫長貴賓空間</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  頂奢隱密交際沙龍。為品牌高端會員開闢的專屬接待場所，定期舉辦當代藝術沙龍與珍稀名酒美食品鑑。
                </p>
              </div>
              <span className="text-[10px] text-stone-400 font-bold tracking-widest uppercase pt-8 border-t border-[#F5F2EB] mt-8 block">
                INVITATION ONLY
              </span>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🥩</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">生鮮選物 (百選)</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  極致食材獵手。由頂級主廚團隊全球親赴產地，嚴選特級和牛、極地海鮮等，獻給對味覺細節絕不妥協的菁英階層。
                </p>
              </div>
              <a href="https://example-food.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>GOURMET SHOP</span>
                <span>→</span>
              </a>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white p-8 rounded-none border border-[#EFECE6] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
              <div className="space-y-6">
                <div className="text-4xl text-[#AF8943]">🎁</div>
                <h3 className="text-lg font-serif font-bold text-stone-900">禮贈精品 (百禮)</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  頂級禮贈定制。針對高端跨國企業、精品拍賣會設計，提供 20 吋 / 26 吋 / 29 吋及多尺寸品牌特調禮包客製化服務。
                </p>
              </div>
              <a href="#b2b-form" className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-2 font-bold tracking-widest pt-8 border-t border-[#F5F2EB] mt-8">
                <span>INQUIRE BULK</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 第三單元：品牌核心 DNA 與專利技術 (Brand DNA) */}
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
              2015年由創辦人陳志彬親自發明並定義「胖胖箱」詞語，改寫了華人世界對深度 5:5 比例箱體的通俗稱呼，引領全球箱包設計。
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
                純鋁箱體抗震性差，在強烈托運撞擊下極易發生不可逆的嚴重金屬變形，導致行李於旅途中無法順利閉合或損毀。我們堅持採用高衝擊強度、高回彈韌性的 PC/ABS 複合材質。
              </p>
            </div>
            <div className="pt-8 text-[#AF8943] text-[10px] font-mono tracking-widest">MATERIAL PERFORMANCE</div>
          </div>
        </div>
      </section>

      {/* 第四單元：永續承諾與自然保育 */}
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
                我們長期贊助並支持國立台灣體育運動大學、清華大學、輔仁大學、中國文化大學、宜蘭體育會等機構的青年發展。並數度榮幸伴隨中華職棒代表團與國家代表隊征戰國際，成為選手優雅前進的強大防護後盾。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 全新第五單元：百夫長新知與媒體觀點 (CENTURION Insights & Media) */}
      <section id="insights" className="py-24 lg:py-32 max-w-7xl mx-auto px-6 border-b border-[#EFECE6]">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">CENTURION INSIGHTS</span>
          <h2 className="text-4xl font-serif text-stone-900 font-light">百夫長新知與媒體觀點</h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
            匯聚當代主流財經媒體、電視专题報導與綠色旅程的前沿探討，深入剖析陳志彬先生的跨界美學哲思。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* 新知 1: 創辦人專訪報導 */}
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
                詳細報導陳志彬先生如何運用 Apple 與 Nike 模式的「輕資產營運思維」，拒絕重資產束縛，將全部精神凝聚於專利美學研發與 IUCN 物種保育的跨界融合，顛覆百年箱包產業。
              </p>
            </div>
            <a 
              href="https://example-news-interview.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-bold tracking-widest pt-6 border-t border-[#F5F2EB] mt-8"
            >
              <span>閱讀完整報導</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* 新知 2: 影音專題 (帶播放視覺) */}
          <div className="bg-white border border-[#EFECE6] flex flex-col justify-between p-8 transition-all duration-300 hover:shadow-md group">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-widest">
                <span className="flex items-center space-x-1">
                  <Video size={12} className="text-[#AF8943]" />
                  <span>電視媒體影音</span>
                </span>
                <span>VIDEO SPOTLIGHT</span>
              </div>
              
              {/* 高奢影音播放示意圖卡 */}
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
                深度影音专题報導。詳細解構百夫長如何開創「胖胖箱」5:5 深度美學比例，並探討「不分尺寸均一價」如何從根本上免除消費者在旅行前夕的繁瑣計較，重新喚起行旅的幸福初衷。
              </p>
            </div>
            <a 
              href="https://example-youtube-video.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-bold tracking-widest pt-6 border-t border-[#F5F2EB] mt-8"
            >
              <span>觀看專題影片</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* 新知 3: 保育永續新聞 */}
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
              href="https://example-esg-news.com" 
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

      {/* 第六單元：法式聯名榮譽牆 */}
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

      {/* 第七單元：B2B 合作意向資料收集門戶 */}
      <section id="b2b-form" className="bg-[#FAF8F5] py-24 lg:py-32 border-t border-[#EFECE6]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase">PARTNERSHIP ENQUIRY</span>
            <h2 className="text-4xl font-serif text-stone-900 font-light">開啟您的百夫長合作之門</h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
              歡迎品牌聯名、跨國採購與通路合作。請填寫下方意向表格，商務團隊將在兩個工作天內安排資深總監與您親自聯繫。
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
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">合作提案與計畫簡述</label>
              <textarea 
                rows={5} 
                required 
                value={formData.proposal_summary}
                onChange={(e) => setFormData({ ...formData, proposal_summary: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-stone-900 focus:outline-none focus:border-[#AF8943] text-xs tracking-wider transition-colors" 
                placeholder="請填寫具體的合作計畫，包含採購估計量、期望款式，或對接活動的時程規劃..."
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
                    <span>送出合作提案</span>
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