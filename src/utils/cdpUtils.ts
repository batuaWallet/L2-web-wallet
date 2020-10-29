import { AddressZero, HashZero, Zero } from "@ethersproject/constants";
import { BigNumber, Wallet, utils, constants, Contract, providers } from "ethers";

import {
  ADDRESS_WETH,
  ADDRESS_SKR,
  ADDRESS_TUB,
  ETHEREUM_RPC,
} from "./constants";
const cache = window.localStorage;

const providerRoot = new providers.JsonRpcProvider(ETHEREUM_RPC);

const wethAbi = require("../contracts/weth.json").abi;
const tubAbi = require("../contracts/Tub.json").abi;
const DSTokenAbi = require("../contracts/DSToken.json").abi;

const weth = new Contract(ADDRESS_WETH, wethAbi, providerRoot);
const skr = new Contract(ADDRESS_SKR, DSTokenAbi, providerRoot);
const tub = new Contract(ADDRESS_TUB, tubAbi, providerRoot);

type CDP = {
  lad: string;
  ink: BigNumber;
  art: BigNumber;
  ire: BigNumber;
}

export const getCDP = async (address: string): Promise<CDP> => {
  const cdpi = await findCDP(address);
  if (cdpi === HashZero) {
    console.log(`No CDP found for ${address}`);
    return { lad: AddressZero, ink: Zero, art: Zero, ire: Zero };
  }
  const cdpArray = await tub.cups(cdpi);
  const cdp = {
    lad: cdpArray[0],
    ink: cdpArray[1],
    art: cdpArray[2],
    ire: cdpArray[3],
  };
  console.log(`Got info for cdp ${cdpi}: ${JSON.stringify(cdp, null, 2)}`);
  return cdp;
}

const ethToWeth = async (amt: string, wallet: Wallet) => {
  console.log(`depositing ${amt} weth`);
  const wethWithSigner = weth.connect(wallet);
  const tx =  await wethWithSigner.deposit({ value: utils.parseEther(amt) });
  const rct = tx.wait();
  return rct;
}


const wethToSkr = async (amt: string, wallet: Wallet) => {
  try {
    const approved = utils.formatUnits(
      await weth.allowance(wallet.address, ADDRESS_TUB),
      18
    );

    if (approved === "0.0") {
      console.log("Approving");
      const wethWithSigner = weth.connect(wallet);
      const tx = await wethWithSigner.approve(ADDRESS_TUB, constants.MaxUint256);
      const rct = await tx.wait();
      console.log(rct);
    }

    console.log("Minting skr");
    const tubWithSigner = tub.connect(wallet);
    const tx = await tubWithSigner.join(utils.parseEther(amt));
    const rct = await tx.wait();
    console.log(rct);
    return rct;
  }
  catch (e) {
    console.log(e)
  }
  
  return null;
};

const findCDP = async (address: string): Promise<string> => {
  let myCdp = HashZero;
  try {
    let cdp = cache.getItem("cdp");
    if (cdp) { return cdp; }
    const cdpi = (await tub.cupi()).toNumber();
    for (let i = cdpi; i >= 0; i--){
      if (i === 0) return myCdp;
      cdp = utils.hexZeroPad(utils.hexValue(i), 32);
      let owner = (await tub.cups(cdp)).lad;
      console.log(`Checking owner of cdp ${i}: ${owner}`);
      if (owner.toLowerCase() === address.toLowerCase()) {
        myCdp = cdp;
        break;
      }
    }
    if (myCdp !== HashZero) {
      cache.setItem("cdp", myCdp);
    }
    return myCdp;
  }
  catch (e) {
    console.log(e)
  }
  return myCdp;
};

const lockSkr = async (amt: string, wallet: Wallet, cup: string) => {
  if (!cup) return null;
  try {
    const approved = utils.formatUnits(
      await skr.allowance(wallet.address, ADDRESS_TUB),
      18
    );

    console.log(approved);
    if (approved === "0.0") {
      console.log("Approving");
      const skrWithSigner = skr.connect(wallet);
      const tx = await skrWithSigner["approve(address)"](ADDRESS_TUB);
      const rct = await tx.wait();
      console.log(rct);
    }

    console.log("Locking skr");
    const tubWithSigner = tub.connect(wallet);
    const tx = await tubWithSigner.lock(cup, utils.parseEther(amt));
    const rct = await tx.wait();
    console.log(rct);
    return rct;

  }
  catch (e) {
    console.log(e)
  }

};

const openCDP = async (wallet: Wallet) => {
  /*
  (await tub.open()).wait();
  */
    console.log("Opening CDP");
    const tubWithSigner = tub.connect(wallet);
    const tx = await tubWithSigner.open();
    const rct = await tx.wait();

    tub.on("LogNewCup", (res) => {
      console.log(res);
    });
    console.log(rct);
};

export const lockInCDP = async (wallet: Wallet) => {
  if (!wallet) return false;
  let w = wallet.connect(providerRoot);
  try {
    const skrBalance = utils.formatUnits( await skr.balanceOf(wallet.address), 18);
    console.log(skrBalance);

    if (skrBalance === "0.0") {
      const wethBalance = utils.formatUnits( await weth.balanceOf(wallet.address), 18);

      if (wethBalance === "0.0") {
        const ethBalance = utils.formatUnits( await providerRoot.getBalance(wallet.address), 18);
        if (ethBalance === "0.0") { return false };
        const receipt = await ethToWeth("0.1", w);
        if (!receipt){ return false; }
      }

      const receipt = await wethToSkr("0.1", w);
      console.log(receipt);

      if (!receipt){ return false; }
    }

    let cdp = await findCDP(wallet.address);
    if (cdp === HashZero){
      await openCDP(w);
      cdp = await findCDP(wallet.address);
    }

    if (cdp) {
      const tx = await lockSkr("0.1", w, cdp);
      console.log(`Sent tx ${tx.hash}`);
    }
  }
  catch (e) {
    console.log(e);
  }
  return true;
};


export const mintRSA = async (wallet: Wallet, amt: string) => {
  if (!wallet) return false;

  let w = wallet.connect(providerRoot);
  let cup = await findCDP(wallet.address);
  try {
    if (cup) {
      const tubWithSigner = tub.connect(w);
      const tx = await tubWithSigner.draw(
        cup,
        utils.parseEther(amt),
        { gasLimit: utils.parseUnits("7", 6) }
      );
      const rct = await tx.wait();
      console.log(rct);
      return rct;
    }
  }
  catch (e) {
    console.log(e)
  }
};
