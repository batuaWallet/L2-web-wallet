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


export const typedData = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Person: [
        { name: 'name', type: 'string' },
        { name: 'mother', type: 'Person' },
        { name: 'father', type: 'Person' },
      ],
    },
    domain: {
      name: 'Family Tree',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    primaryType: 'Person' as const,
    message: {
      name: 'Jon',
      mother: {
        name: 'Lyanna',
        father: {
          name: 'Rickard',
        },
      },
      father: {
        name: 'Rhaegar',
        father: {
          name: 'Aeris II',
        },
      },
    },
  };
