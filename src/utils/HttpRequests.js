import axios from './Axios';

export const getBlockchains = async () => {
  try {
    const { data } = await axios.get('blockchain');
    return data;
  } catch (error) {
    return [];
  }
};

export const getTokenPairs = async () => {
  try {
    const { data } = await axios.get('token/pair');
    return data;
  } catch (error) {
    return [];
  }
};

export const generateConversionID = async (tokenPairdId, amount, signature, blockNumber, fromAddress, toAddress) => {
  try {
    const payload = {
      amount,
      signature,
      token_pair_id: tokenPairdId,
      block_number: blockNumber,
      to_address: toAddress,
      from_address: fromAddress
    };
    const { data } = await axios.post('conversion', payload);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getConversionStatus = async (conversionId) => {
  try {
    const { data } = await axios.get(`conversion/${conversionId}`);
    return data;
  } catch (error) {
    return [];
  }
};

export const conversionClaim = async (conversionId, amount, signature, toAddress, fromAddress) => {
  try {
    const payload = {
      amount,
      signature,
      to_address: toAddress,
      from_address: fromAddress
    };
    const { data } = await axios.post(`conversion/${conversionId}/claim`, payload);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTransactionStatus = async (conversionId, transactionHash) => {
  try {
    const payload = {
      conversion_id: conversionId,
      transaction_hash: transactionHash
    };
    const { data } = await axios.post('transaction', payload);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getConversionTransactionHistory = async (address, pageNumber, pageSize) => {
  try {
    const { data } = await axios.get('conversion/history', {
      params: {
        page_number: pageNumber,
        page_size: pageSize,
        address
      }
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPendingConversionCount = async (address) => {
  try {
    const { data } = await axios.get('conversion/count', {
      params: {
        address
      }
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const submitFeedback = async (params) => {
  try {
    const data = await axios.post(`${process.env.REACT_APP_CONTACT_SUPPORT_BASE_URL}/user/message`, params);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
