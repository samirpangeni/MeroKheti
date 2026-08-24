import "./globals.css";
import "../../lib/cron"
import { ToastContainer } from "react-toastify";
import ThemeToggle from "@/components/ThemeToggle";
import "react-toastify/dist/ReactToastify.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className="min-h-screen bg-white text-black antialiased">
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          closeButton={false}
          hideProgressBar={true}
          newestOnTop
          toastStyle={{
            background: "#111714",
            color: "#ffffff",
            border: "1px solid #26382f",
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
          }}
        />
        <ThemeToggle />
      </body>
    </html>
  );
}
