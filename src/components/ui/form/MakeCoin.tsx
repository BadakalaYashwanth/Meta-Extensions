"use client";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Button } from "../button";
import { api } from "~/trpc/react";

import {
  GlobeIcon,
  LinkIcon,
  TextIcon,
  TwitterIcon,
  XIcon,
  YoutubeIcon,
} from "lucide-react";
import type { StaticImageData } from "next/image";
import RocketIcon from "../../../../public/rocket-create-coin.svg";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import FileUpload from "~/components/common/FileUpload";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { imageUrl, supabaseKey, supabaseUrl } from "~/constant/supabase";
import {
  BrowserProvider,
  Contract,
  type ContractTransactionResponse,
  parseEther,
} from "ethers";
import { contractAbi, contractAddress } from "~/constant/contractDetails";
import { Progress } from "../progress";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
} from "~/components/ui/alert-dialog";
import { FaXTwitter, FaTelegram } from "react-icons/fa6";

const supabase = createClient(supabaseUrl, supabaseKey);
interface formData {
  name: string;
  ticker: string;
  description: string;
  twitter: string;
  telegram: string;
  youtube: string;
  website: string;
}

export default function MakeCoin() {
  const [formData, setFormData] = useState<formData>({
    name: "",
    ticker: "",
    description: "",
    twitter: "",
    telegram: "",
    youtube: "",
    website: "",
  });

  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();
  const [loading, setLoading] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const router = useRouter();

  const token = api.token.addToken.useMutation({
    onSuccess(response) {
      console.log("response", response);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);
      setLoadingPercentage(0);
      setCurrentAction("Initializing...");

      if (!file) {
        toast("Please upload an image");
        return;
      }

      if (!address) {
        toast("Please connect wallet");
        return;
      }

      setLoadingPercentage(10);
      setCurrentAction("Connecting to wallet...");
      console.log("Inside try");

      if (!walletProvider) {
        throw new Error("Wallet provider not found");
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);

      // Verify contract methods
      if (
        typeof contract.deployToken !== "function" ||
        typeof contract.totalDeployedTokens !== "function" ||
        typeof contract.getDeployedPairAddress !== "function" ||
        typeof contract.getDeployedTokenAddress !== "function"
      ) {
        throw new Error("Contract methods not found");
      }

      setLoadingPercentage(20);
      setCurrentAction("Preparing to create token...");
      console.log("Before create token");

      const deployToken = (await contract.deployToken(
        formData.name,
        formData.ticker,
        {
          value: parseEther("0.0001"),
        },
      )) as ContractTransactionResponse;

      setLoadingPercentage(40);
      setCurrentAction("Token creation in progress...");
      console.log("After create token");

      const txReceipt = await deployToken.wait();

      if (!txReceipt) {
        throw new Error("Transaction failed");
      }

      setLoadingPercentage(60);
      setCurrentAction("Retrieving deployment details...");
      console.log("deployToken", deployToken);

      const totalDeployedTokens = (await contract.totalDeployedTokens(
        address,
      )) as number;
      if (totalDeployedTokens === undefined) {
        throw new Error("Failed to get total deployed tokens");
      }

      setLoadingPercentage(70);
      setCurrentAction("Getting pair address...");
      console.log("totalDeployedTokens", totalDeployedTokens);

      const pairAddress = (await contract.getDeployedPairAddress(
        address,
        totalDeployedTokens,
      )) as string;

      if (typeof pairAddress !== "string") {
        throw new Error("Invalid pair address");
      }

      setLoadingPercentage(80);
      setCurrentAction("Getting token address...");
      console.log("getDeployedPairAddress", pairAddress);

      const tokenAddress = (await contract.getDeployedTokenAddress(
        address,
        totalDeployedTokens,
      )) as string;

      if (typeof tokenAddress !== "string") {
        throw new Error("Invalid token address");
      }

      setLoadingPercentage(90);
      setCurrentAction("Uploading image...");
      console.log("getDeployedTokenAddress", tokenAddress);

      console.log("txReceipt", txReceipt);

      const image = await handleFileUpload();

      if (!image || !tokenAddress || !pairAddress) {
        throw new Error("Missing required data");
      }

      setLoadingPercentage(95);
      setCurrentAction("Finalizing token creation...");

      const tokenDetails = {
        ...formData,
        image,
        userAddress: address,
        marketCap: 30000,
        tokenAddress: tokenAddress,
        liquidity: 500,
        pairAddress: pairAddress,
        isDeployed: false,
      };

      await token.mutateAsync(tokenDetails);
      setLoadingPercentage(100);
      setCurrentAction("Token created successfully!");
      router.push(`/token/${tokenAddress}`);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setLoading(false);
      setLoadingPercentage(0);
      setCurrentAction("");
      toast(
        `Error: ${err instanceof Error ? err.message : "Unknown error occurred"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const [file, setFile] = useState<File | null>(null);

  async function handleFileUpload() {
    try {
      if (!file) {
        toast("please upload an image");
        setLoading(false);
        return;
      }
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const filePath = `${fileName}`;
      const { error, data } = await supabase.storage
        .from("token-images")
        .upload(filePath, file);

      if (error) {
        toast("error uploading image: \n" + error.message);
      }

      console.log("dataaaaaaaaaaaaaaaaaaaaa", data);
      console.log("errrrrrrrrrrrrrrrrrrrror", error);

      return `${imageUrl}${fileName}`;
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="connect"
          size="lg"
          className="w-full bg-darkOrange  shadow-white"
        >
          CREATE COIN
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[95%] max-w-md rounded-none border-2 border-darkOrange/40 bg-newBlack p-0 sm:w-full">
        <AlertDialogCancel asChild>
          <Button
            variant="closeIcon"
            size="icon"
            className="absolute right-2 top-2 z-10 h-6 w-6 rounded-none bg-transparent p-0 text-darkOrange hover:text-darkOrange/80"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </AlertDialogCancel>
        <div className="w-full border-b-2 border-darkOrange/40 bg-darkOrange-bg p-3">
          <h2 className="font-04b_19 flex items-center justify-center gap-2 text-center text-base sm:text-lg text-darkOrange">
            CREATE COIN
            <Image
              src={RocketIcon as StaticImageData}
              alt="Rocket"
              className="h-6 w-6 opacity-80"
            />
          </h2>
        </div>
        <form className="space-y-3 p-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              name="name"
              onChange={handleChange}
              placeholder="TOKEN NAME"
              className="h-10 rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg px-3 font-04b_19 text-sm text-white placeholder:text-darkOrange/50 focus:border-darkOrange/60 focus:outline-none hover:border-darkOrange/60"
            />
            <Input
              name="ticker"
              onChange={handleChange}
              placeholder="TICKER"
              className="h-10 rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg px-3 font-04b_19 text-sm text-white placeholder:text-darkOrange/50 focus:border-darkOrange/60 focus:outline-none hover:border-darkOrange/60"
            />
          </div>
          <Textarea
            placeholder="DESCRIPTION"
            name="description"
            onChange={handleChange}
            className="min-h-[80px] rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg p-3 font-04b_19 text-sm text-white placeholder:text-darkOrange/50 focus:border-darkOrange/60 focus:outline-none hover:border-darkOrange/60"
          />
          <div className="rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg p-3 hover:border-darkOrange/60 transition-colors">
            <FileUpload value="null" onFileChange={(file) => setFile(file)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="group flex h-10 items-center rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg transition-colors hover:border-darkOrange/60">
              <span className="mx-2 h-5 w-5 text-darkOrange">
                <FaXTwitter />
              </span>
              <Input
                name="twitter"
                onChange={handleChange}
                placeholder="X URL"
                className="h-full border-0 bg-transparent font-04b_19 text-sm text-white placeholder:text-darkOrange/50 focus:outline-none"
              />
            </div>
            <div className="group flex h-10 items-center rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg transition-colors hover:border-darkOrange/60">
              <GlobeIcon className="mx-2 h-5 w-5 text-darkOrange" />
              <Input
                name="website"
                onChange={handleChange}
                placeholder="Website URL"
                className="h-full border-0 bg-transparent font-04b_19 text-sm text-white placeholder:text-darkOrange/50 focus:outline-none"
              />
            </div>
            <div className="group flex h-10 items-center rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg transition-colors hover:border-darkOrange/60">
              <span className="mx-2 h-5 w-5 text-darkOrange">
                <FaTelegram />
              </span>
              <Input
                name="telegram"
                onChange={handleChange}
                placeholder="Telegram URL"
                className="h-full border-0 bg-transparent font-04b_19 text-sm text-white placeholder:text-darkOrange/50 focus:outline-none"
              />
            </div>
            <div className="group flex h-10 items-center rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg transition-colors hover:border-darkOrange/60">
              <YoutubeIcon className="mx-2 h-5 w-5 text-darkOrange" />
              <Input
                name="youtube"
                onChange={handleChange}
                placeholder="YouTube URL"
                className="h-full border-0 bg-transparent font-04b_19 text-sm text-white placeholder:text-darkOrange/50 focus:outline-none"
              />
            </div>
          </div>
          {loading && (
            <div className="space-y-2">
              <p className="font-04b_19 text-center text-sm text-darkOrange">
                {currentAction}
              </p>
              <div className="h-3 border-2 border-darkOrange/40 bg-darkOrange-bg">
                <div 
                  className="h-full bg-darkOrange transition-all duration-300" 
                  style={{ width: `${loadingPercentage}%` }}
                />
              </div>
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="font-04b_19 h-11 w-full rounded-none border-2 border-darkOrange/40 bg-orange-gradient text-sm sm:text-base text-white transition-all hover:opacity-90 disabled:opacity-30"
          >
            LAUNCH IT NOW
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
