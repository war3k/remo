import React from 'react';
import { withStyles } from '@material-ui/core';
import OrderFormWrapper from './OrderForm/OrderFormWrapper';
import { COLORS } from '../styles/colors';
import Background from '../assets/images/background.jpg';

const OrderNotLogged = props => {
  const { classes } = props;

  return (
    <div className={classes.container}>
      <OrderFormWrapper />
    </div>
  );
};

const styles = theme => ({
  container: {
    width: '100%',
    boxSizing: 'border-box',
    background: `${COLORS.BACKGROUND_GREY} url(${Background}) no-repeat fixed center right`,
    backgroundSize: 'cover'
  }
});

export default withStyles(styles)(OrderNotLogged);
