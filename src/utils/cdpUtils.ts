import { Wallet, utils, Contract, providers } from "ethers";

import { ADDRESS_WETH, ETHEREUM_RPC } from "./constants";
const providerRoot = new providers.JsonRpcProvider(ETHEREUM_RPC);

const wethAbi = require("../contracts/weth.json").abi;

let weth = new Contract(ADDRESS_WETH, wethAbi, providerRoot);

const ethToWeth = async () => {
//  (await weth.deposit({ value: depositAmount })).wait();
}


const wethToPeth = async () => {
  // check approval to spend weth by tub
  /*
  await (await weth.approve(tub.address, depositAmount)).wait();
  await (await tub.join(depositAmount)).wait();
  */
};


const lockSkr = async () => {
  // check approval to spend skr by tub
  /*
  await (await skr["approve(address)"](tub.address)).wait();
  const skrBal = await skr.balanceOf(wallet.address);
  */
};

const openCDP = async () => {
  /*
  (await tub.open()).wait();
  */
};

export const lockInCDP = async (wallet: Wallet) => {
  const wethBalance = utils.formatUnits( await weth.balanceOf(wallet.address), 18);
  if (wethBalance === "0.0") {
    const receipt = await ethToWeth();
  }
  return wethBalance;
  /*
  const cupi = await openCDP();
  await wethToSkr();
  await lockPeth();
  await (await tub.lock(cup, skrBal)).wait();
  */
};


const mintRSA = async () => {
  /*
    const drawAmt = BigNumber.from(inrPerEth).mul(depositAmount).div(Two);
    await (await tub.draw(cup, drawAmt, { gasLimit: parseUnits("50", 6) })).wait();
  */
};
