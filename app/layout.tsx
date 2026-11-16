import { IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Ramon Kaushik</title>
        <meta name="description" content="Senior System Engineer, New York" />
      </head>
      <body className={`${plex.variable} ${instrument.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
