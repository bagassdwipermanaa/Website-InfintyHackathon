import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BlockRights - Digital Copyright Verifier",
  description:
    "Platform blockchain untuk verifikasi hak cipta dan kepemilikan digital karya kreatif",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-white">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
