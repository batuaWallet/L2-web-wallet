import ethers from "ethers";

export const balance = async (address: string, token: string, client: any) => {
  try {
    const bal = ethers.utils.formatUnits(
      await client.balanceOfERC20(
        address,
        token,
        {}
    ));
    console.log(balance);
    return bal;
  } catch (e) {
    console.log(e);
    return "0";
  }
};

export const send = async (wallet: any) => {
  if (!wallet) return Error;
  console.log("Sending");
  let txParams = {
    "from": wallet.address,
    "gasLimit": ethers.utils.hexlify(210000),
    "to": "0x0B510F42fF8497254B006C2Ae9c85B3F831f052E",
    "value": ethers.utils.parseEther("0.01"),
  };
  const receipt = await wallet.sendTransaction(txParams);
  console.log(receipt);
};
