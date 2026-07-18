'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseCenturion } from '@/lib/supabase';
import { 
  Loader2, 
  ExternalLink, 
  ChevronLeft, 
  ShieldCheck, 
  Sparkles,
  Award
} from 'lucide-react';

interface LuxuryProduct {
  id: number;
  name: string;
  price_tag: string;
  tagline: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

export default function ShowcaseSubpage() {
  const [products, setProducts] = useState<LuxuryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAllProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabaseCenturion
          .from('centurion_showcase')
          .select('*')
          .eq('is_active', true)
          .order('id', { ascending: false });

        if (error || !data || data.length === 0) throw new Error('Empty');
        setProducts((data as any) as LuxuryProduct[]);
      } catch (err) {
        // 離線降級 Fallback 數據
        setProducts([
          { id: 1, name: 'CENTURION 麥迪遜藍 29吋旗艦款旅行箱', price_tag: 'NT$ 12,800', tagline: '裝載最重要一切的移動城堡', description: '經典雙輪避震設計搭配專利灣流抗衝擊箱體，以高密度法式噴塗麥迪遜藍，體現商務長途飛行的優雅品味。', image_url: '', is_featured: true },
          { id: 2, name: 'CENTURION × Excell 限量聯名登機箱', price_tag: 'NT$ 8,800', tagline: '街頭藝術與工業美學的極致跨界', description: '與工業包材大廠 Excell 共同開發，將大膽的街頭警示膠帶元素，完美融匯進 20 吋精鋼防禦登機箱面。', image_url: '', is_featured: true },
          { id: 3, name: 'CENTURION Save Earth 自然保育系列旅行箱', price_tag: 'NT$ 10,800', tagline: '行走的地球永續環保宣言', description: '採用高彈性多格布袋、羽量級 PC 複合材質，配置 TSA 國際海關鎖，每一次出行都是對生命的致敬。', image_url: '', is_featured: true },
          { id: 4, name: 'CENTURION 廣富號聯名手工高規帆布包', price_tag: 'NT$ 4,800', tagline: '立足台灣，走向世界的工藝交響', description: '攜手台灣知名帆布手工大廠「廣富號」精心製成，活力醒目紅藍交錯寬背帶搭配純棉米色帆布，彰顯純粹手作匠心。', image_url: '', is_featured: false }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-[#AF8943] selection:text-white pb-24">
      
      {/* 導覽列 */}
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
            <span className="text-[8px] bg-[#AF8943]/10 text-[#AF8943] px-2 py-0.5 rounded-full font-mono font-semibold tracking-widest">SHOWROOM</span>
          </div>
        </div>
      </nav>

      {/* 展廳頭部 */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center space-y-4">
        <span className="text-[#AF8943] tracking-[0.3em] text-xs font-semibold uppercase inline-flex items-center space-x-2 font-mono">
          <Award size={14} />
          <span>CENTURION BRAND AUTHORIZATION</span>
        </span>
        <h1 className="text-4xl lg:text-6xl font-serif text-stone-900 font-light leading-tight">
          百夫長品牌認證會館
        </h1>
        <p className="text-stone-500 text-sm max-w-xl mx-auto font-light">
          唯有通過百夫長集團嚴苛品質（Quality Compliance）與服務（Service Compliance）審核之貼牌產品與聯名設計，方可列席於此。
        </p>
      </header>

      {/* 展示會館 Grid */}
      <main className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="animate-spin text-[#AF8943]" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {products.map((prod) => (
              <div 
                key={prod.id} 
                className="bg-white border border-[#EFECE6] p-10 flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-widest">
                    <span className="inline-flex items-center space-x-1.5">
                      <ShieldCheck size={12} className="text-[#AF8943]" />
                      <span>{prod.is_featured ? '首頁精選 RECOMMENDED' : '認證品項 APPROVED'}</span>
                    </span>
                    <span className="text-[#AF8943] font-bold text-sm">{prod.price_tag}</span>
                  </div>

                  <div className="aspect-[16/9] bg-[#FAF8F5] border border-[#EFECE6] flex flex-col justify-center items-center p-6 relative overflow-hidden">
                    <span className="text-[#AF8943] font-serif font-bold text-2xl">{prod.price_tag}</span>
                    <span className="text-[9px] text-stone-400 font-mono mt-1 uppercase tracking-widest">{prod.tagline}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-[#AF8943] transition-colors leading-snug">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-8 border-t border-[#F5F2EB] mt-10 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-stone-400 font-mono tracking-widest">PRODUCT ID: CS-{prod.id.toString().padStart(3, '0')}</span>
                  {prod.image_url && (
                    <a 
                      href={prod.image_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#AF8943] hover:text-[#93702F] inline-flex items-center space-x-1 font-semibold"
                    >
                      <span>產品購買通道</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}