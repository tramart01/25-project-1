import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';


export default function AlertModal(props) {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalDialog variant="outlined" role="alertdialog"
        sx={(theme) => ({
          [theme.breakpoints.only('xs')]: {
            minWidth: '100vw',
            borderRadius: "0"
          },
        })}>
        <DialogTitle>
          <WarningRoundedIcon />
          Let op
        </DialogTitle>
        <Divider />
        <DialogContent>
          Er zijn gegevens ingevuld, als je deze pagina verlaat zijn deze niet opgeslagen. Wil je doorgaan?
        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="danger" onClick={props.onConfirm}>
            Terug naar home
          </Button>
          <Button variant="plain" color="neutral" onClick={() => props.onClose(false)}>
            Verder bewerken
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}