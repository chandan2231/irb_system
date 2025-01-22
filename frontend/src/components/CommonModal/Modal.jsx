import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import CommonButton from "../CommonButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CommonModal = ({ open, onClose, title, subTitle, content, onSubmit,
  hideSubmitButton = false, hideCancelButton = false
}) => {
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, fontSize: "1.5rem" }}
          id="customized-dialog-title"
        >
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>{subTitle}</Typography>
          {content}
        </DialogContent>
        <DialogActions>
          {
            hideCancelButton === true ? null : <CommonButton onClick={onClose} variant="outlined" sx={{ mr: 1 }}>
              Cancel
            </CommonButton>
          }
          {
            hideSubmitButton === true ? null :
              <CommonButton variant="contained" onClick={onSubmit}>
                Submit
              </CommonButton>
          }
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default CommonModal;
