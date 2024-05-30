import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useState, useRef } from 'react';


export default function InstallPWAModal(props) {
  const [open, setOpen] = useState(false);
  const deferredPrompt = useRef(null);
  const buttonValue = useRef("Installeren");
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod|macbook/.test(userAgent);
  };
  if (isIos()) {
    buttonValue.current = "Lees hoe";
  }


  const handleBeforeInstallPrompt = (event) => {
    event.preventDefault();
    deferredPrompt.current = event;
    showInstallPromotion();
  }

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  
  function showInstallPromotion() {
    setOpen(true);
  }

  function handleOnClick() {
    if (isIos()) {
      buttonValue.current = "Lees hoe";
      window.open("https://support.apple.com/nl-nl/guide/iphone/iph42ab2f3a7/ios#:~:text=de%20iCloud%2Dgebruikershandleiding.-,Een%20websitesymbool%20in%20het%20beginscherm%20zetten,-Je%20kunt%20een", "_blank")
    } else {
      deferredPrompt.current.prompt()
    }
    setOpen(false);
  }

  
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog variant="outlined" role="alertdialog"
        sx={(theme) => ({
          [theme.breakpoints.only('xs')]: {
            minWidth: '100vw',
            borderRadius: "0"
          },
        })}>
        <DialogTitle>
          <WarningRoundedIcon />
          Installeer de applicatie
        </DialogTitle>
        <Divider />
        <DialogContent>
          Je kunt NutriCalc ook als applicatie installeren op dit apparaat.
        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="success" onClick={handleOnClick}>
            {buttonValue.current}
          </Button>
          <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
            Doorgaan zonder installeren
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}