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
  name: "MetaToken",
  version: "1",
  chainId: 80001,
  verifyingContract: "0xabC7eb97baE5fEa8b789E0609713830E086FF36E"
};
