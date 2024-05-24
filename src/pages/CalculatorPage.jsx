import Typography from "@mui/joy/Typography";
import UserInput from "../components/UserInput";
import VoedingsmiddelenLijst from "../components/VoedingsmiddelenLijst";
import Button from "@mui/joy/Button";
import Switch from "@mui/joy/Switch";
import { useState, useEffect } from "react";
import Divider from '@mui/joy/Divider';
import Table from '@mui/joy/Table';
import { berekenenVoedingswaardes, berekenTotaal } from '../logic/berekenenVoedingswaardes';
import { getPatientData, storePatientData } from '../logic/localSave';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDate } from '../logic/helperfunctions';
import AlertModal from '../components/AlertModal';
import SuccessModal from '../components/SuccessModal';


export default function CalculatorPberekendeLeeftijd(props) {

  const ABSOULTEWAARDEVOCHT = 3500; // 3.5 L/dag
  const BOVENGRENSVOCHT = 300; // 300mL/kg
  const BOVENGRENSVOCHTBABY = 150; // 150mL/kg

  // Alle enterale en parenterale voedingsmiddelen die gebruikt worden in de berekening, bewaard in de bijbehorende array
  const [voedingsLijst, setVoedingsLijst] = useState({enteraal: [], parenteraal: []});


  //Lijst met de totale voedingswaarde voor de enterale en parenterale voedingsmiddelen + het totale aantal voedingsmiddelen
  const [voedingswaardeLijst, setVoedingswaardeLijst] = useState({totaal: {}, enteraal: {}, parenteraal: {}});
  
  const title = props.isNieuw ? "Nieuwe berekening" : "Laatst bewerkt";
  
  const [leeftijd, setLeeftijd] = useState(0);
  const [datum, setDatum] = useState("");
  const [gewichtInput, setGewichtInput] = useState("");
  const [gewicht, setGewicht] = useState(0);
  const [isPolymeer, setIsPolymeer] = useState(true);

  const [opgeslagenObject, setOpgeslagenObject] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openAlertGrens, setOpenAlertGrens] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!props.isNieuw) {
      patientGegevensOphalen();
    }
  }, [])
  
  useEffect(() => {
    console.log("Generale voedingslijst", voedingsLijst);
  }, [voedingsLijst]);


  useEffect(() => {
    console.log("opgeslagenobject", opgeslagenObject);
  }, [opgeslagenObject])
  
  useEffect(() => {
    console.log(gewicht, leeftijd);
  }, [gewicht, leeftijd]);

  useEffect(() => {
    for (let voedingsmiddel in voedingsLijst) {
      setVoedingswaardeLijst((voedingswaarde) => ({
        ...voedingswaarde,
        [voedingsmiddel]: berekenenVoedingswaardes(voedingsLijst[voedingsmiddel], voedingsmiddel),
      }))
      console.log("voedingswaarde", voedingsmiddel);
    }
    console.log(voedingswaardeLijst);
    // setVoedignswaardeLijst(berekenVoedingswaardes(voedingsLijst));
  }, [voedingsLijst])

  useEffect(() => {
    console.log("enteraal of parenteraal veranderd");
    setVoedingswaardeLijst((voedingswaarde) => ({
      ...voedingswaarde,
      totaal: berekenTotaal(voedingswaardeLijst),
    }))
  }, [voedingswaardeLijst.enteraal, voedingswaardeLijst.parenteraal])

  // Navragen of dit een goede manier is of dat het overdreven is :)
  useEffect(() => {
    if (leeftijd < 1) {
      var grens = BOVENGRENSVOCHTBABY;
    } else {
      var grens = BOVENGRENSVOCHT;
    }
    if (voedingswaardeLijst.totaal.hoeveelheid > ABSOULTEWAARDEVOCHT || voedingswaardeLijst.totaal.hoeveelheid / gewicht > grens) {
      setOpenAlertGrens(true);
    }
  }, [voedingswaardeLijst.totaal])
  
  return (
    <div className="bereken-pagina-container">

      <AlertModal open={openAlert} onClose={setOpenAlert} onConfirm={() => navigate('/')} >Er zijn gegevens ingevuld, als je deze pagina verlaat zijn deze niet opgeslagen. Wil je doorgaan?</AlertModal>
      
      <AlertModal open={openAlertGrens} onClose={setOpenAlertGrens} onConfirm={null} >Er is een grenswaarde bereikt. Let op dat je de patiënt niet teveel vocht geeft</AlertModal>
      
      <SuccessModal open={openSuccess} gewicht={gewicht} onClose={setOpenSuccess} onClick={() => navigate('/')} >
        <Typography level="h3" >Voedingswaarden:</Typography>
        <Button variant="plain" color="neutral" onClick={handleKopieren}>
          Kopiëren naar klembord
        </Button>
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
        <UserInput naamClass="invoer-datum" type="date" label="Geboortedatum" placeholder="" value={datum} changeValue={setDatum} onDefocus={berekenLeeftijd} />
        <UserInput naamClass="invoer-gewicht" type="text" label="Gewicht" placeholder="18 kg" value={gewichtInput} changeValue={setGewichtInput} onDefocus={handleGewichtChange} />
      </div>
      
      {/* Hoeft niet meer geïmplementeerd te worden volgens Eva
      <Typography
        className="invoer-switch"
        component="label"
        endDecorator={
          <Switch sx={{ ml: 1 }} onChange={() => setIsPolymeer(!isPolymeer)} />
        }
      >
        Koemelkallergie
      </Typography> */}

      <Typography level="h3" component="h3">
        Enteraal
      </Typography>
      
      <VoedingsmiddelenLijst
        leeftijd={leeftijd}
        gewicht={gewicht}
        isPolymeer={isPolymeer}
        isEnteraal={true}
        onChange={setVoedingsLijst}
        voedingsLijst={voedingsLijst.enteraal}
      ></VoedingsmiddelenLijst>

      <Typography level="h3" component="h3">
        Parenteraal
      </Typography>
      
      <VoedingsmiddelenLijst
        leeftijd={leeftijd}
        gewicht={gewicht}
        isPolymeer={isPolymeer}
        isEnteraal={false}
        onChange={setVoedingsLijst}
        voedingsLijst={voedingsLijst.parenteraal}
      ></VoedingsmiddelenLijst>

      
      <div className="bewaren-button-container">
        <Button className="bewaren-button button" onClick={handlePatientOpslaan}>Bewaren</Button>
      </div>
      
      <Divider sx={{      }} />
      
      <Typography level="h3" component="h3">
        Voedingswaardes:
      </Typography>
      
      {renderTable(voedingswaardeLijst, gewicht)}
    </div>
  );

  //Deze functie verzorgt het correct behandelen van een verandering in het gewicht input veld
  function handleGewichtChange(gewicht) {
    let gewichtInt = parseInt(gewicht);
    if (gewichtInt !== null && gewichtInt >= 0) {
      setGewicht(gewichtInt);
    } else {
      setGewicht(null);
    }
  }

  // Deze functie berekent de leeftijd van de patiënt uit de ingevulde datum in het Geboortedatum veld
  function berekenLeeftijd(datum) {
      const geboorteDatum = new Date(datum);
      const huidigeDatum = new Date();
    
      if (datum.length === 10 && datum.substring(0, 2) !== "000") {
        console.log("in datum if statment", datum);
        setDatum(formatDate(datum, true));
      } 

      let berekendeLeeftijd = huidigeDatum.getFullYear() - geboorteDatum.getFullYear();

      if (huidigeDatum.getMonth() < geboorteDatum.getMonth() || 
          (huidigeDatum.getMonth() === geboorteDatum.getMonth() && huidigeDatum.getDate() < geboorteDatum.getDate())) {
          berekendeLeeftijd--;
      }

    // Als de leeftijd onder de 1 is, wordt de leeftijd op 0.5 gezet als de patiënt 6 maanden of ouder is. Anders wordt de leeftijd op 0.1 gezet
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


  // Deze functie verzorgt het juist ophalen en weergeven van de patiëntgegevens uit de localStorage, d.m.v. de helperfunctie uit het importJSON bestand
  function patientGegevensOphalen() {
    let huidigePatient = getPatientData(state.patientId);
    console.log("Huidigepatient", huidigePatient);

    setOpgeslagenObject(huidigePatient);
    
    setDatum(formatDate(huidigePatient.datum, true));
    berekenLeeftijd(huidigePatient.datum);
    setGewicht(huidigePatient.gewicht);
    setGewichtInput(huidigePatient.gewicht);
    
    setVoedingsLijst(huidigePatient.voedingsLijst);
  }

  // Deze functie verzorgt het juist opslaan van de patiëntgegevens in de localStorage, d.m.v. de helperfunctie uit het inportJSON-bestand
  function handlePatientOpslaan() {
    setOpenSuccess(true);
    setOpgeslagenObject({datum, gewicht, voedingsLijst});
    storePatientData(datum, {datum, gewicht, voedingsLijst});
  }

  // Deze functie kijkt of de huidige ingevulde gelijk staat aan de opgeslagen informatie. Zo niet, dan krijgt de gebruiker een popup waarin aangegeven wordt dat de gegevens niet opgeslagen zijn als de gebruiker op doorgaan drukt
  function handleOnHomeClicked() {
    let objectTest = {datum, gewicht, voedingsLijst};
    console.log("CLICK", objectTest, opgeslagenObject);
    
    if (gewicht === 0 && leeftijd === 0 && voedingsLijst.enteraal.length === 0 && voedingsLijst.parenteraal.length == 0) {
      navigate('/');
    } else if (JSON.stringify(opgeslagenObject) === JSON.stringify(objectTest)) {
      navigate('/');
    } else {
      setOpenAlert(true);
    }
  }


  // Deze functie verzorgt het kopiëren van de belangrijke voedingswaardes, zodat deze door de gebruiker makkelijk verwerkt kunnen worden in het EPD
  function handleKopieren() {
    var outputText = `Vocht: ${voedingswaardeLijst.totaal.hoeveelheid} ml/kg/d; 
Calorisch: ${voedingswaardeLijst.totaal.calorieën} kcal/kg/d; 
Glucose Intake: ${voedingswaardeLijst.totaal.koolhydraten} mg/kg/min; 
Natrium Intake: ${voedingswaardeLijst.totaal.koolhydraten} mmol/kg/d`;
    navigator.clipboard.writeText(outputText)
      .then(() => { 
        alert("De volgende informatie is gekopieërd:\n" + outputText);
      });
    
  }
}

//Tijdelijk, totdat de berekenen methode is uitgewerkt en dit makkelijker gemapt kan worden
export function renderTable(voedingswaardes, gewicht) {
  var enteraal = voedingswaardes.enteraal;
  var parenteraal = voedingswaardes.parenteraal;
  var totaal = voedingswaardes.totaal;
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
            <td>{totaal.hoeveelheid}</td>
            <td>{enteraal.hoeveelheid}</td>
            <td>{parenteraal.hoeveelheid}</td>
          </tr>
          <tr className="tabel-dikgedrukt" >
            <td></td>
            <td>mL/kg/dag</td>
            <td>{(totaal.hoeveelheid / gewicht).toFixed(2)}</td>
            <td>{(enteraal.hoeveelheid / gewicht).toFixed(2)}</td>
            <td>{(parenteraal.hoeveelheid / gewicht).toFixed(2)}</td>
          </tr>
          <tr>
            <td></td>
            <td>mL/kg/uur</td>
            <td>{((totaal.hoeveelheid / gewicht)/ 24).toFixed(1)}</td>
            <td>{((enteraal.hoeveelheid / gewicht).toFixed(2) / 24).toFixed(1)}</td>
            <td>{((parenteraal.hoeveelheid / gewicht).toFixed(2) / 24).toFixed(1)}</td>
          </tr>
          <tr>
            <td colspan="5"></td>
          </tr>
  
          <tr>
            <td>Calorisch</td>
            <td>totaal/dag</td>
            <td>{totaal.calorieën}</td>
            <td>{enteraal.calorieën}</td>
            <td>{parenteraal.calorieën}</td>
          </tr>
          <tr className="tabel-dikgedrukt" >
            <td></td>
            <td>kcal/kg/dag</td>
            <td>{(totaal.calorieën / gewicht).toFixed(2)}</td>
            <td>{(enteraal.calorieën / gewicht).toFixed(2)}</td>
            <td>{(parenteraal.calorieën / gewicht).toFixed(2)}</td>
          </tr>
          <tr>
             <td colspan="5"></td>
          </tr>
  
          <tr className="tabel-dikgedrukt" >
            <td className="tabel-dikgedrukt" >Koolhydraat</td>
            <td>mg/kg/min</td>
            <td>{(totaal.koolhydraten / 1.44 / gewicht).toFixed(2)}</td>
            <td>{((enteraal.koolhydraten / 1.44) / gewicht).toFixed(2)}</td>
            <td>{((parenteraal.koolhydraten / 1.44) / gewicht).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Eiwit</td>
            <td>gr/kg/dag</td>
            <td>{(totaal.eiwitten / gewicht).toFixed(2)}</td>
            <td>{(enteraal.eiwitten / gewicht).toFixed(2)}</td>
            <td>{(parenteraal.eiwitten / gewicht).toFixed(2)}</td>
          </tr>
  
          <tr>
            <td>Vet</td>
            <td>gr/kg/dag</td>
            <td>{(totaal.vetten / gewicht).toFixed(2)}</td>
            <td>{(enteraal.vetten / gewicht).toFixed(2)}</td>
            <td>{(parenteraal.vetten / gewicht).toFixed(2)}</td>
          </tr>
          
          <tr>
            <td>Natrium</td>
            <td>mmol/kg/dag</td>
            <td>{(totaal.natrium / gewicht).toFixed(2)}</td>
            <td>{(enteraal.natrium / gewicht).toFixed(2)}</td>
            <td>{(parenteraal.natrium / gewicht).toFixed(2)}</td>
          </tr>
  
          <tr>
            <td>Kalium</td>
            <td>mmol/kg/dag</td>
            <td>{(totaal.kalium / gewicht).toFixed(2)}</td>
            <td>{(enteraal.kalium / gewicht).toFixed(2)}</td>
            <td>{(parenteraal.kalium / gewicht).toFixed(2)}</td>
          </tr>
        </tbody>
      </Table>
    );
}