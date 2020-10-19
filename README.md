# Overview

This repository contains codebase and instructions for a React application, which serves a web application to an end user.

When loaded, this web application will:

- create an ethereum wallet
- persist the wallet in local browser storage
- display wallet information
  - public address - where user can receive Ethereum-based cryptocurrency
  - wallet mnemonic - 24 words used to generate public/private keypair
  - current balance - in a pre-configured ERC20 token
- allow user to choose to send the pre-configured ERC20 token

The wallet is hardcoded to connect to [Matic's PoS Mumbai testnet](https://mumbai-explorer.matic.today/) for retrieving balance and publishing transactions. Balance shown is the balance of a synthesised Indian Rupee Stablecoin, whose token contract address can be found in [src/config.json](/src/config.json).

When `transfer` transactions are sent, they are signed locally in the app, and then send to a [Biconomy](https://www.biconomy.com/) MetaTX relayer, which publishes the transaction and pays the gas / fees.

## How to use

### Pre-requisites

In order to use these instructions, you must have the following installed on a Linux or Mac:

- `npm` - see the [get npm page](https://www.npmjs.com/get-npm)
- `jq` - see [this page](https://stedolan.github.io/jq/) to get `jq`
- `git`

### Get the code

Run the following commands to clone this repository, then change to the repo's home directory:
```
git clone https://github.com/batuaWallet/L2-web-wallet.git
cd L2-web-wallet
```

### Install dependencies

Run the following to install the dependencies:
```
npm install
```

### Configure Biconomy

1. Signup for an account on [Biconomy's dashboard](https://dashboard.biconomy.io/signup). You will need to click "Verify Now" in your Biconomy dashboard, then follow the instructions in your email to enter the OTP, in order to verify your account. Once you have completed the email verification, log in to your Biconomy dashboard:

![image](https://user-images.githubusercontent.com/2212651/96404754-4c537980-11f9-11eb-9471-9deb4001fc94.png)

2. Click `+Register` to register a new Dapp, ensuring that you choose "Matic Testnet (Mumbai)" as the network:

![image](https://user-images.githubusercontent.com/2212651/96404842-8c1a6100-11f9-11eb-9a99-7e8c0cdfe094.png)

3. Make a note of the `Api Key` for the Dapp, as this will be required by the app to authenticate with Biconomy, and looks something like this: `nWLPpVVm1.ddc9aeb0-198f-4910-8367-6ab40bc5066c`

4. Click "View Dapp", and next to "Smart Contracts", click `+ Add Contract`:

![image](https://user-images.githubusercontent.com/2212651/96405434-e536c480-11fa-11eb-9f6f-251fda9f8795.png)

- For "Name", you can choose any name you like
- For "Address", choose the contract address of the token contract
  - This is configured in [src/config.json](/src/config.json) under 
- To generate the "Application Binary Interface (ABI) run the following command, and copy / paste the output:
```
cat src/contracts/Rocket.json | jq .abi
```

Once you have completed all sections, click "Add", which will return you to the dashboard.

5. Click "Manage APIs" and then select "+ New API"

![image](https://user-images.githubusercontent.com/2212651/96405970-119f1080-11fc-11eb-9d3b-85764250d271.png)

- Select the smart contract added in the previous step
- Select "ExecuteMetaTransaction" method
- For "Name", you can choose any name you like
- Click "Enable" to "Native MetaTX"

Once the details have been completed, you must first click "+ Add" and then "Save"

6. Once the new API has been saved, make a note of the `Api Id`, which looks something like this: `623e01fe-c917-4dd1-9c89-4683489b4888`

## Configure the code with Biconomy Ids

1. Copy `example.env` to `.env`, perhaps by running `cp example.env .env`

2. Open `.env` using your favourite text editor, and update the values as follows:

- `REACT_APP_API_ID` should be the `Api Id` from step 6 of the section entitled **Configure Biconomy**.
- `REACT_APP_API_KEY` should be the `Api Key` from step 3 of the section entitled **Configure Biconomy**.

## Run the app

Run the following command from this repo's home directory:
```
npm start
```
This will open a browser tab, and load http://localhost:3000/
