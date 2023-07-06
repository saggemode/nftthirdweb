import {
  useContract,
  useActiveListings,
  MediaRenderer,
} from "@thirdweb-dev/react";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import { ListingType } from "@thirdweb-dev/sdk";
import React from "react";
import Header from "../components/Header";
import Link from "next/link";

const Home = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKET,
    "marketplace"
  );

  const { data: listings, isLoading: loadingListing } =
    useActiveListings(contract);

  console.log(listings);
  return (
    <div>
      <Header />

      <main>
        {loadingListing ? (
          <p className="text-center animate-pulse text-blue-500">
            Loading listing
          </p>
        ) : (
          <div className="grid grid-col-1 sm:grid-col-2 md:grid-col-3 lg:grid-col-4 gap-5 mx-auto">
            {listings?.map((listing) => (
              <Link href={`/listing/${listing.id}`} key={listing.id} className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out">
                <div >
                  <div className="flex-1 flex flex-col pb-2 items-center">
                    <MediaRenderer className="w-44" src={listing.asset.image} />
                  </div>

                  <div className="pt-2 space-y-4">
                    <div>
                      <h2 className="text-lg truncate">{listing.asset.name}</h2>
                      <hr />
                      <p className="truncate text-sm text-grey-600 mt-2">
                        {listing.asset.description}
                      </p>
                    </div>

                    <p className="">
                      <span className="font-bold mr-1">
                        {listing.buyoutCurrencyValuePerToken.displayValue}
                      </span>
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>

                    <div
                      className={`flex items-center space-x-1 justify-end text-xs border w-fit ml-auto p-2 rounded-lg text-white ${
                        listing.type === ListingType.Direct
                          ? "bg-blue-500"
                          : "bg-red-500"
                      } `}
                    >
                      <p>
                        {listing.type === ListingType.Direct
                          ? "Buy Now"
                          : "Auction"}
                      </p>
                      {listing.type === ListingType.Direct ? (
                        <BanknotesIcon className="h-4" />
                      ) : (
                        <ClockIcon className="h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
