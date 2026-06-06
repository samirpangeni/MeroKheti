import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}
