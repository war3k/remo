import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';

@inject('dashboardStore')
@observer
class Dashboard extends Component {
  componentDidMount() {}

  render() {
    return <></>;
  }
}

const styles = {};

export default withStyles(styles)(Dashboard);
