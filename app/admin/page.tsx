'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseCenturion, type WallOfFameItem } from '@/lib/supabase';
import { 
  Loader2, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Database, 
  CheckCircle, 
  ChevronLeft,
  Sparkles,
  Layers,
  FileText,
  Award,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  Layers2,
  Mail,
  UserCheck
} from 'lucide-react';

interface ShowcaseItem {
  id: number;
  name: string;
  price_tag: string;
  tagline: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

interface PressItem {
  id: number;
  title: string;
  summary: string;
  news_url: string;
  image_url: string;
}

interface PartnershipLead {
  id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  business_area: string;
  timeframe: string;
  proposal_summary: string;
  status: string;
  created_at: string;
}

interface IncubationLead {
  id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  product_category: string;
  current_market_price: string;
  product_description: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  // 後台解鎖鎖定
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'showcase' | 'press' | 'wall' | 'leads'>('showcase');

  // 資料列表狀態
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [wallItems, setWallItems] = useState<WallOfFameItem[]>([]);
  const [partnershipLeads, setPartnershipLeads] = useState<PartnershipLead[]>([]);
  const [incubationLeads, setIncubationLeads] = useState<IncubationLead[]>([]);

  // 載入 Loading 狀態
  const [loading, setLoading] = useState<boolean>(false);
  const [cmsSubmitStatus, setCmsSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // CMS 各項表單輸入狀態
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

  // 1. 動態資料讀取載入器
  const loadShowcaseData = async () => {
    try {
      const { data, error } = await supabaseCenturion
        .from('centurion_showcase')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: false });
      if (error) throw error;
      setShowcaseItems((data as any) as ShowcaseItem[]);
    } catch (err) {
      console.error('Failed to load showcase:', err);
    }
  };

  const loadPressData = async () => {
    try {
      const { data, error } = await supabaseCenturion
        .from('centurion_press')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: false });
      if (error) throw error;
      setPressItems((data as any) as PressItem[]);
    } catch (err) {
      console.error('Failed to load press:', err);
    }
  };

  const loadWallData = async () => {
    try {
      const { data, error } = await supabaseCenturion
        .from('centurion_wall_of_fame')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false });
      if (error) throw error;
      setWallItems((data as any) as WallOfFameItem[]);
    } catch (err) {
      console.error('Failed to load wall of fame:', err);
    }
  };

  const loadLeadsData = async () => {
    try {
      // 讀取【百夫長品牌鏈】夥伴意向書
      const { data: pData, error: pError } = await supabaseCenturion
        .from('centurion_partnership_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (pError) throw pError;
      setPartnershipLeads((pData as any) as PartnershipLead[]);

      // 讀取【貼牌孵化】提案意向書
      const { data: iData, error: iError } = await supabaseCenturion
        .from('centurion_incubation_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (iError) throw iError;
      setIncubationLeads((iData as any) as IncubationLead[]);
    } catch (err) {
      console.error('Failed to load leads data:', err);
    }
  };

  // 當管理密碼解鎖後，自動刷新載入所有實時資料
  useEffect(() => {
    if (adminUnlocked) {
      setLoading(true);
      Promise.all([
        loadShowcaseData(),
        loadPressData(),
        loadWallData(),
        loadLeadsData()
      ]).finally(() => setLoading(false));
    }
  }, [adminUnlocked]);

  // 2. 後台解鎖密碼判定
  const handleUnlockCms = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1978') {
      setAdminUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  // 3. 各資料表新增提交
  const handleAddShowcase = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSubmitStatus('submitting');
    try {
      const { error } = await supabaseCenturion.from('centurion_showcase').insert([newShowcase]);
      if (error) throw error;
      setCmsSubmitStatus('success');
      setNewShowcase({ name: '', price_tag: '', tagline: '', description: '', image_url: '', is_featured: true });
      await loadShowcaseData();
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
      await loadPressData();
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
      await loadWallData();
    } catch (err) {
      setCmsSubmitStatus('error');
    }
  };

  // 4. 各資料表即時刪除下架
  const handleDeleteShowcase = async (id: number) => {
    if (!confirm('確認永久下架此展示會館商品？')) return;
    try {
      const { error } = await supabaseCenturion.from('centurion_showcase').delete().eq('id', id);
      if (error) throw error;
      await loadShowcaseData();
    } catch (err) {
      alert('下架失敗。');
    }
  };

  const handleDeletePress = async (id: number) => {
    if (!confirm('確定永久下架此媒體報導文獻？')) return;
    try {
      const { error } = await supabaseCenturion.from('centurion_press').delete().eq('id', id);
      if (error) throw error;
      await loadPressData();
    } catch (err) {
      alert('下架失敗。');
    }
  };

  const handleDeleteWall = async (id: number) => {
    if (!confirm('確定下架此跨界聯名夥伴？')) return;
    try {
      const { error } = await supabaseCenturion.from('centurion_wall_of_fame').delete().eq('id', id);
      if (error) throw error;
      await loadWallData();
    } catch (err) {
      alert('下架失敗。');
    }
  };

  const handleDeletePartnershipLead = async (id: string) => {
    if (!confirm('確定刪除此筆品牌鏈合作申請書嗎？')) return;
    try {
      const { error } = await supabaseCenturion.from('centurion_partnership_leads').delete().eq('id', id);
      if (error) throw error;
      await loadLeadsData();
    } catch (err) {
      alert('刪除失敗。');
    }
  };

  const handleDeleteIncubationLead = async (id: string) => {
    if (!confirm('確定刪除此筆貼牌孵化審核書嗎？')) return;
    try {
      const { error } = await supabaseCenturion.from('centurion_incubation_leads').delete().eq('id', id);
      if (error) throw error;
      await loadLeadsData();
    } catch (err) {
      alert('刪除失敗。');
    }
  };

  // 5. 推薦至首頁精選 toggler
  const toggleFeatureShowcase = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabaseCenturion
        .from('centurion_showcase')
        .update({ is_featured: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      await loadShowcaseData();
    } catch (err) {
      alert('切換精選狀態失敗。');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans pb-24 selection:bg-[#AF8943] selection:text-white">
      
      {/* 後台極簡高奢導覽 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/90 border-b border-[#EFECE6] px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xs text-stone-500 hover:text-[#AF8943] tracking-widest uppercase font-semibold inline-flex items-center space-x-2">
            <ChevronLeft size={14} />
            <span>返回集團總部門戶</span>
          </Link>
          <div className="flex items-center space-x-2">
            <img 
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_100/1886487/831598_863023.png" 
              alt="CENTURION" 
              className="h-8 w-auto object-contain"
            />
            <span className="text-[8px] bg-[#AF8943]/10 text-[#AF8943] px-2 py-0.5 rounded-full font-mono font-semibold tracking-widest">HQ ADMIN</span>
          </div>
        </div>
      </nav>

      {/* 管理面板主結構 */}
      <main className="max-w-5xl mx-auto px-6 mt-16 space-y-12">
        
        {/* 安全標題 */}
        <div className="text-center space-y-4">
          <span className="text-[#AF8943] tracking-[0.25em] text-xs font-semibold uppercase inline-flex items-center space-x-2 font-mono">
            {adminUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
            <span>CENTURION GROUP CONTROL CENTER</span>
          </span>
          <h1 className="text-3xl lg:text-5xl font-serif text-stone-900 font-light tracking-wide">
            集團美學控股決策系統
          </h1>
          <p className="text-stone-500 text-xs font-light max-w-lg mx-auto">
            專為總裁、品牌鏈顧問連仲賢先生設計，提供全站展示會館 (/showcase)、媒體報導 (/press) 及跨界聯名牆的動態數據管理核心。
          </p>
        </div>

        {!adminUnlocked ? (
          /* 1. 密碼驗證頁 */
          <form onSubmit={handleUnlockCms} className="max-w-sm mx-auto bg-white p-10 border border-[#EFECE6] space-y-6 text-center shadow-sm">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-widest">安全解鎖授權碼</label>
              <input 
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EFECE6] text-center rounded-none py-3.5 text-stone-900 focus:outline-none focus:border-[#AF8943] text-sm tracking-widest transition-colors font-mono"
                placeholder="ENTER PASSCODE"
              />
            </div>
            {passcodeError && (
              <p className="text-xs text-rose-600 font-medium">❌ 授權碼錯誤，請確保輸入總裁或連顧問擁有的專屬憑證。</p>
            )}
            <button 
              type="submit"
              className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold py-4 px-8 text-xs tracking-widest uppercase transition-colors w-full rounded-none"
            >
              進入控股總部決策系統
            </button>
          </form>
        ) : (
          /* 2. 已驗證：四合一 CMS 後台面板 */
          <div className="space-y-12 animate-fadeIn">
            
            {/* CMS Tab 選單 */}
            <div className="flex border-b border-[#EFECE6]">
              {[
                { id: 'showcase', label: 'Tab 1: 展示品與首頁精選' },
                { id: 'press', label: 'Tab 2: PRESS 媒體新知' },
                { id: 'wall', label: 'Tab 3: 聯名牆合作紀錄' },
                { id: 'leads', label: 'Tab 4: 戰略合作提案清單' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setCmsSubmitStatus('idle');
                  }}
                  className={`flex-1 py-4 text-xs font-semibold tracking-wider text-center border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-[#AF8943] text-[#AF8943]'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <Loader2 className="animate-spin text-[#AF8943]" size={32} />
              </div>
            ) : (
              <div className="space-y-10">

                {/* Tab 1: 高奢展示會館上架 */}
                {activeTab === 'showcase' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
                      <div className="flex items-center space-x-2 text-[#AF8943] pb-3 border-b border-[#F5F2EB]">
                        <Plus size={18} />
                        <span className="text-xs font-bold tracking-widest uppercase">上架全新高奢展示品（同步呈現於 /showcase）</span>
                      </div>
                      <form onSubmit={handleAddShowcase} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">展示品名稱</label>
                            <input 
                              type="text" required
                              value={newShowcase.name}
                              onChange={(e) => setNewShowcase({ ...newShowcase, name: e.target.value })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900 focus:outline-none focus:border-[#AF8943]"
                              placeholder="CENTURION 麥迪遜藍 29吋旅行箱"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">定價標籤</label>
                            <input 
                              type="text" required
                              value={newShowcase.price_tag}
                              onChange={(e) => setNewShowcase({ ...newShowcase, price_tag: e.target.value })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900 focus:outline-none focus:border-[#AF8943]"
                              placeholder="NT$ 12,800"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">美學宣言 (Tagline)</label>
                            <input 
                              type="text" required
                              value={newShowcase.tagline}
                              onChange={(e) => setNewShowcase({ ...newShowcase, tagline: e.target.value })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900 focus:outline-none focus:border-[#AF8943]"
                              placeholder="你負責追求品質極致..."
                            />
                        </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">展示圖片網址 (可留空)</label>
                            <input 
                              type="text"
                              value={newShowcase.image_url}
                              onChange={(e) => setNewShowcase({ ...newShowcase, image_url: e.target.value })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900 focus:outline-none focus:border-[#AF8943]"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">細部技術與規格描述</label>
                          <textarea 
                            rows={3} required
                            value={newShowcase.description}
                            onChange={(e) => setNewShowcase({ ...newShowcase, description: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900 focus:outline-none focus:border-[#AF8943]"
                            placeholder="PC/ABS材質、多段式手把、雙層防盜拉鍊、萬向飛機大輪配置..."
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <input 
                            type="checkbox"
                            id="is_featured_check"
                            checked={newShowcase.is_featured}
                            onChange={(e) => setNewShowcase({ ...newShowcase, is_featured: e.target.checked })}
                            className="w-4 h-4 accent-[#AF8943]"
                          />
                          <label htmlFor="is_featured_check" className="text-xs text-stone-600 font-bold">同步推薦此品呈現在官網首頁「精選典藏區」（首頁僅呈現 5~10 品）</label>
                        </div>

                        {cmsSubmitStatus === 'success' && (
                          <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1"><CheckCircle size={14} /><span>展示品成功發佈！/showcase 與首頁已同步刷新。</span></p>
                        )}

                        <div className="text-right">
                          <button type="submit" className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold py-3.5 px-8 text-xs tracking-widest uppercase">發佈高奢展示品</button>
                        </div>
                      </form>
                    </div>

                    <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
                      <div className="flex items-center space-x-2 text-[#AF8943] pb-3 border-b border-[#F5F2EB]">
                        <Database size={18} />
                        <span className="text-xs font-bold tracking-widest uppercase">展示品控制清單（提供首頁精選一鍵開關）</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[#EFECE6] text-stone-400 font-mono tracking-widest">
                              <th className="py-3">品名</th>
                              <th className="py-3">單價</th>
                              <th className="py-3 text-center">首頁精選</th>
                              <th className="py-3 text-center">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {showcaseItems.map((prod) => (
                              <tr key={prod.id} className="border-b border-[#FAF8F5] hover:bg-[#FAF8F5]/40 transition-colors">
                                <td className="py-4 font-serif font-bold text-stone-900">{prod.name}</td>
                                <td className="py-4 font-mono text-[#AF8943] font-semibold">{prod.price_tag}</td>
                                <td className="py-4 text-center">
                                  <button
                                    onClick={() => toggleFeatureShowcase(prod.id, prod.is_featured)}
                                    className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase ${
                                      prod.is_featured 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : 'bg-stone-100 text-stone-500'
                                    }`}
                                  >
                                    {prod.is_featured ? '精選呈現中' : '未精選'}
                                  </button>
                                </td>
                                <td className="py-4 text-center">
                                  <button onClick={() => handleDeleteShowcase(prod.id)} className="text-stone-400 hover:text-rose-600 transition-colors">
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

                {/* Tab 2: PRESS 媒體新知上架 */}
                {activeTab === 'press' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
                      <div className="flex items-center space-x-2 text-[#AF8943] pb-3 border-b border-[#F5F2EB]">
                        <Plus size={18} />
                        <span className="text-xs font-bold tracking-widest uppercase">發佈全新媒體報導與新知文獻（呈現於 /press）</span>
                      </div>
                      <form onSubmit={handleAddPress} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">媒體標題與報導類型</label>
                            <input 
                              type="text" required
                              value={newPress.title}
                              onChange={(e) => setNewPress({ ...newPress, title: e.target.value })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900 focus:outline-none focus:border-[#AF8943]"
                              placeholder="例：經濟日報：陳志彬獲聘品牌顧問"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">外部新聞原始網址</label>
                            <input 
                              type="url"
                              value={newPress.news_url}
                              onChange={(e) => setNewPress({ ...newPress, news_url: e.target.value })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900 focus:outline-none focus:border-[#AF8943]"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">重點摘要 (100 字內)</label>
                          <textarea 
                            rows={3} required
                            value={newPress.summary}
                            onChange={(e) => setNewPress({ ...newPress, summary: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900 focus:outline-none focus:border-[#AF8943]"
                            placeholder="請輸入報導核心理念、專訪大意..."
                          />
                        </div>

                        {cmsSubmitStatus === 'success' && (
                          <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1"><CheckCircle size={14} /><span>媒體文獻發佈成功！/press 已即時更新。</span></p>
                        )}

                        <div className="text-right">
                          <button type="submit" className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold py-3.5 px-8 text-xs tracking-widest uppercase">發佈媒體新知</button>
                        </div>
                      </form>
                    </div>

                    <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
                      <div className="flex items-center space-x-2 text-[#AF8943] pb-3 border-b border-[#F5F2EB]">
                        <Database size={18} />
                        <span className="text-xs font-bold tracking-widest uppercase">新知文獻列表與即時下架</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[#EFECE6] text-stone-400 font-mono tracking-widest">
                              <th className="py-3">ID</th>
                              <th className="py-3">標題</th>
                              <th className="py-3 text-center">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pressItems.map((p) => (
                              <tr key={p.id} className="border-b border-[#FAF8F5] hover:bg-[#FAF8F5]/40 transition-colors">
                                <td className="py-4 font-mono text-[#AF8943]">#{p.id.toString().padStart(3, '0')}</td>
                                <td className="py-4 font-serif font-bold text-stone-900">{p.title}</td>
                                <td className="py-4 text-center">
                                  <button onClick={() => handleDeletePress(p.id)} className="text-stone-400 hover:text-rose-600 transition-colors">
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

                {/* Tab 3: Wall of Fame 聯名榮譽牆上架 */}
                {activeTab === 'wall' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
                      <div className="flex items-center space-x-2 text-[#AF8943] pb-3 border-b border-[#F5F2EB]">
                        <Plus size={18} />
                        <span className="text-xs font-bold tracking-widest uppercase">上架跨界聯名與 IP 夥伴紀錄</span>
                      </div>
                      <form onSubmit={handleAddWall} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">發行年份</label>
                            <input 
                              type="text" required
                              value={newWall.year}
                              onChange={(e) => setNewWall({ ...newWall, year: e.target.value })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900"
                              placeholder="例: 2023"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">夥伴品牌/IP名稱</label>
                            <input 
                              type="text" required
                              value={newWall.brand}
                              onChange={(e) => setNewWall({ ...newWall, brand: e.target.value })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900"
                              placeholder="例: SOU‧SOU (京都)"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">主導或創辦人</label>
                            <input 
                              type="text"
                              value={newWall.founder}
                              onChange={(e) => setNewWall({ ...newWall, founder: e.target.value })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900"
                              placeholder="例: 羅志祥 (可留空)"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">分類選單</label>
                            <select 
                              value={newWall.category}
                              onChange={(e) => setNewWall({ ...newWall, category: e.target.value as any })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-700"
                            >
                              <option value="artist-ip">藝人 / IP 聯名</option>
                              <option value="media">媒體 / 雜誌</option>
                              <option value="brand-retail">民生與零售通路</option>
                              <option value="culture">文化 / 藝術 / ESG</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">短標籤標章 (Badge)</label>
                            <input 
                              type="text" required
                              value={newWall.type}
                              onChange={(e) => setNewWall({ ...newWall, type: e.target.value })}
                              className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900"
                              placeholder="例: 京都傳統印花"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">聯名詳情描述</label>
                          <textarea 
                            rows={3} required
                            value={newWall.description}
                            onChange={(e) => setNewWall({ ...newWall, description: e.target.value })}
                            className="w-full bg-[#FAF8F5] border border-[#EFECE6] rounded-none px-4 py-4 text-xs text-stone-900"
                            placeholder="描述跨界合作、美學碰撞的長遠影響..."
                          />
                        </div>

                        {cmsSubmitStatus === 'success' && (
                          <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1"><CheckCircle size={14} /><span>聯名榮譽夥伴發佈成功！已寫入實時資料。</span></p>
                        )}

                        <div className="text-right">
                          <button type="submit" className="bg-[#AF8943] hover:bg-[#93702F] text-white font-bold py-3.5 px-8 text-xs tracking-widest uppercase">發佈聯名夥伴</button>
                        </div>
                      </form>
                    </div>

                    <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
                      <div className="flex items-center space-x-2 text-[#AF8943] pb-3 border-b border-[#F5F2EB]">
                        <Database size={18} />
                        <span className="text-xs font-bold tracking-widest uppercase">榮譽牆已上線夥伴控制清單</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[#EFECE6] text-stone-400 font-mono tracking-widest">
                              <th className="py-3">年份</th>
                              <th className="py-3">品牌 / IP</th>
                              <th className="py-3 text-center">分類</th>
                              <th className="py-3 text-center">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wallItems.map((item) => (
                              <tr key={item.id} className="border-b border-[#FAF8F5] hover:bg-[#FAF8F5]/40 transition-colors">
                                <td className="py-4 font-mono text-[#AF8943] font-semibold">{item.year}</td>
                                <td className="py-4 font-serif font-bold text-stone-900">{item.brand}</td>
                                <td className="py-4 font-mono text-stone-500">{item.category}</td>
                                <td className="py-4 text-center">
                                  <button onClick={() => handleDeleteWall(item.id as any)} className="text-stone-400 hover:text-rose-600 transition-colors">
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

                {/* Tab 4: 合作提案列表 (B2B Lead Management - 全新上架！) */}
                {activeTab === 'leads' && (
                  <div className="space-y-12 animate-fadeIn">
                    
                    {/* 表 1: 【百夫長品牌鏈】夥伴授權申請清單 */}
                    <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
                      <div className="flex items-center space-x-2 text-[#AF8943] pb-3 border-b border-[#F5F2EB]">
                        <UserCheck size={18} />
                        <span className="text-xs font-bold tracking-widest uppercase">【百夫長品牌鏈】授權申請清單</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[#EFECE6] text-stone-400 font-mono tracking-widest">
                              <th className="py-3">企業與聯絡人</th>
                              <th className="py-3">電話與信箱</th>
                              <th className="py-3">合作方案 & 簡述</th>
                              <th className="py-3 text-center">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {partnershipLeads.map((lead) => (
                              <tr key={lead.id} className="border-b border-[#FAF8F5] hover:bg-[#FAF8F5]/40 transition-colors">
                                <td className="py-4 space-y-1">
                                  <div className="font-serif font-bold text-stone-900">{lead.company_name}</div>
                                  <div className="text-stone-500 font-light">{lead.contact_name}</div>
                                </td>
                                <td className="py-4 space-y-1 font-mono">
                                  <div className="text-stone-900">{lead.phone}</div>
                                  <div className="text-stone-500">{lead.email}</div>
                                </td>
                                <td className="py-4 space-y-2 max-w-sm">
                                  <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 font-bold">{lead.business_area}</span>
                                  <p className="text-stone-600 font-light leading-relaxed mt-1 text-[11px]">{lead.proposal_summary}</p>
                                </td>
                                <td className="py-4 text-center">
                                  <button onClick={() => handleDeletePartnershipLead(lead.id)} className="text-stone-400 hover:text-rose-600 transition-colors">
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 表 2: 【貼牌與品牌孵化】申請清單 */}
                    <div className="bg-white p-8 border border-[#EFECE6] space-y-6">
                      <div className="flex items-center space-x-2 text-[#AF8943] pb-3 border-b border-[#F5F2EB]">
                        <Layers2 size={18} />
                        <span className="text-xs font-bold tracking-widest uppercase">【貼牌與品牌孵化】專案申請清單</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[#EFECE6] text-stone-400 font-mono tracking-widest">
                              <th className="py-3">企業與聯絡人</th>
                              <th className="py-3">聯繫電話/Email</th>
                              <th className="py-3">產品分類與優勢</th>
                              <th className="py-3 text-center">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {incubationLeads.map((lead) => (
                              <tr key={lead.id} className="border-b border-[#FAF8F5] hover:bg-[#FAF8F5]/40 transition-colors">
                                <td className="py-4 space-y-1">
                                  <div className="font-serif font-bold text-stone-900">{lead.company_name}</div>
                                  <div className="text-stone-500 font-light">{lead.contact_name}</div>
                                </td>
                                <td className="py-4 space-y-1 font-mono">
                                  <div className="text-stone-900">{lead.phone}</div>
                                  <div className="text-stone-500">{lead.email}</div>
                                </td>
                                <td className="py-4 space-y-2 max-w-sm">
                                  <div className="flex items-center space-x-2">
                                    <span className="bg-stone-100 text-stone-800 text-[10px] px-2 py-0.5 font-mono">分類: {lead.product_category}</span>
                                    {lead.current_market_price && (
                                      <span className="bg-amber-50 text-amber-800 text-[10px] px-2 py-0.5 font-mono">原市售: {lead.current_market_price}</span>
                                    )}
                                  </div>
                                  <p className="text-stone-600 font-light leading-relaxed mt-1 text-[11px]">{lead.product_description}</p>
                                </td>
                                <td className="py-4 text-center">
                                  <button onClick={() => handleDeleteIncubationLead(lead.id)} className="text-stone-400 hover:text-rose-600 transition-colors">
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
            )}

          </div>
        )}

      </main>

      {/* 頁尾 */}
      <footer className="bg-[#FAF8F5] py-20 border-t border-[#EFECE6] text-center text-xs text-stone-500 mt-24">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="font-serif font-bold tracking-[0.3em] text-stone-900 text-2xl">CENTURION</div>
          <p className="tracking-widest font-light text-stone-400 uppercase">CENTURION GROUP © {new Date().getFullYear()} ALL RIGHTS RESERVED.</p>
          <div className="flex justify-center space-x-4 text-[10px] text-stone-400 font-mono">
            <span>UNIFIED DECISION BOARD TERMINAL ACTIVE</span>
            <span>•</span>
            <span>LV PREMIUM DESIGN</span>
          </div>
        </div>
      </footer>

    </div>
  );
}