import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Divider from '@mui/joy/Divider';
import CloseRounded from '@mui/icons-material/CloseRounded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HomeIcon from '@mui/icons-material/Home';
import { renderTable } from '../pages/CalculatorPage';


export default function SuccessModal (props) {
  return (
    <Modal open={props.open} onClose={() => props.onClose(false)}>
      <ModalDialog variant="outlined"
        sx={(theme) => ({
          [theme.breakpoints.only('xs')]: {
            top: 'unset',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
            transform: 'none',
            maxWidth: 'unset',
            maxHeight: '100vh',
            backgroundColor: '#ADD8E6'
          },
        })}>
        <DialogTitle level="h2" sx={{width: "100%"}}>
          <CheckCircleOutlineIcon sx={{alignSelf: "center", color: "var(--oranje)", fontSize: "2rem"}} />
          Patiënt succesvol bewaard!
          <CloseRounded 
            sx={{
              alignSelf: "flex-start", 
              marginLeft: "auto", 
              fontSize: "2rem",
              '&:hover' : {
                color: 'var(--blauw-hover)',
                cursor: "pointer"
              },                    
            }}
            onClick={() => props.onClose(false)}/>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {props.children}
          {/* {renderTable(props.voedingswaardeLijstEnteraal, props.voedingswaardeLijstParenteraal, props.gewicht)} */}
        </DialogContent>
        <DialogActions sx={{justifyContent: "center"}}>
          <HomeIcon className="hover-icon" sx={{fontSize: "3rem"}} onClick={props.onClick} />
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}