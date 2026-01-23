import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';
import UnarchiveOutlinedIcon from '@material-ui/icons/UnarchiveOutlined';

interface Props {
  buttonText: string;
  confirmText: string;
  confirmAction: () => void;
  buttonIcon?: 'delete' | 'archive' | 'unarchive';
}

const ConfirmButton: React.FC<Props> = ({
  buttonText,
  confirmText,
  confirmAction,
  buttonIcon,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    confirmAction();
    setOpen(false);
  };

  const iconMap = new Map();
  iconMap.set('delete', <DeleteIcon />);
  iconMap.set('archive', <ArchiveOutlinedIcon />);
  iconMap.set('unarchive', <UnarchiveOutlinedIcon />);

  return (
    <div>
      <Button
        variant={buttonIcon ? 'text' : 'outlined'}
        onClick={() => setOpen(true)}
      >
        {buttonIcon && iconMap.get(buttonIcon)} {buttonText}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>{confirmText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="outlined"
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmButton;
