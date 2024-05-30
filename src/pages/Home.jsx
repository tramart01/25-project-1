import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { getPatientData, getLocalStoredData } from "../logic/localSave";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import InstallPWAModal from "../components/InstallPWAModal";
import { useState } from "react";
import { formatDate } from "../logic/helperfunctions";
import { DialogContent, DialogTitle } from "@mui/joy";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";
import Chip from "@mui/joy/Chip";

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
                key={patient.datum}
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
                    <Tooltip
                      title="Aantal dagen voordat patiënt verwijderd wordt"
                      placement="right"
                    >
                      <Chip size="sm" variant="soft">
                        5
                      </Chip>
                    </Tooltip>
                  }
                  id={i}
                >
                  {formatDate(patient.substring(20), false)}
                </Button>
              </Link>
            ))}
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
  function GegevensInladen() {
    let opgehaaldeKeys = getLocalStoredData();
    setOpgeslagenPatienten(opgehaaldeKeys);
    setOpen(true);
  }
};

export default Home;
