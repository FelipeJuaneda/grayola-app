import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LoadingProvider } from "@/context/Loading/LoadingContext";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Grayola App",
  description:
    "Grayola App es una plataforma moderna para la gestión de proyectos de diseño.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}  antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LoadingProvider>
            {children}
            <Toaster richColors />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
