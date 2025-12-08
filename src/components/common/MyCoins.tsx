import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "../ui/dialog";
import EditCoin from "../tokenDetails/EditCoin";
import { Card } from "../ui/card";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { User, XIcon } from "lucide-react";

const MyCoins = () => {
  const { address } = useWeb3ModalAccount();
  const GetuserTokens = api.token.getUserTokens.useQuery({
    userAddress: address!,
  }).data;
  const router = useRouter();
  const handleRoute = (link: string) => {
    router.push(link);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="connect" 
          size="sm" 
          className="rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg text-darkOrange hover:bg-darkOrange hover:text-white"
        >
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95%] max-w-3xl rounded-none border-2 border-darkOrange/40 bg-[#111111] p-0 sm:w-[90%] md:w-4/5 lg:w-3/4">
        <div className="relative w-full border-b-2 border-darkOrange/40 bg-darkOrange-bg p-3 sm:p-4">
          <DialogClose className="absolute right-3 top-1/2 -translate-y-1/2 sm:right-4">
            <Button
              variant="closeIcon"
              size="icon"
              className="h-5 w-5 rounded-none bg-transparent p-0 text-darkOrange hover:bg-transparent hover:text-darkOrange/80 sm:h-6 sm:w-6"
            >
              <XIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          <h2 className="font-04b_19 text-center text-lg text-darkOrange sm:text-xl md:text-2xl">
            MY COINS
          </h2>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          {GetuserTokens && GetuserTokens.length === 0 ? (
            <div className="rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg p-6 text-center sm:p-8">
              <p className="font-04b_19 text-base text-white/60 sm:text-lg">
                No coins found
              </p>
              <p className="mt-2 font-mono text-xs text-darkOrange sm:mt-3 sm:text-sm">
                Create your first coin to get started!
              </p>
            </div>
          ) : (
            <div className="custom-scrollbar h-[50vh] space-y-3 overflow-y-auto pr-2 sm:h-[60vh] sm:space-y-4 md:h-[70vh]">
              {GetuserTokens?.map((token, id) => (
                <Card 
                  key={id} 
                  className="group rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg p-3 transition-all duration-200 hover:border-darkOrange/60 sm:p-4"
                >
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-none border-2 border-darkOrange/40 bg-darkOrange/5 sm:h-24 sm:w-24 md:h-32 md:w-32">
                      <img
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                        src={token.image}
                        alt={token.name}
                      />
                    </div>

                    <div className="flex flex-1 flex-col items-center gap-3 sm:items-start sm:gap-4">
                      <div className="text-center sm:text-left">
                        <h3 className="font-04b_19 text-base text-white/90 group-hover:text-white sm:text-lg md:text-xl">
                          {token.name}
                        </h3>
                        <p className="mt-1 font-mono text-xs text-white/60 sm:text-sm">
                          {token.tokenAddress.slice(0, 6)}...{token.tokenAddress.slice(-4)}
                        </p>
                      </div>

                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3 md:gap-4">
                        <Button
                          variant="connect"
                          className="h-8 w-full rounded-none border-2 border-darkOrange/40 bg-darkOrange-bg px-3 font-04b_19 text-xs text-darkOrange hover:bg-darkOrange hover:text-white sm:h-9 sm:w-auto sm:text-sm md:h-10 md:px-4"
                          onClick={() => handleRoute(`/token/${token.tokenAddress}`)}
                        >
                          VIEW TOKEN
                        </Button>
                        <div className="w-full sm:w-auto">
                          <EditCoin id={token.id} token={token.name} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyCoins;
