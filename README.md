# L2-web-wallet

This app creates and stores ethereum wallet in local storage. Displays wallet info - public address, wallet mnemonic and current balance.

Wallet connects to [PoS Matic testnet](https://mumbai-explorer.matic.today/)

Balance shown is the balance of (PoS) Test ERC20 you can get some tokens to play with from [Matic Faucet](https://faucet.matic.network/)
  - token: (PoS) Test ERC20
  - Network: Mumbai

## How to use

  Clone Repo
  
  ```
  git clone https://github.com/batuaWallet/L2-web-wallet.git
  cd L2-web-wallet
  ```

  Install dependencies

  ```
  npm install
  ```

  Register app on [Biconomy](https://docs.biconomy.io/biconomy-dashboard) and add your own contract with metatx-enabled or use the one deployed for this app's development. 

  Latest dev erc20 contract is in `src`

    - Contract Address: in `/config.json` -> `dummyERC20`
    - Contract ABI: in `contracts/Rocket.json`

  Start on localhost

  Update `APP_ID` and `API_KEY` from biconomy dashboard in `.env` file. Refer `example.env`

  ```
  echo REACT_APP_API_ID="biconomy-contract-api-id"
  echo REACT_APP_API_KEY="biconomy-api-key" >> example.env

  ```

  ```
  npm start
  ```
