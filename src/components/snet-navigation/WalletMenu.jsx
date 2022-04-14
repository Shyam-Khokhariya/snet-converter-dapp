import AppBar from '@mui/material/AppBar';
import { useSelector } from 'react-redux';
import { isEmpty, size } from 'lodash';
import propTypes from 'prop-types';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import useMenubarStyles from './style';
import Paths from '../../router/paths';
import BridgeLogo from './BridgeLogo';
import SnetButton from '../snet-button';

const WalletMenu = ({ openConnectedWallets }) => {
  const classes = useMenubarStyles();
  const location = useLocation();
  const { pathname } = location;
  const state = useSelector((state) => state);
  const { wallets } = state.wallet;

  const splitLocation = pathname.split('/');

  return (
    <AppBar position="static" color="white" sx={{ padding: 2 }} className={classes.header}>
      <Box className={classes.items}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <BridgeLogo />
          <ul className={classes.navigations}>
            <li className={splitLocation[1] === '' ? classes.active : ''}>
              <Link to={Paths.Converter}>Home</Link>
            </li>
            <li className={splitLocation[1] === 'transactions' ? classes.active : ''}>
              <Link to={Paths.Transactions}>Transactions</Link>
            </li>
            <li className={splitLocation[1] === 'contact' ? classes.active : ''}>
              <Link to={Paths.Contact}>Contact</Link>
            </li>
          </ul>
        </Box>
        {!isEmpty(wallets) ? (
          <Box onClick={openConnectedWallets} className={classes.walletConnectionInfo}>
            <IconButton>
              <AccountBalanceWalletIcon />
            </IconButton>
            <Box>
              <Typography>Wallet Account</Typography>
              <span>{size(wallets)} Connected</span>
            </Box>
          </Box>
        ) : (
          <SnetButton name="Connect Wallets" onClick={openConnectedWallets} />
        )}
      </Box>
    </AppBar>
  );
};

WalletMenu.propTypes = {
  openConnectedWallets: propTypes.func.isRequired
};

export default WalletMenu;
