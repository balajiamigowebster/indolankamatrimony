import {
  Geist,
  Geist_Mono,
  Cinzel_Decorative,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "@/components/ui/sonner";
import RevealProvider from "./Components/RevealProvider";
import FooterWrapper from "./Components/FooterWrapper";
import NavbarProvider from "./NavbarProvider/NavbarProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfairDisplay = Cinzel_Decorative({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "indolankamatrimony",
  description: "indolankamatrimony website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${playfairDisplay.variable} antialiased`}
      >
        <ReduxProvider>
          <NavbarProvider>
            {children}
            <FooterWrapper />
            <Toaster
              toastOptions={{
                className: "rounded-2xl border shadow-lg",
                style: {
                  //background: "#1e1e1e",
                  // color: "#fff",
                  fontSize: "16px",
                  //color: "white",
                  borderLeft: "10px solid ",
                },
              }}
            />
          </NavbarProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
