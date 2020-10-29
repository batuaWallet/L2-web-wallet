export const MUMBAI_EXPLORER = "https://mumbai-explorer.matic.today";

export const BICONOMY_API_URI = "https://api.biconomy.io/api/v2/meta-tx/native";

export const API_KEY = process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "";

export const API_ID = process.env.REACT_APP_API_ID ? process.env.REACT_APP_API_ID : "";

export const ADDRESS_WETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
export const ChildRSA = "0xa360146B76D95D7911b415018Cce125ad50AEF7C";
export const RSA = "0xB8587429a235dc366bF83Eb171AE90775Eb60f26";
export const MATIC_RPC = "https://rpc-mumbai.matic.today";
export const ETHEREUM_RPC = `https://goerli.infura.io/v3/${process.env.REACT_APP_PROJECT_ID}`;
export const posERC20Predicate = "0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34";
export const posRootChainManager = "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74";
export const VERSION = "mumbai";
export const NETWORK = "testnet";
export const MATIC_CHAINID = 80001;

export const walletSecretFYI = [
  "A protection key for your wallet in case of any theft or recovery. Without this key, you won’t be able to recover your wallet",
  "This key should be kept private since anyone with this key would be able to access your wallet",
  "To save this key, write it on a peice of paper and keep it safely or use tools like “LastPass” or “1Password”"
];

export const domainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" }
  ];

export const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
  { name: "functionSignature", type: "bytes" }
];

export const domainData = {
  name: "DAI",
  version: "1",
  chainId: 80001,
  verifyingContract: "0xa360146B76D95D7911b415018Cce125ad50AEF7C"
};
