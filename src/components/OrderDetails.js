import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import moment from 'moment';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { COLORS } from '../styles/colors';

@withNamespaces()
@inject('dashboardStore')
@observer
class OrderDetails extends Component {
  state = {
    expanded: false
  };

  componentDidMount() {
    this.getOrder();
  }

  getOrder = async () => {
    const success = await this.props.dashboardStore.getOrderById(
      this.props.match.params.id
    );

    if (!success) {
      return this.props.history.replace('/orders');
    }
    return false;
  };

  handleChange = recyclingItem => (event, expanded) => {
    this.setState({
      expanded: expanded ? recyclingItem : false
    });
  };

  render() {
    const isIE = window.navigator.userAgent.indexOf('Trident') !== -1;
    const { expanded } = this.state;
    const {
      classes,
      t,
      dashboardStore: { order }
    } = this.props;
    return (
      <div className={isIE ? classes.containerIE : classes.container}>
        <div className={classes.form}>
          <form>
            <div className={classes.paddingCard}>
              <Card className={classes.detailCard}>
                <CardHeader
                  title={t('ORDERS_DETAILS.DETAILS')}
                  className={classes.detailHeader}
                />
                <CardContent>
                  <div className={classes.formContainer}>
                    <TextField
                      id="orderNumber"
                      name="orderNumber"
                      variant="outlined"
                      disabled
                      label={t('LIST.ORDER_NUMBER')}
                      value={(order && order.orderNumber) || ''}
                      className={classes.textFieldMargin}
                      margin="normal"
                      autoComplete="off"
                    />
                    <TextField
                      id="orderType"
                      name="orderType"
                      variant="outlined"
                      disabled
                      label={t('LIST.DATE_OF_RECEIPT')}
                      value={
                        order && order.suggestedDate
                          ? moment(order.suggestedDate).format('YYYY-MM-DD')
                          : ''
                      }
                      className={classNames(
                        classes.textField,
                        classes.calendarMargin
                      )}
                      margin="normal"
                      autoComplete="off"
                    />
                    <TextField
                      id="orderType"
                      name="orderType"
                      variant="outlined"
                      disabled
                      label={t('ORDERS_DETAILS.TYPE_ORDER')}
                      value={
                        (order &&
                          t(
                            `ORDERS_DETAILS.TYPE_ORDER_${order.orderType.toUpperCase()}`
                          )) ||
                        ''
                      }
                      className={classes.textField}
                      margin="normal"
                      autoComplete="off"
                    />
                  </div>
                  <div className={classes.formContainer}>
                    <TextField
                      id="user"
                      name="user"
                      variant="outlined"
                      disabled
                      label={t('ORDERS_DETAILS.USER')}
                      value={
                        (order &&
                          order.reporter &&
                          `${order.reporter.name} ${order.reporter.surname}`) ||
                        ''
                      }
                      className={classNames(classes.textFieldMargin)}
                      margin="normal"
                      autoComplete="off"
                    />
                    <TextField
                      id="company"
                      name="company"
                      variant="outlined"
                      disabled
                      label={t('ORDERS_DETAILS.COMPANY')}
                      value={
                        (order &&
                          order.customerCompany &&
                          order.customerCompany.name) ||
                        ''
                      }
                      className={classNames(classes.textFieldMargin)}
                      margin="normal"
                      autoComplete="off"
                    />
                    <TextField
                      id="status"
                      name="status"
                      variant="outlined"
                      disabled
                      label={t('LIST.STATUS')}
                      value={
                        (order &&
                          t(`STATUSES.${order.status.toUpperCase()}`)) ||
                        ''
                      }
                      className={classes.textFieldMargin}
                      margin="normal"
                      autoComplete="off"
                    />
                  </div>
                </CardContent>
                <CardHeader
                  title={t('ORDERS_DETAILS.RECEIVING_DATA_TITLE')}
                  className={classes.detailHeader}
                />
                <CardContent>
                  <div className={classes.orderAdress}>
                    <div className={classes.formContainer}>
                      <TextField
                        id="adress"
                        name="adress"
                        variant="outlined"
                        disabled
                        label={t('ORDERS_DETAILS.ADRESS')}
                        value={
                          (order && order.customerCompanyBranch.street) || ''
                        }
                        className={classes.textField}
                        margin="normal"
                        autoComplete="off"
                      />
                      <TextField
                        id="postal_code"
                        name="postal_code"
                        variant="outlined"
                        disabled
                        label={t('ORDERS_DETAILS.POSTAL_CODE')}
                        value={
                          (order && order.customerCompanyBranch.postalCode) ||
                          ''
                        }
                        className={classes.textFieldMargin}
                        margin="normal"
                        autoComplete="off"
                      />
                      <TextField
                        id="city"
                        name="city"
                        variant="outlined"
                        disabled
                        label={t('ORDERS_DETAILS.CITY')}
                        value={
                          (order && order.customerCompanyBranch.city) || ''
                        }
                        className={classes.textFieldMargin}
                        margin="normal"
                        autoComplete="off"
                      />
                      <TextField
                        id="country"
                        name="country"
                        variant="outlined"
                        disabled
                        label={t('ORDERS_DETAILS.COUNTRY')}
                        value={
                          (order && order.customerCompanyBranch.country) || ''
                        }
                        className={classes.textField}
                        margin="normal"
                        autoComplete="off"
                      />
                      <TextField
                        id="fromHour"
                        name="fromHour"
                        variant="outlined"
                        disabled
                        label={t('ORDERS_DETAILS.HOURS_RECEIVE_FROM')}
                        value={(order && order.availableHoursFrom) || ''}
                        className={classes.textFieldMargin}
                        margin="normal"
                        autoComplete="off"
                      />
                      <TextField
                        id="toHour"
                        name="toHour"
                        variant="outlined"
                        disabled
                        label={t('ORDERS_DETAILS.HOURS_RECEIVE_TO')}
                        value={(order && order.availableHoursTo) || ''}
                        className={classes.textFieldMargin}
                        margin="normal"
                        autoComplete="off"
                      />
                      <TextField
                        id="contact"
                        name="contact"
                        variant="outlined"
                        disabled
                        label={t('ORDERS_DETAILS.CONTACT_PERSON')}
                        value={
                          (order && order.customerCompanyBranch.contact) || ''
                        }
                        className={classes.textField}
                        margin="normal"
                        autoComplete="off"
                      />
                      <TextField
                        id="email"
                        name="email"
                        variant="outlined"
                        disabled
                        label={t('ORDERS_DETAILS.CONTACT_EMAIL')}
                        value={
                          (order && order.customerCompanyBranch.email) || ''
                        }
                        className={classes.textField}
                        margin="normal"
                        autoComplete="off"
                      />
                      <TextField
                        id="phone"
                        name="phone"
                        variant="outlined"
                        disabled
                        label={t('ORDERS_DETAILS.CONTACT_PHONE')}
                        value={
                          (order && order.customerCompanyBranch.phone) || ''
                        }
                        className={classes.textField}
                        margin="normal"
                        autoComplete="off"
                      />
                    </div>
                    <div className={classes.formContainer}>
                      <TextField
                        id="comment"
                        name="comment"
                        variant="outlined"
                        multiline
                        disabled
                        label={t('ORDERS_DETAILS.COMMENT')}
                        value={(order && order.comment) || ''}
                        className={classes.textFieldComment}
                        margin="normal"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </CardContent>
                <div key="order">
                  <CardHeader
                    title={t('ORDERS_DETAILS.RECYCLING')}
                    className={classes.detailHeader}
                  />
                  {order &&
                    order.orderData.map((item, index) => (
                      <CardContent key={index} className={classes.paddingOrder}>
                        <ExpansionPanel
                          expanded={expanded === `recyclingItem${index}`}
                          onChange={this.handleChange(`recyclingItem${index}`)}
                        >
                          >
                          <ExpansionPanelSummary
                            data-cy={`openPanelSummary${index}`}
                            expandIcon={
                              <ExpandMoreIcon
                                className={
                                  expanded === `recyclingItem${index}`
                                    ? classes.iconOpenColor
                                    : ''
                                }
                              />
                            }
                            className={
                              expanded !== `recyclingItem${index}`
                                ? classes.backgroundOrder
                                : classes.backgroundOrderOpen
                            }
                          >
                            <Typography
                              className={
                                expanded === `recyclingItem${index}`
                                  ? classes.orderItemTitleOpen
                                  : ''
                              }
                            >
                              {order.orderData[index].recyclingItem.name || ''}
                              {` ${order.orderData[index].recyclingItem.code ||
                                ''} ${order.orderData[index].recyclingItem
                                .description || ''}`}
                            </Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails className={classes.centerForm}>
                            <div>
                              <div className={classes.formContainer}>
                                <TextField
                                  id="equipment"
                                  name="equipment"
                                  variant="outlined"
                                  disabled
                                  label={t('ORDERS_DETAILS.EQUIPMENT')}
                                  value={
                                    order.orderData[index].recyclingItem.name ||
                                    ''
                                  }
                                  className={classNames(
                                    classes.textField,
                                    classes.typeField
                                  )}
                                  margin="normal"
                                  autoComplete="off"
                                />
                                <TextField
                                  id="quantityRecycling"
                                  name="quantityRecycling"
                                  variant="outlined"
                                  disabled
                                  label={t('ORDERS_DETAILS.QUANTITY')}
                                  value={order.orderData[index].value || ''}
                                  className={classNames(
                                    classes.textFieldMargin,
                                    classes.quantityField
                                  )}
                                  margin="normal"
                                  autoComplete="off"
                                />
                                <TextField
                                  id="unitRecycling"
                                  name="unitRecycling"
                                  variant="outlined"
                                  disabled
                                  label={t('ORDERS_DETAILS.UNIT')}
                                  value={
                                    t(
                                      `ORDERS_DETAILS.${order.orderData[
                                        index
                                      ].unit.toUpperCase()}`
                                    ) || ''
                                  }
                                  className={classNames(
                                    classes.textFieldMargin,
                                    classes.quantityField
                                  )}
                                  margin="normal"
                                  autoComplete="off"
                                />
                              </div>
                              <p className={classes.detailPackageHeader}>
                                {t('ORDERS_DETAILS.PACKAGE')}
                              </p>

                              <div>
                                {item.packageTypes &&
                                  item.packageTypes.map((pack, i) => (
                                    <div
                                      key={
                                        order.orderData[index].packageTypes[i]
                                          .name
                                      }
                                      className={classes.formContainer}
                                    >
                                      <TextField
                                        id="packageType"
                                        name="packageType"
                                        variant="outlined"
                                        disabled
                                        label={t('ORDERS_DETAILS.PACKAGE_TYPE')}
                                        value={
                                          order.orderData[index].packageTypes[i]
                                            .name || ''
                                        }
                                        className={classNames(
                                          classes.textFieldMargin,
                                          classes.typeField
                                        )}
                                        margin="normal"
                                        autoComplete="off"
                                      />
                                      <TextField
                                        id="quantityPackage"
                                        name="quantityPackage"
                                        variant="outlined"
                                        disabled
                                        label={t('ORDERS_DETAILS.QUANTITY')}
                                        value={
                                          order.orderData[index].packageTypes[i]
                                            .value || ''
                                        }
                                        className={classNames(
                                          classes.textFieldMargin,
                                          classes.quantityField
                                        )}
                                        margin="normal"
                                        autoComplete="off"
                                      />
                                      <TextField
                                        id="unitPackage"
                                        name="unitPackage"
                                        variant="outlined"
                                        disabled
                                        label={t('ORDERS_DETAILS.UNIT')}
                                        value={
                                          t(
                                            `ORDERS_DETAILS.${order.orderData[
                                              index
                                            ].packageTypes[
                                              i
                                            ].unit.toUpperCase()}`
                                          ) || ''
                                        }
                                        className={classNames(
                                          classes.textFieldMargin,
                                          classes.quantityField
                                        )}
                                        margin="normal"
                                        autoComplete="off"
                                      />
                                      {i % 2 === 0 &&
                                        order.orderData[index].packageTypes
                                          .length > 1 && (
                                          <hr
                                            className={
                                              classes.lineBetweenPackageType
                                            }
                                          />
                                        )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </CardContent>
                    ))}
                </div>
              </Card>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: 90
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    maxWidth: 1400,
    margin: '0 auto',
    backgroundSize: 'cover',
    '@media only screen and (max-width:992px)': {
      textAlign: 'center'
    }
  },

  containerIE: {
    display: 'block',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    maxWidth: 1400,
    margin: '0 auto',
    backgroundSize: 'cover',
    '@media only screen and (max-width:992px)': {
      textAlign: 'center'
    }
  },

  detailCard: {
    marginTop: 170,
    marginBottom: 130,
    '@media only screen and (max-width:992px)': {
      marginTop: 160
    }
  },
  detailHeader: {
    backgroundColor: COLORS.DARK_BLUE,
    textAlign: 'center'
  },
  detailPackageHeader: {
    textAlign: 'center',
    fontWeight: 600
  },
  paddingCard: {
    padding: '0 30px'
  },

  centerForm: {
    justifyContent: 'center'
  },

  orderItemTitle: {
    color: COLORS.BLACK,
    fontWeight: 500
  },

  orderItemTitleOpen: {
    color: COLORS.WHITE,
    fontWeight: 600
  },

  iconOpenColor: {
    color: 'white'
  },
  textField: {
    width: '30.5%',
    '@media only screen and (max-width:992px)': {
      width: '100%'
    }
  },

  textFieldComment: {
    width: '100%'
  },
  textFieldMargin: {
    width: '30.5%',
    '@media only screen and (max-width:992px)': {
      width: '100%'
    }
  },
  addButton: {
    boxShadow: 'none',
    position: 'fixed',
    right: '20%',
    bottom: '15%',
    color: COLORS.WHITE
  },
  recyclingTitle: {
    marginTop: 130,
    marginBottom: 30,
    display: 'flex',
    justifyContent: 'center',
    color: COLORS.BLACK,
    textAlign: 'center'
  },
  subTitleOrder: {
    margin: '25px 0 0 0px',
    textAlign: 'center',
    color: COLORS.BLACK,
    marginBottom: 10
  },
  backgroundOrder: {
    backgroundColor: COLORS.VERY_LIGHT_GREY
  },

  backgroundOrderOpen: {
    backgroundColor: COLORS.PRIMARY_COLOR
  },

  paddingOrder: {
    padding: ' 9px 16px'
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '0 30px',
    '@media only screen and (max-width:992px)': {
      flexDirection: 'column'
    }
  },
  secondContainerDetail: {
    display: 'flex',
    justifyContent: 'left',
    padding: '0 30px',
    flexWrap: 'wrap'
  },
  secondContainerField: {
    width: '30.5%',
    '&:nth-child(even)': {
      marginLeft: 53
    },
    '@media only screen and (max-width:992px)': {
      width: '100%',
      '&:nth-child(even)': {
        marginLeft: 0
      }
    }
  },
  calendarMargin: {
    width: '30.5%',
    '@media only screen and (max-width:992px)': {
      marginLeft: 0,
      width: '100%'
    }
  },
  formContainerRecycling: {
    display: 'flex',
    justifyContent: 'left',
    padding: '0 30px',
    '&>div:nth-child(even)': {
      marginLeft: 53
    }
  },
  typeField: {
    width: '50%',
    '@media only screen and (max-width:992px)': {
      width: '100%'
    }
  },

  quantityField: {
    width: '20%',
    '@media only screen and (max-width:992px)': {
      width: '100%'
    }
  },

  lineBetweenPackageType: {
    width: '100%',
    display: 'none',
    border: `0.5px solid ${COLORS.PRIMARY_COLOR}`,
    '@media only screen and (max-width:992px)': {
      display: 'block'
    }
  }
});

export default withStyles(styles)(OrderDetails);
