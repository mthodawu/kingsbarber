import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";
import { Jacquard_24, Noto_Serif } from "next/font/google";

export const metadata: Metadata = {
  title: "King's Barber - Premium Barbershop Experience",
  description: "Professional barbershop services with queue management and appointment booking",
};

const jacquard24 = Jacquard_24({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jacquard-24",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-noto-serif",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jacquard24.variable} ${notoSerif.variable} bg-black text-white min-h-screen min-w-sm font-serif`}>
        <Providers>
          <main className="pb-20">{children}

          <Navigation />
          </main>
        </Providers>
      </body>
    </html>
  );
}
