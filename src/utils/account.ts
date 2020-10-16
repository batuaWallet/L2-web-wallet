import { Wallet, utils, Contract, BigNumber, providers } from 'ethers';
import * as sigUtil from 'eth-sig-util';

import * as config from '../config.json';
import { domainData, domainType, metaTransactionType } from '../types';
import { dummyTo, API_ID, API_KEY, BICONOMY_API_URI } from './constants';

const abi = require('../contracts/Rocket.json').abi;
const IRocketContract = new utils.Interface(abi);
const provider = new providers.JsonRpcProvider(config.MATIC_RPC);
const RocketContract = new Contract(config.dummyERC20, abi, provider);

export const balance = async (address: string, client: any) => {
  if (!(address && client)) {
    return '0';
  }
  try {
    return (utils.formatUnits(await client.balanceOfERC20(address, config.dummyERC20, {}), 1))
  } catch (e) {
    console.log(e);
    return '0';
  }
};

export const send = async (wallet: Wallet) => {
  if (!(wallet)) return Error;

  const to = dummyTo;
  const functionSignature = IRocketContract.encodeFunctionData('transfer', [to, BigNumber.from('10000')]);
  console.log(`Set function sig: ${functionSignature}`);

  console.log(`Fetching nonce`);
  const nonce = (await RocketContract.getNonce(wallet.address)).toNumber();
  console.log(`Got nonce: ${nonce}`);

  const message = {
    nonce,
    from: wallet.address,
    functionSignature
  };

  const dataToSign = {
    types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType
      },
    domain: domainData,
    primaryType: 'MetaTransaction' as const,
    message: message
  };

  const signedMsg = sigUtil.signTypedData_v4(Buffer.from(wallet.privateKey.slice(2,66), 'hex'), { data: dataToSign});


  const sigParams = utils.splitSignature(signedMsg);
  console.log(sigParams.r,sigParams.s,sigParams.v);

  const recovered = sigUtil.recoverTypedSignature_v4({
    data: dataToSign,
    sig: signedMsg
  });
  console.log(`Recovered = ${recovered}`);

  postToBcnmy(wallet, functionSignature, sigParams);
};

const postToBcnmy = async (wallet: Wallet, functionSignature: string, sigParams: any) => {
  try {
    const result = await fetch(BICONOMY_API_URI, {
      method: "POST",
      headers: {
        "x-api-key" : API_KEY,
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        "to": config.dummyERC20,
        "apiId": API_ID,
        "params": [
          wallet.address, functionSignature, sigParams.r, sigParams.s, sigParams.v
        ],
        "from": wallet.address
      })
    });

    if (result.status !== 200)
        console.log(result)
  } catch (error) {
    console.log(error);
  }
}
