import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
  connectWalletContent: {
    padding: '32px 16px',
    '& > div': {
      paddingBottom: 23,
      borderBottom: '1px solid #D6D6D6',
      marginBottom: 23,
      '&:last-of-type': {
        paddingBottom: 0,
        border: 'none',
        marginBottom: 0
      },
      '& > div': { alignItems: 'flex-start' }
    }
  },
  connectWalletActions: {
    padding: '18px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    '& div': {
      display: 'flex',
      alignItems: 'center',
      '& p': {
        color: '#9e9e9e',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: -0.14,
        lineHeight: '16px'
      },
      '& span': {
        paddingLeft: 5,
        color: '#4086ff',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: -0.14,
        lineHeight: '16px'
      }
    }
  }
});
