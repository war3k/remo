import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { toJS } from 'mobx';
import { COLORS } from '../styles/colors';

@withNamespaces()
@inject('userStore', 'dashboardStore')
@observer
class OrderList extends Component {
  state = {
    page: 0,
    rowsPerPage: 25,
    sort: 'createdDate',
    sortOrder: 'asc',
    search: ''
  };

  componentDidMount() {
    this.getOrders(
      this.state.page,
      this.state.rowsPerPage,
      this.state.sort,
      this.state.sortOrder,
      this.state.search
    );
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            cursor: 'pointer'
          }
        }
      }
    });

  handleOpenOrder = id => {
    this.props.history.push(`/orders/details/${id}`);
  };

  getOrders = async (page, rowsPerPage, sort, sortOrder, search) => {
    await this.props.dashboardStore.getOrdersAction(
      page,
      rowsPerPage,
      sort,
      sortOrder,
      search
    );
  };

  handleAction = (event, action) => {
    switch (action) {
      case 'change_page':
        this.setState({ page: event });
        break;
      case 'change_rows':
        this.setState({ rowsPerPage: event });
        break;
      default:
        break;
    }

    this.getOrders(
      action === 'change_page' ? event : this.state.page,
      action === 'change_rows' ? event : this.state.rowsPerPage,
      this.state.sort,
      this.state.sortOrder,
      this.state.search
    );
  };

  render() {
    const {
      classes,
      t,
      userStore: { locale, initialized },
      dashboardStore: { orders }
    } = this.props;
    const columns = [
      {
        name: t('LIST.CREATED_DATE'),
        options: {
          sort: true,
          sortDirection:
            this.state.sort === 'createdDate' ? this.state.sortOrder : 'none',
          filter: false
        }
      },
      {
        name: t('LIST.COMPANY_NAME'),
        options: { sort: false, filter: false }
      },
      {
        name: t('LIST.COMPANY_BRANCH'),
        options: { sort: false, filter: false }
      },
      {
        name: t('LIST.COMPANY_ADDRESS'),
        options: { sort: false, filter: false }
      },
      {
        name: t('LIST.ORDER_NUMBER'),
        options: { sort: false, filter: false }
      },
      {
        name: t('LIST.DATE_OF_RECEIPT'),
        options: {
          sort: true,
          sortDirection:
            this.state.sort === 'suggestedDate' ? this.state.sortOrder : 'none',
          filter: false
        }
      },
      { name: t('LIST.STATUS'), options: { sort: false, filter: false } },
      { name: 'id', options: { display: 'excluded', filter: false } }
    ];

    const options = {
      filter: false,
      serverSide: true,
      searchOpen: true,
      search: true,
      caseSensitive: false,
      searchable: true,
      searchText: this.state.search,
      responsive: 'scrollMaxHeight',
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: t('LIST.LABELS.NO_MATCH'),
          toolTip: t('LIST.LABELS.SORT')
        },
        pagination: {
          next: t('LIST.LABELS.NEXT_PAGE'),
          previous: t('LIST.LABELS.PREVIOUS_PAGE'),
          rowsPerPage: t('LIST.LABELS.ROWS_PER_PAGE'),
          displayRows: t('LIST.LABELS.DISPLAY_OF')
        },
        toolbar: {
          search: t('LIST.LABELS.SEARCH'),
          downloadCsv: t('LIST.LABELS.DOWNLOAD_CSV'),
          print: t('LIST.LABELS.PRINT'),
          viewColumns: t('LIST.LABELS.VIEW_COLUMNS'),
          filterTable: t('LIST.LABELS.FILTER')
        },
        filter: {
          all: t('LIST.LABELS.ALL'),
          title: t('LIST.LABELS.FILTRY'),
          reset: t('LIST.LABELS.RESET')
        },
        viewColumns: {
          title: t('LIST.LABELS.SHOW_COLUMNS')
        },
        selectedRows: {
          text: t('LIST.LABELS.ROWS_SELECTED'),
          delete: t('LIST.LABELS.DELETE')
        }
      },
      sort: true,
      onCellClick: (colData, cellMeta) =>
        this.handleOpenOrder(orders[cellMeta.dataIndex][7]),
      onChangePage: currentPage => {
        this.handleAction(Number(currentPage), 'change_page');
      },
      rowsPerPage: this.state.rowsPerPage,
      count: this.props.dashboardStore.ordersTotalCount,
      rowsPerPageOptions: [5, 10, 25],
      onChangeRowsPerPage: numberOfRows =>
        this.handleAction(numberOfRows, 'change_rows'),
      onColumnSortChange: (changedColumn, direction) => {
        if (changedColumn === 'Data utworzenia' && direction === 'descending') {
          this.setState(
            { sort: 'createdDate', sortOrder: 'desc' },
            this.handleAction('', 'sort')
          );
        } else if (
          changedColumn === 'Data utworzenia' &&
          direction === 'ascending'
        ) {
          this.setState(
            { sort: 'createdDate', sortOrder: 'asc' },
            this.handleAction('', 'sort')
          );
        } else if (
          changedColumn === 'Zaplanowana data odbioru' &&
          direction === 'descending'
        ) {
          this.setState(
            { sort: 'suggestedDate', sortOrder: 'desc' },
            this.handleAction('', 'sort')
          );
        } else {
          this.setState(
            { sort: 'suggestedDate', sortOrder: 'asc' },
            this.handleAction('', 'sort')
          );
        }
      },
      onSearchChange: (searchText: string) => {
        if (searchText && searchText.length >= 3) {
          this.getOrders(
            this.state.page,
            this.state.rowsPerPage,
            this.state.sort,
            this.state.sortOrder,
            searchText
          );
        } else {
          this.getOrders(
            this.state.page,
            this.state.rowsPerPage,
            this.state.sort,
            this.state.sortOrder,
            ''
          );
        }
      },
      onTableChange: (action, tableState) => {
        if (action === 'search') {
          this.setState({ search: tableState.searchText });
        }
      }
    };

    if (initialized && !locale) {
      return (
        <Redirect
          to={{
            pathname: '/language',
            state: { from: this.props.location }
          }}
        />
      );
    }
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          {orders && (
            <Card className={classes.card}>
              <CardHeader
                title={t('LIST.TITLE')}
                className={classes.listOfOrderHeaderList}
              />
              <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  data={toJS(orders)}
                  columns={columns}
                  options={options}
                />
              </MuiThemeProvider>
            </Card>
          )}
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    padding: 30,
    textAlign: 'center'
  },
  container: {
    margin: '150px auto',
    maxWidth: 1400,
    width: '100%'
  },
  card: {
    textAlign: 'center'
  },
  listOfOrderHeaderList: {
    backgroundColor: COLORS.DARK_BLUE
  },
  selectRow: {
    cursor: 'pointer'
  }
});

export default withStyles(styles)(OrderList);
