import Typography from "@mui/joy/Typography";
import UserInput from "../components/UserInput";
import VoedingsmiddelenLijst from "../components/VoedingsmiddelenLijst";
import Button from "@mui/joy/Button";
import Switch from "@mui/joy/Switch";
import { useState, useEffect } from "react";
import Divider from '@mui/joy/Divider';
import Table from '@mui/joy/Table';
import { berekenenVoedingswaardes } from '../logic/berekenenVoedingswaardes';
import { getPatientData, storePatientData } from '../logic/localSave';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDate } from '../logic/helperfunctions';
import AlertModal from '../components/AlertModal';
import SuccessModal from '../components/SuccessModal';


export default function CalculatorPberekendeLeeftijd(props) {

 
  // Alle voedingsmiddelen bij elkaar
  const [voedingsLijstEnteraal, setVoedingsLijstEnteraal] = useState([]);
  const [voedingsLijstParenteraal, setVoedingsLijstParenteraal] = useState([]);

  //Berekende voedingswaarden
  const [voedingswaardeLijstEnteraal, setVoedingswaardeLijstEnteraal] = useState([{}]);
  const [voedingswaardeLijstParenteraal, setVoedingswaardeLijstParenteraal] = useState([{}]);
  
  const title = props.isNieuw ? "Nieuwe berekening" : "Laatst bewerkt";
  
  const [leeftijd, setLeeftijd] = useState(0);
  const [datum, setDatum] = useState(formatDate(new Date(), true));
  const [gewichtInput, setGewichtInput] = useState("");
  const [gewicht, setGewicht] = useState(0);
  const [isPolymeer, setIsPolymeer] = useState(true);

   const [opgeslagenObject, setOpgeslagenObject] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!props.isNieuw) {
      patientGegevensOphalen();
    }
  }, [])

  useEffect(() => {
    console.log("opgeslagenobject", opgeslagenObject);
  }, [opgeslagenObject])
  
  useEffect(() => {
    console.log(gewicht, leeftijd);
  }, [gewicht, leeftijd]);
  
  useEffect(() => {
    console.log("Enteraal", voedingsLijstEnteraal);
    console.log("Parenteraal", voedingsLijstParenteraal);
    setVoedingswaardeLijstEnteraal(berekenenVoedingswaardes(voedingsLijstEnteraal, true));
    setVoedingswaardeLijstParenteraal(berekenenVoedingswaardes(voedingsLijstParenteraal, false));
    console.log("In effect", voedingswaardeLijstEnteraal, voedingswaardeLijstParenteraal);
  }, [voedingsLijstEnteraal, voedingsLijstParenteraal]);

  
  return (
    <div className="bereken-pagina-container">

      <AlertModal open={openAlert} onClose={setOpenAlert} onConfirm={() => navigate('/')} />
      
      <SuccessModal open={openSuccess} voedingswaardeLijstEnteraal={voedingswaardeLijstEnteraal} voedingswaardeLijstParenteraal={voedingswaardeLijstParenteraal} gewicht={gewicht} onClose={setOpenSuccess} onClick={() => navigate('/')} >
        <Typography level="h3" >Voedingswaarden:</Typography>
      </SuccessModal>
      
      <div className="header">        
        <HomeIcon className="home-icon hover-icon" fontSize="large" onClick={handleOnHomeClicked}/>
        <Typography className="titels" 
          level="h1"
          component="h1"
          color="#ff7b00"
        >{title}</Typography>
      </div>

      <div className="gegevens-invoer">
        <UserInput naamClass="invoer-datum" type="date" label="Geboortedatum" placeholder="" value={datum} changeValue={setDatum} onDefocus={berekenDatum} />
        <UserInput naamClass="invoer-gewicht" type="text" label="Gewicht" placeholder="18 kg" value={gewichtInput} changeValue={setGewichtInput} onDefocus={handleGewichtChange} />
      </div>
      
      <Typography
        className="invoer-switch"
        component="label"
        endDecorator={
          <Switch sx={{ ml: 1 }} onChange={() => setIsPolymeer(!isPolymeer)} />
        }
      >
        Koemelkallergie
      </Typography>

      <Typography level="h3" component="h3">
        Enteraal
      </Typography>
      
      <VoedingsmiddelenLijst
        leeftijd={leeftijd}
        gewicht={gewicht}
        isPolymeer={isPolymeer}
        isEnteraal={true}
        onChange={changeLijst}
        voedingslijst={voedingsLijstEnteraal}
      ></VoedingsmiddelenLijst>

      <Typography level="h3" component="h3">
        Parenteraal
      </Typography>
      
      <VoedingsmiddelenLijst
        leeftijd={10}
        gewicht={10}
        isPolymeer={true}
        isEnteraal={false}
        onChange={changeLijst}
        voedingslijst={voedingsLijstParenteraal}
      ></VoedingsmiddelenLijst>

      
      <div className="bewaren-button-container">
        <Button className="bewaren-button button" onClick={handlePatientOpslaan}>Bewaren</Button>
      </div>
      
      <Divider sx={{      }} />
      
      <Typography level="h3" component="h3">
        Voedingswaardes:
      </Typography>
      
      {renderTable(voedingswaardeLijstEnteraal, voedingswaardeLijstParenteraal, gewicht)}
    </div>
  );

  function handleGewichtChange(gewicht) {
    let gewichtInt = parseInt(gewicht);
    if (gewichtInt !== null && gewichtInt >= 0) {
      setGewicht(gewichtInt);
    } else {
      setGewicht(null);
    }
  }

  function berekenDatum(datum) {
      // Parse the string to a date object
      const geboorteDatum = new Date(datum);
      const huidigeDatum = new Date();
    
      if (datum.length === 10 && datum.substring(0, 2) !== "000") {
        console.log("in datum if statment", datum);
        setDatum(formatDate(datum, true));
      } 

      // Calculate the berekendeLeeftijd
      let berekendeLeeftijd = huidigeDatum.getFullYear() - geboorteDatum.getFullYear();

      // Adjust berekendeLeeftijd if the current date hasn't occurred yet
      if (huidigeDatum.getMonth() < geboorteDatum.getMonth() || 
          (huidigeDatum.getMonth() === geboorteDatum.getMonth() && huidigeDatum.getDate() < geboorteDatum.getDate())) {
          berekendeLeeftijd--;
      }

      if (berekendeLeeftijd === 0) {
        let maanden = huidigeDatum.getMonth() - geboorteDatum.getMonth();
        if (maanden < 0) {
          maanden += 12;
        }
        if (maanden < 6) {
          berekendeLeeftijd = 0.1;
        } else {
          berekendeLeeftijd = 0.5;
        }
      }

      setLeeftijd(berekendeLeeftijd);
  }


  
  function changeLijst(isEnteraal, lijst) {
    console.log("In changeLijst", isEnteraal, lijst);
    if (isEnteraal) {
      setVoedingsLijstEnteraal(lijst);
    } else {
      setVoedingsLijstParenteraal(lijst);
    }
  }

  function patientGegevensOphalen() {
    let huidigePatient = getPatientData(state.patientId);
    console.log("Huidigepatient", huidigePatient);

    
    setDatum(formatDate(huidigePatient.datum, true));
    setGewicht(huidigePatient.gewicht);
    setGewichtInput(huidigePatient.gewicht);
    setVoedingsLijstEnteraal(huidigePatient.voedingsLijstEnteraal);
    setVoedingsLijstParenteraal(huidigePatient.voedingsLijstParenteraal);
  }

  function handlePatientOpslaan() {
    setOpenSuccess(true);
    setOpgeslagenObject({datum, gewicht, voedingsLijstEnteraal, voedingsLijstParenteraal});
    storePatientData(datum, {datum, gewicht, voedingsLijstEnteraal, voedingsLijstParenteraal});
  }
  
  function handleOnHomeClicked() {
    console.log("CLICK");
    let objectTest = {datum, gewicht, voedingsLijstEnteraal, voedingsLijstParenteraal};
    
    if (gewicht === 0 && leeftijd === 0 && voedingsLijstEnteraal.length === 0 && voedingsLijstParenteraal.length == 0) {
      navigate('/');
    } else if (JSON.stringify(opgeslagenObject) === JSON.stringify(objectTest)) {
      navigate('/');
    } else {
      setOpenAlert(true);
    }
  }
}

//Tijdelijk, totdat de berekenen methode is uitgewerkt en dit makkelijker gemapt kan worden
export function renderTable(enteraal, parenteraal, gewicht) {
  return (
    <Table aria-label="basic table" borderAxis="none" sx={{ '& tr > *:not(:first-child)': { textAlign: 'right' } }}>
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th>Totaal</th>
          <th>Enteraal</th>
          <th>Parenteraal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Vocht</td>
          <td>totaal/dag</td>
          <td>{enteraal.hoeveelheid + parenteraal.hoeveelheid}</td>
          <td>{enteraal.hoeveelheid}</td>
          <td>{parenteraal.hoeveelheid}</td>
        </tr>
        <tr className="tabel-dikgedrukt" >
          <td></td>
          <td>mL/kg/dag</td>
          <td>{((enteraal.hoeveelheid + parenteraal.hoeveelheid) / gewicht).toFixed(2)}</td>
          <td>{(enteraal.hoeveelheid / gewicht).toFixed(2)}</td>
          <td>{(parenteraal.hoeveelheid / gewicht).toFixed(2)}</td>
        </tr>
        <tr>
          <td></td>
          <td>mL/kg/uur</td>
          <td>{(((enteraal.hoeveelheid + parenteraal.hoeveelheid) / gewicht).toFixed(2) / 24).toFixed(1)}</td>
          <td>{((enteraal.hoeveelheid / gewicht).toFixed(2) / 24).toFixed(1)}</td>
          <td>{((parenteraal.hoeveelheid / gewicht).toFixed(2) / 24).toFixed(1)}</td>
        </tr>
        <tr>
          <td colspan="5"></td>
        </tr>

        <tr>
          <td>Calorisch</td>
          <td>totaal/dag</td>
          <td>{enteraal.calorieën + parenteraal.calorieën}</td>
          <td>{enteraal.calorieën}</td>
          <td>{parenteraal.calorieën}</td>
        </tr>
        <tr className="tabel-dikgedrukt" >
          <td></td>
          <td>kcal/kg/dag</td>
          <td>{((enteraal.calorieën + parenteraal.calorieën) / gewicht).toFixed(2)}</td>
          <td>{(enteraal.calorieën / gewicht).toFixed(2)}</td>
          <td>{(parenteraal.calorieën / gewicht).toFixed(2)}</td>
        </tr>
        <tr>
           <td colspan="5"></td>
        </tr>

        <tr className="tabel-dikgedrukt" >
          <td className="tabel-dikgedrukt" >Koolhydraat</td>
          <td>mg/kg/min</td>
          <td>{((enteraal.koolhydraten + parenteraal.koolhydraten) / 1.44 / gewicht).toFixed(2)}</td>
          <td>{((enteraal.koolhydraten / 1.44) / gewicht).toFixed(2)}</td>
          <td>{((parenteraal.koolhydraten / 1.44) / gewicht).toFixed(2)}</td>
        </tr>
        <tr>
          <td>Eiwit</td>
          <td>gr/kg/dag</td>
          <td>{((enteraal.eiwitten + parenteraal.eiwitten) / gewicht).toFixed(2)}</td>
          <td>{(enteraal.eiwitten / gewicht).toFixed(2)}</td>
          <td>{(parenteraal.eiwitten / gewicht).toFixed(2)}</td>
        </tr>

        <tr>
          <td>Vet</td>
          <td>gr/kg/dag</td>
          <td>{((enteraal.vetten + parenteraal.vetten) / gewicht).toFixed(2)}</td>
          <td>{(enteraal.vetten / gewicht).toFixed(2)}</td>
          <td>{(parenteraal.vetten / gewicht).toFixed(2)}</td>
        </tr>
        
        <tr>
          <td>Natrium</td>
          <td>mmol/kg/dag</td>
          <td>{((enteraal.natrium + parenteraal.natrium) / gewicht).toFixed(2)}</td>
          <td>{(enteraal.natrium / gewicht).toFixed(2)}</td>
          <td>{(parenteraal.natrium / gewicht).toFixed(2)}</td>
        </tr>

        <tr>
          <td>Kalium</td>
          <td>mmol/kg/dag</td>
          <td>{((enteraal.kalium + parenteraal.kalium) / gewicht).toFixed(2)}</td>
          <td>{(enteraal.kalium / gewicht).toFixed(2)}</td>
          <td>{(parenteraal.kalium / gewicht).toFixed(2)}</td>
        </tr>
      </tbody>
    </Table>
  );
}


// function GegevensInladen() {
//   // Deze class zorgt ervoor dat de gegevens van de patiënt uit de localstorberekendeLeeftijd gehaald wordt en ingevuld wordt in de pagina.
// }