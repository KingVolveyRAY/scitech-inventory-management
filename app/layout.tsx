import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { designSystem } from "@/lib/design-system";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: designSystem.appName,
    template: `%s | ${designSystem.appName}`,
  },
  description: "Sistem Inventori Manajemen Scitech.",
  icons: {
    icon: "/favicon-rounded.png",
    apple: "/favicon-rounded.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-brand-background text-brand-text" suppressHydrationWarning>
        <QueryProvider>
          <Toaster>{children}</Toaster>
        </QueryProvider>
      </body>
    </html>
  );
}
