import './globals.css';

export const metadata = {
  title: 'موقع الأفلام والمسلسلات',
  description: 'استعراض الأفلام والمسلسلات ومشاهدة تفاصيلها',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
