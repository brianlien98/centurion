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
    icon: [
      {
        url: "https://scontent.ftpe14-1.fna.fbcdn.net/v/t39.30808-6/302306571_410730967865826_3071943591627445751_n.jpg?stp=dst-jpg_tt6&cstp=mx2040x2040&ctp=s2040x2040&_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=CJq1KN4LifUQ7kNvwGjN2pJ&_nc_oc=AdrL4PPGWk3DsIfTlidL-wxRB692V-iDAMSl2NM73lrUlBe73UUkSC8R-MtdIyYGJ4g&_nc_zt=23&_nc_ht=scontent.ftpe14-1.fna&_nc_gid=g3hpbgTuKSmW_1mvCFyD1w&_nc_ss=7b2a8&oh=00_AQCjAsKUcgjpuKYKebFq3VEhh2dsUlwjU81TQk8BspUYxA&oe=6A504600",
        href: "https://scontent.ftpe14-1.fna.fbcdn.net/v/t39.30808-6/302306571_410730967865826_3071943591627445751_n.jpg?stp=dst-jpg_tt6&cstp=mx2040x2040&ctp=s2040x2040&_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=CJq1KN4LifUQ7kNvwGjN2pJ&_nc_oc=AdrL4PPGWk3DsIfTlidL-wxRB692V-iDAMSl2NM73lrUlBe73UUkSC8R-MtdIyYGJ4g&_nc_zt=23&_nc_ht=scontent.ftpe14-1.fna&_nc_gid=g3hpbgTuKSmW_1mvCFyD1w&_nc_ss=7b2a8&oh=00_AQCjAsKUcgjpuKYKebFq3VEhh2dsUlwjU81TQk8BspUYxA&oe=6A504600"
      }
    ]
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