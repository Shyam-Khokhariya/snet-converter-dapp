import propTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { RefreshOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toLocalDateTime } from '../../utils/Date';
import Columns from './Columns';
import Rows from './Rows';
import { setAdaConversionInfo, setConversionDirection, setActiveStep, setCurrentConversionStep } from '../../services/redux/slices/tokenPairs/tokenPairSlice';
import { setFromAddress, setToAddress } from '../../services/redux/slices/wallet/walletSlice';
import { availableBlockchains, conversionStatuses, conversionSteps, progress } from '../../utils/ConverterConstants';
import paths from '../../router/paths';
import { useStyles } from './styles';
import SnetPagination from './Pagination';

const SnetDataGrid = ({
  paginationInfo,
  onPageChange,
  currentPage,
  rows,
  refreshTxnHistory,
  loading,
  onItemSelect,
  pageSizes,
  paginationSize,
  totalNoOfTransaction,
  getTransactionHistory,
  expanded,
  setExpandedValue
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleResume = (conversionInfo, conversionStatus) => {
    let activeStep;
    switch (conversionStatus) {
      case conversionStatuses.WAITING_FOR_CLAIM:
        activeStep = conversionSteps.CLAIM_TOKENS;
        break;

      case conversionStatuses.USER_INITIATED:
        activeStep = conversionSteps.DEPOSIT_TOKENS;
        break;

      default:
        activeStep = conversionSteps.CONVERT_TOKENS;
        break;
    }

    const { wallet } = conversionInfo;

    dispatch(setFromAddress(wallet.from_address));
    dispatch(setToAddress(wallet.to_address));
    dispatch(setAdaConversionInfo(conversionInfo));
    dispatch(setConversionDirection(availableBlockchains.CARDANO));
    dispatch(setActiveStep(activeStep));

    for (let index = 0; index <= Number(activeStep); index++) {
      dispatch(setCurrentConversionStep({ activeStep: index, progress: progress.COMPLETE }));
    }

    navigate(paths.Converter);
  };

  return (
    <div className={classes.transactionHistoryTable}>
      <Backdrop open={loading}>
        <CircularProgress color="white" />
      </Backdrop>
      <Box className={classes.transactionHistoryHeader}>
        <Box display="flex" justifyContent="flex-end" marginY={2} className={classes.refreshDataContainer}>
          <LoadingButton loading={loading} onClick={refreshTxnHistory} startIcon={<RefreshOutlined />} variant="text">
            Refresh Data
          </LoadingButton>
        </Box>
        <Box className={classes.totalRecordsContainer}>
          <Typography>{totalNoOfTransaction} transactions</Typography>
        </Box>
      </Box>
      <Columns />
      {rows.map((row, index) => {
        return (
          <Rows
            key={row.id}
            id={row.id}
            date={toLocalDateTime(row.lastUpdatedAt)}
            fromToken={row.fromToken}
            chainType={row.chainType}
            fromAddress={row.fromAddress}
            toAddress={row.toAddress}
            toToken={row.toToken}
            status={row.status}
            getTransactionHistory={getTransactionHistory}
            transactions={row.transactions}
            conversionDirection={row.conversionDirection}
            handleResume={() => handleResume(row.conversionInfo, row.status)}
            depositAmount={row.depositAmount}
            receivingAmount={row.receivingAmount}
            confirmationRequired={row.confirmationRequired}
            expanded={expanded[row.id]}
            setExpandedValue={setExpandedValue}
          />
        );
      })}
      <SnetPagination
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
        currentPage={currentPage}
        paginationSize={paginationSize}
        onItemSelect={onItemSelect}
        pageSizes={pageSizes}
      />
    </div>
  );
};

SnetDataGrid.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  rows: propTypes.arrayOf(propTypes.object).isRequired,
  refreshTxnHistory: propTypes.func.isRequired,
  loading: propTypes.bool.isRequired,
  onItemSelect: propTypes.func.isRequired,
  pageSizes: propTypes.arrayOf(propTypes.number).isRequired,
  paginationSize: propTypes.number.isRequired,
  currentPage: propTypes.number.isRequired,
  onPageChange: propTypes.func.isRequired,
  getTransactionHistory: propTypes.func.isRequired,
  paginationInfo: propTypes.string.isRequired,
  totalNoOfTransaction: propTypes.number.isRequired,
  expanded: propTypes.object.isRequired,
  setExpandedValue: propTypes.func.isRequired
};

export default SnetDataGrid;
