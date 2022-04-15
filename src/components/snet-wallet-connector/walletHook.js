/* eslint-disable import/prefer-default-export */
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Web3Modal from 'web3modal';
import { isNil } from 'lodash';
import store from 'store';
import BigNumber from 'bignumber.js';
import { splitSignature } from '@ethersproject/bytes';
import WalletConnectProvider from '@walletconnect/web3-provider';
import TokenConversionManagerABI from 'singularitynet-bridge/abi/TokenConversionManager.json';
import ERC20TokenABI from '../../contracts/erc20-abi/abi/SingularityNetToken.json';
import { availableBlockchains, blockchainStatusLabels } from '../../utils/ConverterConstants';
import { setBlockchainStatus } from '../../services/redux/slices/blockchain/blockchainSlice';
import paths from '../../router/paths';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
const INFURA_NETWORK_ID = process.env.REACT_APP_INFURA_NETWORK_ID;
const INFURA_NETWORK_NAME = INFURA_NETWORK_ID === '1' ? 'mainnet' : 'ropsten';

let web3 = null;
let provider = null;

const providerOptions = {
  injected: {
    package: null
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_KEY
    }
  }
};

const web3Modal = new Web3Modal({
  network: INFURA_NETWORK_NAME,
  cacheProvider: true,
  providerOptions
});

export const useWalletHook = () => {
  const [address, setWalletAddress] = useState(null);
  const [userSelecteNetworkId, setUserSelectedNetworkId] = useState(null);

  const dispatch = useDispatch();

  const detectNetwork = async () => {
    const networkId = await web3.eth.net.getId();
    setUserSelectedNetworkId(networkId);
    return networkId;
  };

  const getWalletAddress = async () => {
    const [walletAddress] = await web3.eth.getAccounts();
    return web3.utils.toChecksumAddress(walletAddress);
  };

  const isUserAtExpectedNetwork = async () => {
    const currentNetworkId = await detectNetwork();
    return Number(currentNetworkId) === Number(INFURA_NETWORK_ID);
  };

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on('accountsChanged', async (accounts) => {
      const [address] = accounts;
      setWalletAddress(address);
    });
    provider.on('chainChanged', async (chainId) => {
      await detectNetwork();
      console.log('Network changed');
    });
  };

  const connectEthereumWallet = async () => {
    try {
      provider = await web3Modal.connect();
      subscribeProvider(provider);
      await provider.enable();

      web3 = new Web3(provider);
      const [account] = await web3.eth.getAccounts();
      const isExpectedNetwork = await isUserAtExpectedNetwork();

      if (!isExpectedNetwork) {
        const hexifiedChainId = web3.utils.toHex(INFURA_NETWORK_ID);
        await web3.currentProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexifiedChainId }]
        });
      }

      web3.eth.defaultAccount = account;
      setWalletAddress(web3.utils.toChecksumAddress(account));
      await store.set(availableBlockchains.ETHEREUM, account);
      return web3;
    } catch (error) {
      throw new Error(error.toString());
    }
  };

  const checkWalletHasPreviouslyConnected = async () => {
    const walletAddress = await store.get(availableBlockchains.ETHEREUM);
    if (walletAddress) {
      await connectEthereumWallet();
    }
  };

  const isWalletsAvailable = async () => {
    if (!isNil(address)) {
      await detectNetwork();
    }
  };

  useEffect(() => {
    checkWalletHasPreviouslyConnected();
  }, []);

  useEffect(() => {
    isWalletsAvailable();
  }, [address]);

  const getLatestBlock = async () => {
    const block = await web3.eth.getBlockNumber();
    return block;
  };

  const generateSignatureForClaim = async (conversionId, amount, fromAddress, toAddress) => {
    const message = await web3.utils.soliditySha3(
      { type: 'string', value: conversionId },
      { type: 'string', value: amount },
      { type: 'string', value: fromAddress },
      { type: 'string', value: toAddress }
    );

    const hash = await web3.eth.personal.sign(message, address);
    return hash;
  };

  const signMessage = async (tokenPairId, amount, fromAddress, toAddress) => {
    const blockNumber = await getLatestBlock();
    const message = await web3.utils.soliditySha3(
      { type: 'string', value: tokenPairId },
      { type: 'string', value: amount },
      { type: 'string', value: fromAddress },
      { type: 'string', value: toAddress },
      { type: 'uint256', value: blockNumber }
    );

    const walletAddress = await getWalletAddress();

    const hash = await web3.eth.personal.sign(message, walletAddress);
    return hash;
  };

  const disconnectEthereumWallet = () => {
    web3Modal.clearCachedProvider();
    setWalletAddress(null);
    store.remove(availableBlockchains.ETHEREUM);
    store.remove('walletconnect');
  };

  const convertToCogs = (amount, decimals) => {
    return new BigNumber(amount).times(10 ** decimals).toFixed();
  };

  const convertAsReadableAmount = (balanceInCogs, decimals) => {
    const rawbalance = new BigNumber(balanceInCogs).dividedBy(new BigNumber(10 ** decimals)).toFixed();
    return rawbalance;
  };

  const formatContractExceptionMessage = (error) => {
    console.log(error);
    let compactedMessage = '';
    let baseError = error;
    if (!isNil(error.message)) {
      console.log('Got JSON Error ', error.message);
      baseError = error.message;
    } else {
      console.log('Got non JSON error ');
      baseError = String(error);
      console.log(baseError);
    }
    const errorRows = baseError.split(/\r?\n/);
    compactedMessage = errorRows[0].replace('Error: ', '').substring(0, 80);
    const errorMessage = `Check the transaction tab for status of this transaction. Details: [${compactedMessage}]`;
    return { message: errorMessage, completeError: baseError, redirectTo: paths.Transactions };
  };

  const balanceFromWallet = async (tokenContractAddress) => {
    try {
      const contractAddress = web3.utils.toChecksumAddress(tokenContractAddress);
      const walletAddress = await getWalletAddress();
      const contract = new web3.eth.Contract(ERC20TokenABI, contractAddress);
      const balanceInCogs = await contract.methods.balanceOf(walletAddress).call();
      const decimals = await contract.methods.decimals().call();
      const symbol = await contract.methods.symbol().call();
      const balance = convertAsReadableAmount(balanceInCogs, decimals);

      return { symbol, balance };
    } catch (error) {
      throw error.toString();
    }
  };

  const approveSpender = async (tokenContractAddress, spenderAddress) => {
    try {
      const limitInCogs = convertToCogs(100000000, 8);
      console.log('Spender Limit : ', limitInCogs);
      console.log('Token contract address', tokenContractAddress);
      const contract = new web3.eth.Contract(ERC20TokenABI, tokenContractAddress);
      const walletAddress = await getWalletAddress();
      const estimateGasLimit = await contract.methods.approve(spenderAddress, limitInCogs).estimateGas({ from: walletAddress });
      console.log('approveSpender estimateGasLimit', estimateGasLimit);
      const response = await contract.methods
        .approve(spenderAddress, limitInCogs)
        .send({ from: walletAddress })
        .on('transactionHash', (transactionHash) => {
          dispatch(setBlockchainStatus(blockchainStatusLabels.ON_TXN_HASH));
        });
      return response;
    } catch (error) {
      console.log('Approve spender error: ', error);
      throw error?.message ?? JSON.stringify(error);
    }
  };

  const estimateGasPrice = async (estimate) => {
    const gasPrice = await web3.eth.getGasPrice();
    return gasPrice;
  };

  const checkAllowance = async (tokenContractAddress, spenderAddress) => {
    const walletAddress = await getWalletAddress();
    const contract = new web3.eth.Contract(ERC20TokenABI, tokenContractAddress);
    const allowanceInCogs = await contract.methods.allowance(walletAddress, spenderAddress).call();
    const decimals = await contract.methods.decimals().call();
    return convertAsReadableAmount(allowanceInCogs, decimals);
  };

  const conversionIn = async (contractAddress, amountForMint, conversionId, signature, decimals) => {
    try {
      const amount = new BigNumber(amountForMint).toFixed();
      const { v, r, s } = splitSignature(signature);
      const hexifiedConsversionId = web3.utils.toHex(conversionId);
      const walletAddress = await getWalletAddress();

      console.log('conversionIn amount', amount);
      console.log('conversionIn v', v);
      console.log('conversionIn r', r);
      console.log('conversionIn s', s);
      console.log('conversionIn hexifiedConsversionId', hexifiedConsversionId);
      console.log('conversionIn contractAddress', contractAddress);
      console.log('conversion decimals', decimals);

      const contract = new web3.eth.Contract(TokenConversionManagerABI, contractAddress);
      await contract.methods.conversionIn(walletAddress, amount, hexifiedConsversionId, v, r, s).estimateGas({ from: walletAddress });

      const gasPrice = await estimateGasPrice();

      const transaction = await contract.methods
        .conversionIn(walletAddress, amount, hexifiedConsversionId, v, r, s)
        .send({ from: walletAddress, gasPrice })
        .on('transactionHash', (transactionHash) => {
          dispatch(setBlockchainStatus(blockchainStatusLabels.ON_TXN_HASH));
        });

      return transaction.transactionHash;
    } catch (error) {
      console.log('ConversionIn contract call exception: ', error);
      throw formatContractExceptionMessage(error);
    }

    // return new Promise((resolve, reject) => {
    //   contract.methods
    //     .conversionIn(walletAddress, amount, hexifiedConsversionId, v, r, s)
    //     .send({ from: walletAddress, gasPrice })
    //     .on('transactionHash', (transactionHash) => {
    //       resolve(transactionHash);
    //     })
    //     .on('error', (error) => {
    //       console.log('conversionIn error', error.toString());
    //       reject(error);
    //     });
    // });
  };

  const conversionOut = async (contractAddress, amountForBurn, conversionId, signature, decimals) => {
    try {
      const amount = web3.utils.toNumber(convertToCogs(amountForBurn, decimals));
      const { v, r, s } = splitSignature(signature);
      const hexifiedConsversionId = web3.utils.toHex(conversionId);
      const walletAddress = await getWalletAddress();

      console.log('Contract Address', contractAddress);
      console.log('Contract decimals', decimals);
      console.log('Amount for burn in cogs', amount);
      console.log('Amount for burn', amountForBurn);
      console.log('conversionId', hexifiedConsversionId);
      console.log('Singature', signature);

      const contract = new web3.eth.Contract(TokenConversionManagerABI, contractAddress);
      await contract.methods.conversionOut(amount, hexifiedConsversionId, v, r, s).estimateGas({ from: walletAddress });

      const gasPrice = await estimateGasPrice();

      const transaction = await contract.methods
        .conversionOut(amount, hexifiedConsversionId, v, r, s)
        .send({ from: walletAddress, gasPrice })
        .on('transactionHash', (transactionHash) => {
          dispatch(setBlockchainStatus(blockchainStatusLabels.ON_TXN_HASH));
        });

      return transaction.transactionHash;
    } catch (error) {
      console.log('ConversionOut contract call exception: ', error);
      throw formatContractExceptionMessage(error);
    }

    // return new Promise((resolve, reject) => {
    //   contract.methods
    //     .conversionOut(amount, hexifiedConsversionId, v, r, s)
    //     .send({ from: walletAddress, gasPrice })
    //     .on('transactionHash', (transactionHash) => {
    //       resolve(transactionHash);
    //     })
    //     .on('error', (error, receipt) => {
    //       console.log('conversionOut error', error.toString());
    //       reject(error);
    //     });
    // });
  };

  return {
    approveSpender,
    checkAllowance,
    connectEthereumWallet,
    disconnectEthereumWallet,
    address,
    signMessage,
    getLatestBlock,
    conversionOut,
    balanceFromWallet,
    convertToCogs,
    userSelecteNetworkId,
    generateSignatureForClaim,
    conversionIn,
    getWalletAddress
  };
};
