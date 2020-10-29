import { Wallet, utils, Contract, providers } from "ethers";
import * as sigUtil from "eth-sig-util";

import {
  API_ID,
  API_KEY,
  BICONOMY_API_URI,
  ChildRSA,
  ETHEREUM_RPC,
  MATIC_RPC,
  RSA,
  EIP712Domain,
  MetaTransaction,
  eip712Domain as domain,
  posERC20Predicate,
  posRootChainManager
} from "./constants";

const provider = new providers.JsonRpcProvider(MATIC_RPC);
const providerRoot = new providers.JsonRpcProvider(ETHEREUM_RPC);

const ChildRSAabi = require("../contracts/ChildRSA.json").abi;
const RootChainManagerAbi = require("../contracts/RootChainManager").abi;
const RSAabi = require("../contracts/DSToken").abi;

const RSAcontract = new Contract(RSA, RSAabi, providerRoot);
const ChildRSAcontract = new Contract(ChildRSA, ChildRSAabi, provider);

const IChildRSA = new utils.Interface(ChildRSAabi);

export const approveForDeposit = async (wallet: Wallet) => {
  const approved = Number(utils.formatUnits(
    await RSAcontract.allowance(wallet.address, posERC20Predicate),
    18
  ))
  console.log(approved);
  if (approved === 0) {
    console.log("Approving");
    const w = wallet.connect(providerRoot)
    const RSAsigner = new Contract(RSA, RSAabi, w);
    const res = await RSAsigner["approve(address)"](posERC20Predicate);
    console.log(res);
  }
  return approved;
};

export const depositERC20toMatic = async (wallet: Wallet, amount: string) => {
  try {
    let w = wallet.connect(providerRoot)
    const RootChainManager = new Contract(
      posRootChainManager,
      RootChainManagerAbi,
      w
    );
    
    const res = await RootChainManager.depositFor(
      wallet.address,
      RSA,
      utils.defaultAbiCoder.encode(['uint256'], [utils.parseEther(amount)])
    );
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export const getRSABalance = async (address: string) => {
  if (address) {
    try {
      return Number(utils.formatUnits( await RSAcontract.balanceOf(address), 18) || 0);
    } catch (e) {
      console.log(e);
    }
  }
  return 0;
};

export const balance = async (address: string, client: any) => {
  if (address && client) {
    try {
      return Number(utils.formatUnits(await client.balanceOfERC20(address, ChildRSA, {}), 18) || 0);
    } catch (e) {
      console.log(e);
    }
  }
  return 0;
};

export const send = async (wallet: Wallet, to: string, amt: string) => {
  if (!wallet) throw new Error("wallet required");

  const functionSignature = IChildRSA.encodeFunctionData('transfer', [to, utils.parseEther(amt)]);
  const nonce = (await ChildRSAcontract.getNonce(wallet.address)).toNumber();

  const metaTransaction = {
    nonce,
    from: wallet.address,
    functionSignature
  };
  console.log(`Sending metaTransaction: ${JSON.stringify(metaTransaction, null, 2)}`);

  const dataToSign = {
    types: { EIP712Domain, MetaTransaction },
    domain,
    primaryType: 'MetaTransaction' as const,
    message: metaTransaction
  };

  const signedMsg = sigUtil.signTypedData_v4(Buffer.from(wallet.privateKey.slice(2,66), 'hex'), { data: dataToSign});

  const sigParams = utils.splitSignature(signedMsg);

  // const recovered = sigUtil.recoverTypedSignature_v4({ data: dataToSign, sig: signedMsg });
  // console.log(`Recovered ${recovered}`);

  return postToBcnmy(wallet, functionSignature, sigParams);
};

const postToBcnmy = async (wallet: Wallet, functionSignature: string, sigParams: any) => {
  try {
    const response = await fetch(BICONOMY_API_URI, {
      method: "POST",
      headers: {
        "x-api-key" : API_KEY,
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        "to": ChildRSA,
        "apiId": API_ID,
        "params": [
          wallet.address, functionSignature, sigParams.r, sigParams.s, sigParams.v
        ],
        "from": wallet.address
      })
    });

    if (response.status !== 200) {
        console.log(response)
    } else {
      return (response.json());
    }
  } catch (error) {
    console.log(error);
  }
}
