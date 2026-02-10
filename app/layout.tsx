import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NICE POS - 결제 시스템',
  description: '웹과 앱을 모두 지원하는 NICE POS 결제 시스템',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-primary">NICE POS</h1>
            <p className="text-sm text-gray-600">통합 결제 시스템</p>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
            © 2024 NICE POS. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
