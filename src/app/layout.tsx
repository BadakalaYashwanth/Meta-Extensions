import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/components/common/Header";
import { Web3Modal } from "~/context/web3model";
import { Toaster } from "~/components/ui/sonner";

export const metadata = {
  title: "Meta Extensions - Simplify Your Token Launch",
  description:
    "Meta Extensions simplifies the process of creating and launching meme coins and other tokens. Our platform offers a user-friendly interface, low fees, and robust security measures. Launch your token today!",
  icons: [{ rel: "icon", url: "/new-logo.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="text-ocr-a min-h-screen max-w-[2160px] bg-newBlack">
        <Web3Modal>
          <TRPCReactProvider>
            <Header />
            <div className="w-full">{children}</div>
            <Toaster />
          </TRPCReactProvider>
        </Web3Modal>
      </body>
    </html>
  );
}
