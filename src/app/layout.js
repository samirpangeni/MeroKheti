import "./globals.css";
import "../../lib/cron"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="google-site-verification" content="wF5KH93xlnahWurLhdeI3ztZD0C5Am0fO-cRq-jhZRE" />
      </Head>
      <body className="min-h-screen bg-white text-black antialiased">
        {children}
        <ToastContainer position="top-right" />
      </body>
    </html>
  );
}
