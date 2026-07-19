import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// 確保 Vercel 雲端環境變數中有 RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company_name, contact_name, phone, email, business_area, timeframe, proposal_summary } = body;

    // ➔ 網域驗證成功後，正式啟用 sinext.com.tw 官方寄件人
    const { data, error } = await resend.emails.send({
      from: '百夫長品牌鏈總部 <centurion@sinext.com.tw>', // ➔ 這裡可以自由填寫任何 @sinext.com.tw 的前綴
      to: ['brian@sinext.com.tw'],                    // 一律寄給 Brian
      subject: `🔔 貼牌合作提案：【${company_name}】申請加入百夫長品牌鏈`,
      html: `
        <div style="font-family: 'Georgia', 'serif'; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #EFECE6; background-color: #FDFBF7; color: #292524;">
          <h2 style="font-weight: 300; border-bottom: 1px solid #AF8943; padding-bottom: 20px; color: #1C1917;">【百夫長品牌鏈】全新授權與貼牌提案</h2>
          <p style="font-size: 14px; line-height: 1.6; font-weight: 300;">總裁、連顧問及管理團隊你好：</p>
          <p style="font-size: 14px; line-height: 1.6; font-weight: 300;">百夫長集團官網剛剛接收到一筆全新夥伴的貼牌授權與聯名孵化申請，詳情如下：</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
            <tr style="border-bottom: 1px solid #EFECE6;"><td style="padding: 10px; font-weight: bold; width: 120px;">企業名稱</td><td style="padding: 10px;">${company_name}</td></tr>
            <tr style="border-bottom: 1px solid #EFECE6;"><td style="padding: 10px; font-weight: bold;">聯絡人與職稱</td><td style="padding: 10px;">${contact_name}</td></tr>
            <tr style="border-bottom: 1px solid #EFECE6;"><td style="padding: 10px; font-weight: bold;">聯絡電話</td><td style="padding: 10px;">${phone}</td></tr>
            <tr style="border-bottom: 1px solid #EFECE6;"><td style="padding: 10px; font-weight: bold;">電子郵件</td><td style="padding: 10px;">${email}</td></tr>
            <tr style="border-bottom: 1px solid #EFECE6;"><td style="padding: 10px; font-weight: bold;">合作領域</td><td style="padding: 10px;">${business_area}</td></tr>
            <tr style="border-bottom: 1px solid #EFECE6;"><td style="padding: 10px; font-weight: bold;">期望時程</td><td style="padding: 10px;">${timeframe}</td></tr>
          </table>

          <div style="background-color: #white; padding: 20px; border: 1px solid #EFECE6; margin-top: 20px;">
            <h4 style="margin-top: 0; color: #AF8943; font-serif">產品優勢與專利簡述</h4>
            <p style="font-size: 12px; line-height: 1.8; color: #666; white-space: pre-wrap;">${proposal_summary}</p>
          </div>
          
          <p style="font-size: 11px; color: #999; margin-top: 40px; text-align: center; font-family: monospace;">
            CENTURION GROUP AUTOMATED WORKFLOW SYSTEM
          </p>
        </div>
      `
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}