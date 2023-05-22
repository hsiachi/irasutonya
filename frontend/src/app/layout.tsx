import "./globals.css";
import localFont from "next/font/local";

const dokdo = localFont({
  weight: "400",
  display: "block",
  src: "../../public/fonts/Dokdo/Dokdo-Regular.ttf",
  variable: "--font-dokdo",
});

const pangolin = localFont({
  weight: "400",
  display: "block",
  src: "../../public/fonts/Pangolin/Pangolin-Regular.ttf",
  variable: "--font-pangolin",
});

export const metadata = {
  title: "Irasutoya Search",
  description: "Search pictures for Irasutoya with natural language",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dokdo.variable} ${pangolin.variable}`}>
        {children}
      </body>
    </html>
  );
}
