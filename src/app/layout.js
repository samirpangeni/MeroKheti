export const metadata = {
  verification: {
    google: "wF5KH93xlnahWurLhdeI3ztZD0C5Am0fO-cRq-jhZRE",
  },
};
import "./globals.css";
import "../../lib/cron"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className="min-h-screen bg-white text-black antialiased">
        {children}
        <ToastContainer position="top-right" />
      </body>
    </html>
  );
}
