import "./globals.css";
import "../../lib/cron"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="test-meta" content="hello123" />
      </head>
      <body className="min-h-screen bg-white text-black antialiased">
        {children}
        <ToastContainer position="top-right" />
      </body>
    </html>
  );
}
