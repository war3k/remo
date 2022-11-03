import { COLORS } from './colors';

export const OVERRIDES = {
  MUIDataTableFilter: {
    selectFormControl: {
      flex: '1 1 calc(50% - 23px)'
    }
  },
  MUIDataTableBodyRow: {
    root: {
      cursor: 'pointer'
    }
  },
  MuiButton: {
    root: {
      '&:hover': {
        backgroundColor: 'initial',
        color: COLORS.WHITE
      }
    }
  },
  MuiFormControl: {
    root: {
      padding: 0
    }
  },
  MuiIconButton: {
    root: {
      marginRight: 10
    }
  },
  MUIDataTableViewCol: {
    root: {
      padding: '16px 63px 16px 24px'
    }
  },
  MuiSelect: {
    select: {
      '&:focus': {
        backgroundColor: 'none'
      }
    },
    selectMenu: {
      whiteSpace: 'pre-wrap'
    }
  },
  MuiTablePagination: {
    actions: {
      marginLeft: 0
    }
  },
  MuiList: {
    root: {
      outline: 'none'
    }
  },
  MuiTypography: {
    h5: {
      color: COLORS.WHITE
    }
  },
  MuiCardActions: {
    root: {
      justifyContent: 'center',
      padding: '20px 4px'
    }
  },
  MuiExpansionPanelSummary: {
    content: {
      justifyContent: 'space-between',
      '&>:last-child': {
        paddingRight: 16
      }
    }
  },

  MuiExpansionPanel: {
    expanded: {
      '&:before': {
        opacity: 1
      }
    }
  }
};
