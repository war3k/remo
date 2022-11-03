import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core';
import { COLORS } from '../../styles/colors';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class FormErrorsModal extends React.Component {
  mapErrors = errors => {
    const errorsMessages = [];
    const mapObject = errors => {
      errors &&
        Object.keys(errors).forEach(error => {
          if (typeof errors[error] === 'string') {
            errorsMessages.push(errors[error]);
          } else if (Array.isArray(errors[error])) {
            errors[error].forEach(error => {
              mapObject(error);
            });
          } else {
            mapObject(errors[error]);
          }
        });
    };
    mapObject(errors);
    return errorsMessages.map((error, index) => (
      <div key={index}>
        <p className={this.props.classes.error}>{error}</p>
      </div>
    ));
  };

  render() {
    const { t, errors, classes } = this.props;

    return (
      <div>
        <Dialog
          open
          TransitionComponent={Transition}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          onClick={() => this.props.hideModal()}
        >
          <DialogTitle className={classes.title}>
            {t('ORDER_FORM.VALIDATION_FAILED')}
          </DialogTitle>
          <DialogContent className={classes.errorsList}>
            {this.mapErrors(errors)}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const styles = theme => ({
  title: {
    borderBottom: `1px solid ${COLORS.DARK_GREY}`
  },
  errorsList: {
    padding: '40px'
  },
  error: {
    color: COLORS.PRIMARY_COLOR,
    margin: '10px 10px'
  }
});
export default withStyles(styles)(FormErrorsModal);
