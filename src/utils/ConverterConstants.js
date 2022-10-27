import NamiWallet from '../assets/images/nami_logo.svg';
import EternalWallet from '../assets/images/eternal_logo.svg';
import GeroWallet from '../assets/images/gero_logo.svg';

import WalletConnect from '../assets/images/walletconnect_logo.svg';
import Metamask from '../assets/images/metamask_logo.svg';

export const progress = {
  IDLE: 'IDLE',
  PROCESSING: 'PROCESSING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
};

export const cardanoSupportingWallets = ['nami', 'gero', 'flint', 'cardwallet'];

export const supportedCardanoWallets = [
  {
    wallet: 'Nami',
    identifier: 'nami',
    logo: NamiWallet,
    site: 'https://namiwallet.io/'
  },
  {
    wallet: 'Eternl',
    identifier: 'eternl',
    logo: EternalWallet,
    site: 'https://eternl.io/'
  },
  {
    wallet: 'Gero Wallet',
    identifier: 'gerowallet',
    logo: GeroWallet,
    site: 'https://gerowallet.io/'
  },
  {
    wallet: 'Flint',
    identifier: 'flint',
    logo: 'https://uploads-ssl.webflow.com/60d83e3c6cf84748f7d0a62b/61fc134d309b3e16a84897f6_Flint%20Wallet.png',
    site: 'https://flint-wallet.com/'
  },
  {
    wallet: 'CWallet',
    identifier: 'cardwallet',
    logo: 'https://uploads-ssl.webflow.com/60d83e3c6cf84748f7d0a62b/61281040b3b41b00da5259ec_Cardwallet.png',
    site: 'https://cwallet.finance'
  }
];

export const supportedEtherumWallets = [
  {
    wallet: 'Wallet Connect',
    identifier: 'walletconnect',
    logo: WalletConnect,
    site: 'https://walletconnect.com'
  },
  {
    wallet: 'Metamask',
    identifier: 'metamask',
    logo: Metamask,
    site: 'https://metamask.io/'
  }
];

export const supportedEthereumNetworks = {
  1: 'Mainnet',
  3: 'Ropsten'
};

export const supportedCardanoNetworks = {
  1: 'Mainnet',
  0: 'Testnet'
};

export const conversionDirections = {
  ETH_TO_ADA: 'ETH_TO_ADA',
  ADA_TO_ETH: 'ADA_TO_ETH'
};

export const txnOperations = {
  TOKEN_RECEIVED: 'TOKEN_RECEIVED',
  TOKEN_BURNT: 'TOKEN_BURNT',
  TOKEN_MINTED: 'TOKEN_MINTED'
};

export const txnOperationsLabels = {
  [txnOperations.TOKEN_RECEIVED]: 'Tokens Received',
  [txnOperations.TOKEN_BURNT]: 'Tokens Burnt',
  [txnOperations.TOKEN_MINTED]: 'Tokens Minted'
};

export const conversionStatuses = {
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  USER_INITIATED: 'USER_INITIATED',
  WAITING_FOR_CLAIM: 'WAITING_FOR_CLAIM',
  IDLE: 'IDLE',
  CLAIM_INITIATED: 'CLAIM_INITIATED',
  WAITING_FOR_CONFIRMATION: 'WAITING_FOR_CONFIRMATION',
  EXPIRED: 'EXPIRED',
  ACTION_REQUIRED: 'ACTION_REQUIRED',
  FAILED: 'FAILED'
};

export const conversionStatusMessages = {
  [conversionStatuses.PROCESSING]: 'Processing',
  [conversionStatuses.SUCCESS]: 'Success',
  [conversionStatuses.USER_INITIATED]: 'Initiated',
  [conversionStatuses.WAITING_FOR_CLAIM]: 'Ready for Claim',
  [conversionStatuses.IDLE]: 'Idle',
  [conversionStatuses.CLAIM_INITIATED]: 'Claim Initiated',
  [conversionStatuses.WAITING_FOR_CONFIRMATION]: 'Awaiting Confirmation',
  [conversionStatuses.EXPIRED]: 'Expired',
  [conversionStatuses.ACTION_REQUIRED]: 'Action Required',
  [conversionStatuses.FAILED]: 'Failed'
};

export const conversionDirection = {
  FROM: 'FROM',
  TO: 'TO'
};

export const availableBlockchains = {
  CARDANO: 'CARDANO',
  ETHEREUM: 'ETHEREUM'
};

export const externalLinks = {
  TERMS_AND_CONDITIONS: 'https://public.singularitynet.io/terms_and_conditions.html'
};

export const conversionSteps = {
  DEPOSIT_TOKENS: 0,
  CONVERT_TOKENS: 1,
  CLAIM_TOKENS: 2,
  SUMMARY: 3
};

export const conversionStepsForAdaToEth = [
  {
    label: 'Deposit Tokens',
    step: conversionSteps.DEPOSIT_TOKENS,
    progress: progress.IDLE
  },
  {
    label: 'Convert Tokens',
    step: conversionSteps.CONVERT_TOKENS,
    progress: progress.IDLE
  },
  {
    label: 'Claim Tokens',
    step: conversionSteps.CLAIM_TOKENS,
    progress: progress.IDLE
  },
  {
    label: 'Summary',
    step: conversionSteps.SUMMARY,
    progress: progress.IDLE
  }
];

export const errorMessages = {
  INVALID_TOKEN_PAIR: 'Invalid token pair',
  INVALID_TOKEN_PAIR_FROM: 'Invalid token pair from',
  INVALID_TOKEN_PAIR_TO: 'Invalid token pair to',
  INSUFFICIENT_BALANCE: 'Insufficient balance for conversion',
  INSUFFICIENT_BALANCE_TO: 'Insufficient wallet balance to',
  LIMIT_EXCEEDED_FROM: 'Limit exceeded from',
  MINIMUM_TRANSACTION_AMOUNT: 'Minimum transaction amount is ',
  MAXIMUM_TRANSACTION_AMOUNT: 'Maximum transaction amount is ',
  LIMIT_EXCEEDED_TO: 'Limit exceeded to',
  INVALID_AMOUNT: 'Invalid amount',
  DECIMAL_PLACES_EXCEEDED: 'Decimal places exceeded'
};

export const blockchainStatusLabels = {
  ON_SIGNING_FROM_WALLET: { title: 'Wallet Interaction', message: 'Please sign from your wallet...' },
  ON_CONFIRMING_TXN: { title: 'Wallet Interaction', message: 'Please confirm transaction from your wallet...' },
  ON_TXN_HASH: { title: 'Transaction', message: 'Waiting for transaction to be mined...' },
  ON_UPDATING_TXN_STATUS: { title: 'Transaction', message: 'Updating transaction status...' },
  ON_APPROVING_SPEND_LIMIT: { title: 'Wallet Interaction', message: 'Approving spend limit...' },
  RESET_CONVERSION_LABEL: { title: '', message: '' }
};

export const contactSupportType = {
  BUG: 'Bug',
  QUESTION: 'Question',
  FEEDBACK: 'FeedBack',
  CATEGORY: 'Category'
};
export const ContactSupportTypeOptions = [
  {
    value: contactSupportType.BUG,
    label: contactSupportType.BUG
  },
  {
    value: contactSupportType.QUESTION,
    label: contactSupportType.QUESTION
  },
  {
    value: contactSupportType.FEEDBACK,
    label: contactSupportType.FEEDBACK
  }
];

export const cardanoWalletConnected = 'cardanoWalletConnected';
export const walletConnectionAgreed = 'walletConnectionAgreed';
