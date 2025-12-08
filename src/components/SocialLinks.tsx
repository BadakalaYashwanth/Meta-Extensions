import { Button } from "./ui/button";
import { GlobeIcon, TwitterIcon, YoutubeIcon } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";

interface SocialLinksProps {
  twitter?: string;
  website?: string;
  telegram?: string;
  youtube?: string;
}

export default function SocialLinks({
  twitter,
  website,
  telegram,
  youtube,
}: SocialLinksProps) {
  return (
    <div className="border-2 border-darkOrange/40 bg-darkOrange-bg p-4 shadow-[4px_4px_0px_0px_rgba(255,130,0,0.3)]">
      <h3 className="font-04b_19 mb-4 text-lg text-darkOrange">Social Links</h3>
      <div className="grid grid-cols-2 gap-3">
        {website && (
          <Button
            variant="outline"
            onClick={() => window.open(website, "_blank")}
            className="h-10 w-full rounded-none border-2 border-darkOrange/40 bg-transparent font-04b_19 text-sm text-darkOrange hover:bg-darkOrange hover:text-white"
          >
            <GlobeIcon className="mr-2 h-4 w-4" />
            Website
          </Button>
        )}
        {twitter && (
          <Button
            variant="outline"
            onClick={() => window.open(twitter, "_blank")}
            className="h-10 w-full rounded-none border-2 border-darkOrange/40 bg-transparent font-04b_19 text-sm text-darkOrange hover:bg-darkOrange hover:text-white"
          >
            <TwitterIcon className="mr-2 h-4 w-4" />
            Twitter
          </Button>
        )}
        {telegram && (
          <Button
            variant="outline"
            onClick={() => window.open(telegram, "_blank")}
            className="h-10 w-full rounded-none border-2 border-darkOrange/40 bg-transparent font-04b_19 text-sm text-darkOrange hover:bg-darkOrange hover:text-white"
          >
            <FaTelegramPlane className="mr-2 h-4 w-4" />
            Telegram
          </Button>
        )}
        {youtube && (
          <Button
            variant="outline"
            onClick={() => window.open(youtube, "_blank")}
            className="h-10 w-full rounded-none border-2 border-darkOrange/40 bg-transparent font-04b_19 text-sm text-darkOrange hover:bg-darkOrange hover:text-white"
          >
            <YoutubeIcon className="mr-2 h-4 w-4" />
            YouTube
          </Button>
        )}
      </div>
    </div>
  );
}
