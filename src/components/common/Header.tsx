import Link from "next/link";
import React from "react";
import HeaderWallet from "./HeaderWallet";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import Logo from "../../../public/logo-new.svg";
import type { StaticImageData } from "next/image";
import { api } from "~/trpc/server";
import { TokenNotification } from "./TokenNotifications";

const Header = async () => {
  const token = await api.token.getAllTokens();
  return (
    <div className="flex flex-col p-4 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center  justify-start text-3xl font-bold text-darkOrange shadow-2xl"
        >
          {/* <Image
            className="mr-2"
            src={Logo as StaticImageData}
            alt="Launch It "
            width={140}
            height={140}
          /> */}
          Meta Extensions
        </Link>
        <TokenNotification />
        <div className="flex items-center gap-4">
          <Link
            href={token[0]?.twitter ?? "/"}
            className="hidden text-darkOrange sm:inline-block"
          >
            <span className="h-8 w-8">
              <FaXTwitter size={30} />
            </span>
          </Link>
          <Link
            href={token[0]?.telegram ?? "/"}
            className="hidden text-darkOrange sm:inline-block"
          >
            <span className="h-8 w-8">
              <PiTelegramLogoDuotone size={30} />
            </span>
          </Link>
          <HeaderWallet />
        </div>
      </div>
    </div>
  );
};

export default Header;
