import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Jay Chawla — AI/ML & Software Engineer",
  description: "Jay Chawla is a computer engineering graduate student working across machine learning, robotics, data systems, and full-stack engineering.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={schibsted.variable}>{children}</body>
    </html>
  );
}
