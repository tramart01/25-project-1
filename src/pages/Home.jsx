import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";
import { Modal, ModalDialog, ModalClose, DialogContent, DialogTitle } from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getLocalStoredData, removePatientData } from "../logic/localSave";
import InstallPWAModal from "../components/InstallPWAModal";
import { formatDate } from "../logic/helperfunctions";




const Home = () => {
  const [open, setOpen] = useState(false); // Bepaalt of de modal met opgeslagen patiënten zichtbaar is
  const [opgeslagenPatienten, setOpgeslagenPatienten] = useState([]); // De lijst met opgeslagen patiënten die worden in geladen bij het laden van de pagina

  
  return (
    <div className="home-container">
      <InstallPWAModal />

      <img
        className="wkz-logo"
        src="https://www.hetwkz.nl/images/logo-wkz.svg"
        width="280px"
      />

      <Typography
        className="titels titel-home"
        level="h1"
        component="h1"
        sx={{
          weight: 700,
          fontFamily: "Inter",
        }}
      >
        Welkom
      </Typography>

      <Divider>Welkom bij de NutriCalc app! </Divider>

      <div className="homescherm-buttons-container">
        {getLocalStoredData().length !== 0 && (
          <IconButton
            className="button button-home"
            sx={{
              backgroundColor: "#FF7A00",
            }}
            onClick={() => GegevensInladen()}
          >
            Verder gaan met een bestaande patiënt
          </IconButton>
        )}

        <Link to="/berekenen-nieuw">
          <IconButton
            className="button button-home"
            sx={{
              backgroundColor: "#FF7A00",
              weight: 300,
            }}
          >
            <AddIcon
              sx={{
                color: "white",
              }}
            />
            Nieuwe berekening
          </IconButton>
        </Link>
      </div>

      {/* Modal waarin de opgeslagen patiënten weergegeven worden */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalDialog minWidth="600px">
          <ModalClose />
          <DialogTitle id="modal-title">Opgeslagen patiënten</DialogTitle>
          <DialogContent sx={{ alignSelf: "center", width: "80%" }}>
            {opgeslagenPatienten.map((patient, i) => (
              <Link
                key={patient}
                to="/berekenen-bestaand"
                state={{ patientId: patient }}
              >
                <Button
                  className="button"
                  sx={{
                    height: "4rem",
                    width: "100%",
                    fontSize: "1.25rem",
                    justifyContent: "space-between",
                    margin: "1rem 0",
                  }}
                  startDecorator={<PersonIcon />}
                  endDecorator={
                    <Tooltip title="Verwijder patiënt">
                      <IconButton
                        onClick={e => handlePatientVerwijderen(e, patient)}
                        sx={{
                          padding: "0",
                          backgroundColor: "transparent",
                          '&:hover' : {
                            backgroundColor: "transparent",
                            color: 'var(--oranje)',	
                          }                    
                        }}
                      >
                        <CloseRounded />
                      </IconButton>
                    </Tooltip>
                  }
                  id={i}
                >
                  {formatDate(patient.substring(19), false)}  {/* Gebruik van substring(19), zodat "NutriCalc-patiënt: " uit de key gefilterd kan worden en alleen de geboortedatum weergegegven wordt. */}
                </Button>
              </Link>
            ))}
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );

  // Haalt de opgeslagen patiënten op uit de localstorage en slaat ze op in de opgeslagenPatienten-constante
  function GegevensInladen() {
    let opgehaaldeKeys = getLocalStoredData();
    setOpgeslagenPatienten(opgehaaldeKeys);
    if (opgehaaldeKeys.length !== 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  //Verwerkt het verwijderen van een patiënt
  function handlePatientVerwijderen(e, patient) {
    e.preventDefault();
    removePatientData(patient);
    GegevensInladen();
  }
};

export default Home;
