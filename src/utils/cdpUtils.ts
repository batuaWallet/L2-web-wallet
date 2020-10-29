import { Wallet, utils, constants, Contract, providers } from "ethers";

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


const findCDP = async (address: string) => {
  try {
    let cdp = cache.getItem("cdp");
    if (cdp) return cdp;

    const cdpi = (await tub.cupi()).toNumber();
    for (let i = 1; i <= cdpi; i++){
      cdp = utils.hexZeroPad(utils.hexValue(i), 32);
      let owner = (await tub.cups(cdp)).lad;
      if (owner.toLowerCase() === address.toLowerCase()) {
        break;
      }
    }

    if (cdp)
      cache.setItem("cdp", cdp);

    return cdp;
  }
  catch (e) {
    console.log(e)
  }
  
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
    if (!cdp){
      await openCDP(w);
      cdp = await findCDP(wallet.address);
    }

    if (cdp) {
      const receipt = await lockSkr("0.1", w, cdp);
    }
  }
  catch (e) {
    console.log(e);
  }
  return true;
};


const mintRSA = async () => {
  /*
    const drawAmt = BigNumber.from(inrPerEth).mul(depositAmount).div(Two);
    await (await tub.draw(cup, drawAmt, { gasLimit: parseUnits("50", 6) })).wait();
  */
};
