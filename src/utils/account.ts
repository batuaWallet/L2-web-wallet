import { Wallet, utils, Contract, BigNumber } from 'ethers';
import * as sigUtil from 'eth-sig-util';

import * as config from '../config.json';
import { domainData, domainType, metaTransactionType } from '../types';

const abi = require('../contracts/Rocket.json').abi;
const IRocketContract = new utils.Interface(abi);

export const balance = async (address: string, token: string, client: any) => {
  if (!(address && token && client)) {
    return '0';
  }
  try {
    return (utils.formatUnits(await client.balanceOfERC20(address, token, {}), 1))
  } catch (e) {
    console.log(e);
    return '0';
  }
};

export const send = async (wallet: Wallet, biconomyProvider: any) => {
  if (!(wallet && biconomyProvider)) return Error;

  const RocketContract = new Contract(config.posChildERC20, abi, biconomyProvider);
  const functionSignature = IRocketContract.encodeFunctionData('transfer', ['0x0B510F42fF8497254B006C2Ae9c85B3F831f052E', BigNumber.from('1')]);
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

  console.log(utils.keccak256(utils.toUtf8Bytes(JSON.stringify(dataToSign))));
  directSend(wallet, functionSignature, sigParams);
};



const directSend = (wallet: Wallet, functionSignature: string, sigParams: any) => {
  try {
          fetch(`https://api.biconomy.io/api/v2/meta-tx/native`, {
            method: "POST",
            headers: {
              "x-api-key" : "PHObqJvg2.478df731-9031-4d8a-84a9-620c09d87c9f",
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
              "to": config.posChildERC20,
              "apiId": "ca603f21-1286-40f0-b8a7-61b54fe0dccf",
              "params": [
                wallet.address, functionSignature, sigParams.r, sigParams.s, sigParams.v
              ],
              "from": wallet.address
            })
          })
          .then(console.log)
          .then(function(result) {
            console.log(result);
          })
          .catch(function(error) {
            console.log(error)
          });
        } catch (error) {
          console.log(error);
        }
}
