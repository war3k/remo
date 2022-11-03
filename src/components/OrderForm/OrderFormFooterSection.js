import { Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { Typography, Button, Card } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import Tooltip from '@material-ui/core/Tooltip';

const OrderFormFooterSection = props => {
  const fileInput = React.createRef();
  const { classes, t, values } = props;

  const addFile = (event, arrayHelpers) => {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (
          file.size < 15242880 &&
          (file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'application/pdf')
        ) {
          arrayHelpers.push({
            name: file.name,
            type: file.type,
            data: reader.result
          });
        } else if (
          file.type !== 'image/jpeg' &&
          file.type !== 'image/png' &&
          file.type !== 'application/pdf'
        ) {
          return props.enqueueSnackbar(t('ORDER_FORM.WRONG_FILE_TYPE'), {
            variant: 'error'
          });
        } else if (file.size >= 15242880) {
          return props.enqueueSnackbar(t('ORDER_FORM.WRONG_FILE_SIZE'), {
            variant: 'error'
          });
        }
      };
    }
  };

  return (
    <div className={classes.formSection}>
      <Typography className={classes.sectionTitle} component="h2">
        {t('ORDER_FORM.ADDITIONAL')}
      </Typography>
      <Field
        name="comment"
        data-cy="comment"
        variant="outlined"
        label={t('ORDER_FORM.COMMENTS')}
        component={TextField}
        className={classes.textArea}
        margin="normal"
        autoComplete="off"
        type="text"
      />
      <Typography className={classes.sectionTitle} component="h2">
        {t('ORDER_FORM.FILES')}
      </Typography>
      <FieldArray
        name="files"
        render={arrayHelpers => (
          <>
            <div className={classes.imagesHolder}>
              {values.files.length > 0 &&
                values.files.map((image, index) => (
                  <Card key={index} className={classes.imageWrapper}>
                    <Button
                      variant="outlined"
                      className={classes.buttonRemove}
                      type="button"
                      onClick={() => {
                        arrayHelpers.remove(index);
                      }}
                    >
                      {t('ORDER_FORM.REMOVE_FILE')}
                      <DeleteIcon fontSize="small" />
                    </Button>
                    <div className={classes.image}>
                      {image.name.includes('.pdf') ? (
                        <PdfIcon />
                      ) : (
                        <img
                          src={image.data}
                          className={classes.imageContent}
                          alt={image.name}
                        />
                      )}
                    </div>
                    <Typography className={classes.imageTittle} component="h3">
                      {image.name}
                    </Typography>
                  </Card>
                ))}
            </div>
            {props.values.files && props.values.files.length > 9 ? (
              <Tooltip title={t('ORDER_FORM.ADD_FILE_LIMIT')}>
                <Button
                  variant="contained"
                  color="secondary"
                  component="label"
                  className={classes.addFileButton}
                  type="button"
                >
                  {t('ORDER_FORM.ADD_FILE')}
                </Button>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                color="primary"
                component="label"
                className={classes.addFileButton}
                type="button"
              >
                {t('ORDER_FORM.ADD_FILE')}
                <input
                  ref={fileInput}
                  type="file"
                  onChange={event => {
                    addFile(event, arrayHelpers);
                    fileInput.current.value = null;
                  }}
                  style={{ display: 'none' }}
                />
              </Button>
            )}
          </>
        )}
      />
    </div>
  );
};

export default OrderFormFooterSection;
