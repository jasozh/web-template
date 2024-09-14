import { Inter } from "next/font/google";
import Providers from "./providers";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/utils/constants";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /** The current user session cookie */
  const session = cookies().get(SESSION_COOKIE_NAME)?.value || null;

  return (
    <html lang="en">
      <AuthProvider session={session}>
        <Providers>
          <body className={inter.className}>{children}</body>
        </Providers>
      </AuthProvider>
    </html>
  );
}
