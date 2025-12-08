import React, { type FC, useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { TwitterIcon, LinkIcon, TextIcon, YoutubeIcon } from "lucide-react";
import { api } from "~/trpc/react";
import { FaXTwitter, FaGlobe, FaTelegram, FaYoutube } from "react-icons/fa6";
import { XIcon } from "lucide-react";

interface formData {
  id: number;
  description: string;
  twitter: string;
  telegram: string;
  youtube: string;
  website: string;
}

interface EditCoinProps {
  id: number;
  token: string | undefined;
}
const EditCoin: FC<EditCoinProps> = ({ token, id }) => {
  const { data: tokenData } = api.token.getById.useQuery({ id });
  const updateToken = api.token.updateToken.useMutation();

  const [formData, setFormData] = useState<formData>({
    id: id,
    description: "",
    twitter: "",
    telegram: "",
    youtube: "",
    website: "",
  });

  console.log("Token Data:", tokenData);

  useEffect(() => {
    if (tokenData) {
      setFormData({
        id: id,
        description: tokenData.description ?? "",
        twitter: tokenData.twitter ?? "",
        telegram: tokenData.telegram ?? "",
        youtube: tokenData.youtube ?? "",
        website: tokenData.website ?? "",
      });
    }
  }, [tokenData, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateToken.mutate(formData, {
      onSuccess: () => {
        window.location.reload();
        console.log("Token updated successfully");
      },
      onError: (error) => {
        console.error("Error updating token:", error);
      },
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="connect"
          className="w-full rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg font-04b_19 text-darkOrange hover:bg-darkOrange hover:text-white"
        >
          EDIT {token}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-[95%] rounded-none border-2 border-darkOrange/40 bg-[#111111] p-0 sm:max-w-lg">
        <AlertDialogCancel asChild>
          <Button
            variant="closeIcon"
            size="icon"
            className="absolute right-2 top-2 z-10 h-6 w-6 rounded-none bg-transparent p-0 text-darkOrange hover:bg-transparent hover:text-darkOrange/80"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </AlertDialogCancel>
        
        <div className="w-full border-b-2 border-darkOrange/40 bg-darkOrange-bg p-4">
          <h2 className="font-04b_19 text-center text-xl text-darkOrange sm:text-2xl">
            EDIT {token}
          </h2>
        </div>

        <form className="space-y-6 p-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block font-04b_19 text-sm text-white/60 selection:bg-darkOrange/30 selection:text-white">
              DESCRIPTION
            </label>
            <Textarea
              id="description"
              placeholder="Enter token description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="h-24 w-full rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg p-3 font-04b_19 text-base text-white placeholder:text-darkOrange/50 focus:border-darkOrange/60 hover:border-darkOrange/60 sm:h-32 selection:bg-darkOrange/30 selection:text-white"
            />
          </div>

          <div className="space-y-4">
            {[
              {
                name: "twitter",
                icon: FaXTwitter,
                label: "TWITTER URL",
                placeholder: "Enter Twitter URL",
              },
              {
                name: "website",
                icon: FaGlobe,
                label: "WEBSITE URL",
                placeholder: "Enter Website URL",
              },
              {
                name: "telegram",
                icon: FaTelegram,
                label: "TELEGRAM URL",
                placeholder: "Enter Telegram URL",
              },
              {
                name: "youtube",
                icon: FaYoutube,
                label: "YOUTUBE URL",
                placeholder: "Enter YouTube URL",
              },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <label className="block font-04b_19 text-sm text-white/60 selection:bg-darkOrange/30 selection:text-white">
                  {item.label}
                </label>
                <div className="flex h-12 items-center rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg transition-colors hover:border-darkOrange/60">
                  <span className="mx-3 text-darkOrange">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <Input
                    name={item.name}
                    value={formData[item.name as keyof formData]}
                    onChange={handleChange}
                    placeholder={item.placeholder}
                    className="h-full border-0 bg-transparent font-04b_19 text-base text-white placeholder:text-darkOrange/50 focus:outline-none selection:bg-darkOrange/30 selection:text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <AlertDialogCancel asChild>
              <Button
                variant="outline"
                className="h-12 w-1/2 rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg px-4 font-04b_19 text-base text-darkOrange hover:bg-darkOrange hover:text-white"
              >
                CANCEL
              </Button>
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={updateToken.isPending}
              className="h-12 w-1/2 rounded-none border-2 border-darkOrange/40 bg-orange-gradient px-4 font-04b_19 text-base text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateToken.isPending ? "UPDATING..." : "UPDATE"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditCoin;
