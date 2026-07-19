'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseCenturion } from '@/lib/supabase';
import { 
  Loader2, 
  ExternalLink, 
  ChevronLeft, 
  BookOpen,
  ChevronRight,
  FileText
} from 'lucide-react';

interface PressItem {
  id: number;
  title: string;
  summary: string;
  news_url: string;
  image_url: string;
}

export default function PressDedicatedPage() {
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPress, setSelectedPress] = useState<number | null>(null);

  useEffect(() => {
    async function loadAllPress() {
      try {
        setLoading(true);
        const { data, error } = await supabaseCenturion
          .from('centurion_press')
          .select('*')
          .eq('is_active', true)
          .order('id', { ascending: false });

        if (error || !data || data.length === 0) throw new Error('Empty');
        setPressItems((data as any) as PressItem[]);
      } catch (err) {
        setPressItems([
          { id: 1, title: '百夫長行李箱2019年生產優化開箱評測', summary: '針對早期手把零件疑慮，證實品牌自2019年10月起委託全新新代工廠，全面升級引進防滑多段式拉桿與360度靜音大四輪，有效重塑品牌耐用與卓越美譽。', news_url: 'https://www.centurionbuy.com/blog/202311', image_url: '' },
          { id: 2, title: '經典黑色拉鍊款百夫長行李箱開箱實測', summary: '部落客針對經典24吋麥迪遜藍與曜石黑箱進行極致開箱。引述創辦人陳志彬500公克環保法則，指出每減少重量即能有效減輕飛行燃油碳排放。', news_url: 'https://ee025479.pixnet.net/blog/posts/17347319871', image_url: '' },
          { id: 3, title: 'CENTURION百夫長品牌環保起源與設計哲學', summary: '記載創辦人陳志彬因見證全球自然破壞，於2015年發表CENTURION品牌，成為全球首個宣傳海洋、森林與動物保育三大主題之旅行箱品牌。其著名的「灣流式」線條專利設計，象徵不分民族的團結精神與文化傳承。', news_url: 'https://www.centuriontravel.tw/centurion', image_url: '' }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadAllPress();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-[#AF8943] selection:text-white pb-24">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/90 border-b border-[#EFECE6] px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xs text-stone-500 hover:text-[#AF8943] tracking-widest uppercase font-semibold inline-flex items-center space-x-2">
            <ChevronLeft size={14} />
            <span>返回集團總部門戶</span>
          </Link>
          <div className="flex items-center space-x-2">
          <img 
  src="/centurionlogo.png" 
  alt="CENTURION" 
  className="h-8 w-auto object-contain"
/>
            <span className="text-[8px] bg-[#AF8943]/10 text-[#AF8943] px-2 py-0.5 rounded-full font-mono font-semibold tracking-widest">PRESS</span>
          </div>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center space-y-4">
        <span className="text-[#AF8943] tracking-[0.3em] text-xs font-semibold uppercase inline-flex items-center space-x-2 font-mono">
          <BookOpen size={14} />
          <span>CENTURION PUBLIC CHRONICLE</span>
        </span>
        <h1 className="text-4xl lg:text-6xl font-serif text-stone-900 font-light leading-tight">
          媒體觀點與文獻公報 (Press)
        </h1>
        <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
          收錄百夫長集團與總裁陳志彬先生完整的品牌實踐、司法判決、跨國學術與「新政治美學」非典型參選文獻紀錄。
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="animate-spin text-[#AF8943]" size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            {pressItems.map((p) => (
              <div key={p.id} className="bg-white border border-[#EFECE6] p-8 hover:border-[#AF8943]/40 transition-all duration-300">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setSelectedPress(selectedPress === p.id ? null : p.id)}
                >
                  <h4 className="text-base font-serif font-bold text-stone-900 pr-4 hover:text-[#AF8943] transition-colors leading-snug">
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
                          <span>檢視外部文獻</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}