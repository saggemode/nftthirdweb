import React, { FormEvent, useState } from "react";
import Header from "../components/Header";
import {
  useContract,
  useAddress,
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
  useListing
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import {
  ChainId,
  NFT,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
} from "@thirdweb-dev/sdk";
import network from "../utils/network";

type Props = {};

function Create({}: Props) {
  const address = useAddress();
  const router = useRouter();

  const [selectedNft, setSelectedNft] = useState<NFT>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKET,
    "marketplace"
  );

  const { contract: collection } = useContract(
    process.env.NEXT_PUBLIC_NFT_COLLECTION,
    "nft-collection"
  );

  const ownedNFTs = useOwnedNFTs(collection, address);

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const {
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: isLoadingDirect,
    error: errorDirect,
  } = useCreateAuctionListing(contract); 

  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!selectedNft) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_NFT_COLLECTION!,
          buyoutPricePerToken: price.value,
          tokenId: selectedNft.metadata.id,
          startTimestamp: new Date(),
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
        },
        {
          onSuccess(data, variables, context) {
            console.log("success: ", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("Error: ", error, variables, context);
          },
        }
      );
    }

    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_NFT_COLLECTION!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log("success: ", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("Error: ", error, variables, context);
          },
        }
      );
    }
  };
  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-10 pt-2">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold">Select an Item to sell</h2>

        <hr className="mb-5" />

        <p>below is owned nft</p>

        <div className="flex overflow-x-scroll space-x-2 p-4">
          {ownedNFTs.data?.map((nft) => (
            <div
              key={nft.metadata.id}
              onClick={() => setSelectedNft(nft)}
              className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-100 ${
                nft.metadata.id === selectedNft?.metadata.id
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <MediaRenderer
                src={nft.metadata.image}
                className="h-48 rounded-lg"
              />
              <p className="text-lg truncate font-bold">{nft.metadata.name}</p>
              <p className="text-xs truncate">{nft.metadata.description}</p>
            </div>
          ))}
        </div>

        {selectedNft && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-5">
                <label className="border-r font-light">
                  Direct Listing / Fixed Price
                </label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="directListing"
                />

                <label className="border-r font-light">Auction</label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="auctionListing"
                />

                <label className="border-r font-light" htmlFor="price">
                  Price
                </label>
                <input
                  className="bg-gray-100"
                  name="price"
                  placeholder="0.05"
                 
                
                />
              </div>
              <button
                className="bg-blue-600 text-white rounded-lg p-4 mt-8"
                type="submit"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default Create;
