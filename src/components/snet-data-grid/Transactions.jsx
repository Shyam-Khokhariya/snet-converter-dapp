import { Typography, Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import propTypes from 'prop-types';
import { utcToLocalDateTime } from '../../utils/Date';
import { conversionDirections, txnOperations, txnOperationsLabels, conversionStatusMessages, conversionStatuses } from '../../utils/ConverterConstants';
import { useStyles } from './styles';
import { convertFromCogs } from '../../utils/bignumber';

const Transactions = ({ transaction, conversionDirection, confirmationRequired }) => {
  const classes = useStyles();
  const txnHashLink = (txnHash) => {
    if (conversionDirection === conversionDirections.ETH_TO_ADA && transaction.transaction_operation === txnOperations.TOKEN_BURNT) {
      return `${process.env.REACT_APP_ETHERSCAN_TXN_BASE_URL}/${txnHash}`;
    }

    if (conversionDirection === conversionDirections.ADA_TO_ETH && transaction.transaction_operation === txnOperations.TOKEN_MINTED) {
      return `${process.env.REACT_APP_ETHERSCAN_TXN_BASE_URL}/${txnHash}`;
    }

    return `${process.env.REACT_APP_CARDANOSCAN_TXN_BASE_URL}/${txnHash}`;
  };

  return (
    <>
      <Grid item xs={12} md={2}>
        <span className={classes.responsiveExpandedColName}>Date:</span>
        <Typography variant="caption" textAlign="left">
          {utcToLocalDateTime(transaction.created_at)}
        </Typography>
      </Grid>
      <Grid item xs={12} md={2}>
        <span className={classes.responsiveExpandedColName}>Process Status:</span>
        <Typography variant="caption" textAlign="left">
          {txnOperationsLabels[transaction.transaction_operation]}
        </Typography>
      </Grid>
      <Grid item xs={12} md={3}>
        <span className={classes.responsiveExpandedColName}>Status:</span>
        <div className={classes.statusValueContainer}>
          <Typography data-status-type={transaction.status} textAlign="left">
            {transaction.status === conversionStatuses.WAITING_FOR_CONFIRMATION
              ? `${conversionStatusMessages[transaction.status]} : ${transaction.confirmation} / ${confirmationRequired}`
              : conversionStatusMessages[transaction.status]}
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12} md={2}>
        <span className={classes.responsiveExpandedColName}>Transaction:</span>
        <Typography variant="caption" textAlign="left">
          {convertFromCogs(transaction.transaction_amount, transaction.token.allowed_decimal)} {transaction.token.symbol}
        </Typography>
      </Grid>
      <Grid item xs={12} md={3} className={classes.detailsData}>
        <span className={classes.responsiveExpandedColName}>Detail:</span>
        <Link href={txnHashLink(transaction.transaction_hash)} underline="none" target="_blank" rel="noopener noreferrer">
          <Typography variant="caption" textAlign="left">
            {transaction.transaction_hash}
          </Typography>
        </Link>
      </Grid>
    </>
  );
};

Transactions.propTypes = {
  transaction: propTypes.object.isRequired,
  conversionDirection: propTypes.string.isRequired,
  confirmationRequired: propTypes.number.isRequired
};

export default Transactions;
