import { AddressZero, HashZero, Zero } from "@ethersproject/constants";
import { formatEther, parseEther } from "@ethersproject/units";
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

const ethToWeth = async (amt: BigNumber, wallet: Wallet): Promise<boolean> => {
  const wethWithSigner = weth.connect(wallet);
  const tx =  await wethWithSigner.deposit({ value: amt });
  console.log(`Wrapping ${formatEther(amt)} ETH to WETH via tx ${tx.hash}`);
  await tx.wait();
  console.log(`WETH wrap tx was confirmed!`);
  return true;
}

const wethToSkr = async (amt: BigNumber, wallet: Wallet): Promise<boolean> => {
  try {
    const approved = await weth.allowance(wallet.address, ADDRESS_TUB);
    if (approved.eq(Zero)) {
      const wethWithSigner = weth.connect(wallet);
      const tx = await wethWithSigner.approve(ADDRESS_TUB, constants.MaxUint256);
      console.log(`Approving a bunch of WETH via tx ${tx.hash}`);
      await tx.wait();
      console.log(`WETH approval tx was confirmed!`);
    }
    const tubWithSigner = tub.connect(wallet);
    const tx = await tubWithSigner.join(amt);
    console.log(`Joining ${formatEther(amt)} WETH to SKR via tx ${tx.hash}`);
    await tx.wait();
    console.log(`SKR join tx was confirmed!`);
    return true;
  }
  catch (e) {
    console.log(e)
  }
  return false;
};

const lockSkr = async (amt: BigNumber, wallet: Wallet, cup: string): Promise<boolean> => {
  if (!cup) return false;
  try {
    const approved = await skr.allowance(wallet.address, ADDRESS_TUB);
    if (approved.eq(Zero)) {
      const skrWithSigner = skr.connect(wallet);
      const tx = await skrWithSigner["approve(address)"](ADDRESS_TUB);
      console.log(`Approving a bunch of SKR via tx ${tx.hash}`);
      await tx.wait();
      console.log(`SKR approval tx was confirmed!`);
    }
    const tubWithSigner = tub.connect(wallet);
    const tx = await tubWithSigner.lock(cup, amt);
    console.log(`Locking ${formatEther(amt)} SKR via tx ${tx.hash}`);
    await tx.wait();
    console.log(`ETH lock tx was confirmed!`);
    return true;
  } catch (e) {
    console.log(e)
  }
  return false;
};

const openCDP = async (wallet: Wallet) => {
  const tubWithSigner = tub.connect(wallet);
  const tx = await tubWithSigner.open();
  console.log(`Opening a new CDP for ${wallet.address} via tx ${tx.hash}`);
  console.log(tx);
  const receipt = await tx.wait();
  tub.on("LogNewCup", (res) => {
    console.log(res);
  });
  console.log(receipt);
};

export const lockInCDP = async (wallet: Wallet, amountStr: string) => {
  const amount = parseEther(amountStr);
  if (!wallet) return false;
  let w = wallet.connect(providerRoot);
  try {
    const skrBalance = await skr.balanceOf(wallet.address);
    if (skrBalance.lt(amount)) {

      const wethBalance = await weth.balanceOf(wallet.address);
      if (wethBalance.lt(amount)) {

        const ethBalance = await providerRoot.getBalance(wallet.address);
        if (ethBalance.lt(amount)) { return false };
        const receipt = await ethToWeth(amount.sub(wethBalance), w);
        if (!receipt){ return false; }
      }

      const receipt = await wethToSkr(amount.sub(skrBalance), w);
      if (!receipt){ return false; }
    }

    let cdp = await findCDP(wallet.address);
    if (cdp === HashZero){
      await openCDP(w);
      cdp = await findCDP(wallet.address);
    }
    if (cdp) {
      const receipt = await lockSkr(amount, w, cdp);
      if (!receipt){ return false; }
    }
  }
  catch (e) {
    console.log(e);
  }
  return true;
};


export const mintRSA = async (wallet: Wallet, amtStr: string): Promise<boolean> => {
  const amt = parseEther(amtStr);
  if (!wallet) return false;

  let w = wallet.connect(providerRoot);
  let cup = await findCDP(wallet.address);
  try {
    if (cup) {
      const tubWithSigner = tub.connect(w);
      const tx = await tubWithSigner.draw(
        cup,
        amt,
        { gasLimit: utils.parseUnits("7", 6) }
      );
      console.log(`Minting ${formatEther(amt)} RSA via tx ${tx.hash}`);
      await tx.wait();
      console.log(`RSA mint tx was confirmed!`);
      return true;
    }
  }
  catch (e) {
    console.log(e)
  }
  return false
};
