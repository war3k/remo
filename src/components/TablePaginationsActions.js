import React, { Component } from 'react';
import { withStyles, IconButton } from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { inject, observer } from 'mobx-react';

@inject('appStore')
@observer
class TablePaginationActions extends Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const {
      classes,
      count,
      page,
      rowsPerPage,
      theme,
      appStore: { locale }
    } = this.props;
    return (
      <div className={classes.root}>
        {locale !== 'en' ? (
          <div>
            <IconButton
              onClick={this.handleLastPageButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="Last Page"
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              onClick={this.handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="Next Page"
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              onClick={this.handleBackButtonClick}
              disabled={page === 0}
              aria-label="Back Page"
            >
              <KeyboardArrowRight />
            </IconButton>
            <IconButton
              onClick={this.handleFirstPageButtonClick}
              disabled={page === 0}
              aria-label="First Page"
            >
              <LastPageIcon />
            </IconButton>
          </div>
        ) : (
          <div>
            <IconButton
              onClick={this.handleFirstPageButtonClick}
              disabled={page === 0}
              aria-label="First Page"
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              onClick={this.handleBackButtonClick}
              disabled={page === 0}
              aria-label="Previous Page"
            >
              {locale !== 'en' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
              onClick={this.handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="Next Page"
            >
              {locale !== 'en' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
              onClick={this.handleLastPageButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="Last Page"
            >
              <LastPageIcon />
            </IconButton>
          </div>
        )}
      </div>
    );
  }
}

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

export default withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions
);
