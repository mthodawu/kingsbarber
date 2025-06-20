import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "King's Barber - Premium Barbershop Experience",
  description: "Professional barbershop services with queue management and appointment booking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <Providers>
          <Navigation />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
