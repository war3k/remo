/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { withNamespaces } from 'react-i18next';
import { observer } from 'mobx-react';
import { COLORS } from '../../styles/colors';

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  const {
    selectProps,
    selectProps: { innerProps }
  } = props;
  return (
    <TextField
      fullWidth
      variant="outlined"
      className={props.selectProps.classes.text}
      label={innerProps.label}
      error={innerProps.error && innerProps.touched}
      value={innerProps.value.label || ''}
      helperText={innerProps.touched && innerProps.error}
      InputProps={{
        inputComponent,
        inputProps: {
          className: selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
    />
  );
}

function Option(props) {
  return (
    <div
      className={props.selectProps.classes.singleValue}
      style={{
        fontWeight: props.isSelected ? 700 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </div>
  );
}

function ValueContainer(props) {
  return (
    <div
      className={props.selectProps.classes.valueContainer}
      data-cy="packageItem"
    >
      {props.children}
    </div>
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.listOfOptions}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  Option,
  ValueContainer
};

@withNamespaces()
@observer
class CustomSelectComponentPackage extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {}

  handleChange(event) {
    if (event) {
      this.props.onChange(this.props.fieldName, event.value);
      this.props.onChange(this.props.additionalFieldName, event.label);
      this.props.onChange(this.props.code, event.code || '');
      this.props.onChange(this.props.description, event.description || '');
      this.props.onChange(this.props.name, event.name);
      if (this.props.unitFieldName) {
        this.props.onChange(this.props.unitFieldName, event.unit);
      }
      if (this.props.weightPerPieceFieldName) {
        this.props.onChange(
          this.props.weightPerPieceFieldName,
          event.weightPerPiece
        );
      }
      if (this.props.weightPerCubicMeterFieldName) {
        this.props.onChange(
          this.props.weightPerCubicMeterFieldName,
          event.weightPerCubicMeter
        );
      }
    } else {
      this.props.onChange(this.props.fieldName, '');
      this.props.onChange(this.props.additionalFieldName, '');
      if (this.props.unitFieldName) {
        this.props.onChange(this.props.unitFieldName, '');
      }
      if (this.props.weightPerPieceFieldName) {
        this.props.onChange(this.props.weightPerPieceFieldName, 0);
      }
      if (this.props.weightPerCubicMeterFieldName) {
        this.props.onChange(this.props.weightPerCubicMeterFieldName, 0);
      }
    }
  }

  handleBlur = () => {
    this.props.onBlur(this.props.fieldName, true);
  };

  getOptions = search => {
    this.props.filterOptions(search);
  };

  myStyles = {
    clearIndicator: styles => ({
      ...styles,
      cursor: 'pointer'
    }),
    dropdownIndicator: styles => ({
      ...styles,
      cursor: 'pointer'
    })
  };

  render() {
    const { classes, options } = this.props;
    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            isClearable
            ref={this.myRef}
            classes={classes}
            styles={this.myStyles}
            options={options}
            filterOption={() => true}
            components={components}
            placeholder={false}
            onBlur={this.handleBlur}
            onChange={event => this.handleChange(event)}
            value={this.props.value}
            onInputChange={event => this.getOptions(event)}
            innerProps={this.props}
          />
        </NoSsr>
      </div>
    );
  }
}

const styles = () => ({
  root: {
    flexGrow: 1,
    marginBottom: '8px'
  },
  input: {
    display: 'flex',
    padding: 10
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  singleValue: {
    fontSize: '16px',
    padding: '10px 0px',
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: COLORS.VERY_LIGHT_GREY
    }
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
    padding: 10
  },
  paper: {
    position: 'absolute',
    zIndex: 10,
    left: 0,
    right: 0,
    display: 'block'
  },
  listOfOptions: {
    position: 'absolute',
    top: '56px',
    zIndex: 2,
    width: '100%'
  },
  clearIndicator: {
    cursor: 'pointer'
  }
});

export default withStyles(styles, { withTheme: true })(
  CustomSelectComponentPackage
);
