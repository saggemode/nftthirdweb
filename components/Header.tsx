import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import React from "react";

import {
  BellIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = {};

function Header({}: Props) {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className="max-w-6xl mx-auto p-2">
      <nav className="flex justify-between">
        <div className="flex items-center space-x-2 text-sm">
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn">
              hi, {address.slice(0, 5) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button onClick={connectWithMetamask} className="connectWalletBtn">
              Connect wallet
            </button>
          )}

          <p className="headerLink">Daily Deals</p>
          <p className="headerLink">Help & Control</p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <p className="headerLink">ship to</p>
          <p className="headerLink">sell</p>
          <p className="headerLink">WatchList</p>

          <Link href="/addItem" className="flex items-center hover:link">
            add to invetory
            <ChevronDownIcon className="h-4" />
          </Link>

          <BellIcon className="h-4" />
          <ShoppingCartIcon className="h-4" />
        </div>
      </nav>

      <hr className="mt-2" />

      <section className="flex items-center space-x-2 py-5">
        <div className="h-16 w-16 sm:w-28 md:w-44 cursor-pointer flex-shrink-0">
          <Link href="/">
            <Image
              className="h-full w-full object-contain"
              alt="thirdwird"
              src="https://links.papareact.com/bdb"
              width={100}
              height={100}
            />
          </Link>
        </div>

        <button className="hidden lg:flex items-center space-x-2 w-20">
          <p>Shop by Category</p>
          <ChevronDownIcon className="h-4 flex-shrink-0" />
        </button>

        <div className="flex items-center space-x-2 md:px-5 py-2 border-black border-2 flex-1">
          <MagnifyingGlassIcon className="w-5 text-grey-400" />
          <input
            className="flex-1 outline-none"
            placeholder="search for anything"
            type="text"
          />
        </div>
        <button className="hidden sm:inline bg-blue-600 text-white px-5 md:px-10 py-2 border-2 border-blue-600">
          Search
        </button>

        <Link href="/create">
          <button className="border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer">
            List Item
          </button>
        </Link>
      </section>

      <section className="flex py-3 space-x-2 text-xs md:text-sm whitespace-nowrap justify-center px-6">
        <p className="link">Home</p>
        <p className="link">Electronics</p>
        <p className="link">Video Game</p>
        <p className="link sm:inline">Video</p>
        <p className="link sm:inline">Home & Garden</p>
        <p className="link md:inline">Collectibles ad Arts</p>
        <p className="link lg:inline">Beauty</p>
        <p className="link lg:inline">Health</p>
        <p className="link lg:inline">Books</p>
        <p className="link lg:inline">Music</p>
        <p className="link xl:inline">Deals</p>
        <p className="link xl:inline">other</p>
      </section>
    </div>
  );
}

export default Header;
