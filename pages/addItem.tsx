/* eslint-disable @next/next/no-img-element */
import { useContract, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import Header from "../components/Header";

type Props = {};

function AddItem({}: Props) {
  const address = useAddress();
  const router = useRouter();
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_NFT_COLLECTION,
    "nft-collection"
  );

  const mintNFT = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contract || !address) return;

    if (!image) {
      alert("please select image");
      return;
    }

    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image,
    };

    try {
      const tx = await contract.mintTo(address, metadata);
      const receipt = tx.receipt;
      const tokenId = tx.id;
      const nft = await tx.data();
      console.log(receipt, tokenId, nft);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-18 border">
        <h1 className="text-4xl font-bold">add item to market place</h1>
        <h2 className="text-xl font-semibold pt-5">item Details</h2>
        <p className="pb-5">by adding item means minting NFT</p>

        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-10">
          <img
            className="border h-80 w-80 object-contain"
            src={preview || "https://links.papareact.com/ucj"}
            alt="item image"
          />

          <form
            onSubmit={mintNFT}
            className="flex flex-col flex-1 p-2 space-y-2 "
          >
            <label className="font-light">Name of Item</label>
            <input
              className="form-filed"
              placeholder="name of item ......"
              type="text"
              name="name"
              id="name"
            />

            <label className="font-light">Description</label>
            <input
              className="form-filed"
              placeholder="Enter Description ......"
              type="text"
              name="description"
              id="description"
            />

            <label className="font-light">Image of the Item</label>
            <input
              className=""
              placeholder="Image ......"
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreview(URL.createObjectURL(e.target.files?.[0]));
                  setImage(e.target.files[0]);
                }
              }}
            />

            <button className="bg-blue-600 text-white rounded-full py-4 px-10 w-56 font-bold md:mt-auto mx-auto md:ml-auto hover:bg-blue-900 ">
              add/Mint
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddItem;
