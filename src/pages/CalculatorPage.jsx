import Typography from "@mui/joy/Typography";
import UserInput from "../components/UserInput";
import VoedingsmiddelenLijst from "../components/VoedingsmiddelenLijst";
import Button from "@mui/joy/Button";
import { useState, useEffect } from "react";
import Divider from '@mui/joy/Divider';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import { berekenTotaal, berekenVoedingsWaardes, berekenenVoedingswaardesTabel } from '../logic/berekenenVoedingswaardes';
import { getPatientData, storePatientData } from '../logic/localSave';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDate } from '../logic/helperfunctions';
import AlertModal from '../components/AlertModal';
import SuccessModal from '../components/SuccessModal';


export default function CalculatorPage(props) {

  const ABSOULTEWAARDEVOCHT = 3500; // maximale vochtintake op een dag is: 3.5 L/dag
  const BOVENGRENSVOCHT = 300; // bovengrens vochtintake gebaseerd op gewicht is: 300mL/kg
  const BOVENGRENSVOCHTBABY = 150; // Voor een baby is bovengrens: 150mL/kg

  // Alle enterale en parenterale voedingsmiddelen die gebruikt worden in de berekening, bewaard in de bijbehorende array
  const [voedingsmiddelenLijst, setVoedingsmiddelenLijst] = useState({enteraal: [], parenteraal: []});


  //Lijst met de totale voedingswaarde voor de enterale en parenterale voedingsmiddelen + het totale aantal voedingsmiddelen
  const [voedingswaardeLijst, setVoedingswaardeLijst] = useState({totaal: {}, enteraal: {}, parenteraal: {}});

  const [voedingswaardeTabel, setVoedingswaardeTabel] = useState({totaal: {}, enteraal: {}, parenteraal: {}});
  
  const title = props.isNieuw ? "Nieuwe berekening" : "Laatst bewerkt"; // Als de berekening een nieuwe berekening is, wordt de titel "Nieuwe berekening" weergegeven, andrs wordt de titel "Laatst bewerkt" weergegeven.
  
  const [leeftijd, setLeeftijd] = useState(0);
  const [datum, setDatum] = useState("");
  const [gewichtInput, setGewichtInput] = useState("");
  const [gewicht, setGewicht] = useState(0);

  const [opgeslagenObject, setOpgeslagenObject] = useState({}); // Als de patient opgeslagen wordt, dan wordt dat object ook in deze variabele opgeslagen, zodat er makkelijk gekeken kan worden of de ingevulde gegevens op de pagina aangepast zijn.
  
  const [openAlert, setOpenAlert] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openAlertGrens, setOpenAlertGrens] = useState(false);
  
  const navigate = useNavigate(); // Verzorgt de navigatie naar een andere pagina
  const { state } = useLocation(); // Deze variabele wordt gebruikt om de key van de patiënt die bewerekt wordt te kunnen benaderen en gebruiken

  //Doordat het tweede argument een lege array is wordt het effect maar een keer doorlopen
  useEffect(() => {
    if (!props.isNieuw) {
      patientGegevensOphalen();
    }
  }, [])


  //Als de voedingsLijst veranderd, moet de berekening van de voedingswaardes opnieuw gedaan worden.
  useEffect(() => {
    let berekendeWaarden = {};
    for (let voedingsmiddel in voedingsmiddelenLijst) {
      berekendeWaarden[voedingsmiddel] = berekenVoedingsWaardes(voedingsmiddelenLijst[voedingsmiddel]);
    }
    berekendeWaarden.totaal = voedingswaardeLijst.totaal;
    setVoedingswaardeLijst(berekendeWaarden);
  }, [voedingsmiddelenLijst])

  //Berekent de totale voedingswaarden wanneer er een verandering in de enterale of parenterale lijst plaatsvindt
  useEffect(() => {
    setVoedingswaardeLijst((voedingswaarde) => ({
      ...voedingswaarde,
      totaal: berekenTotaal(voedingswaardeLijst)
    }))
  }, [voedingswaardeLijst.enteraal, voedingswaardeLijst.parenteraal])

  // Als de lijst met voedingswaardes verandert, moet de tabel geüpdate worden. Dit zorgt ervoor dat de voedingswaardes voor in de tabel opnieuw berekent worden en worden opgeslagen in de voedingswaardeTabel constante.
  useEffect(() => {
    let berekendeWaarden = {};

    for (let voedingsmiddel in voedingswaardeLijst) {
      berekendeWaarden[voedingsmiddel] = berekenenVoedingswaardesTabel(voedingswaardeLijst[voedingsmiddel], gewicht);
    }
    setVoedingswaardeTabel(berekendeWaarden);
  }, [voedingswaardeLijst]);

  // Als de lijst met voedingswaardes verandert, wordt gekeken of de ingevulde waardes de bovengrens/absulote waarde voor vochtintake overschrijdt
  useEffect(() => {
    if (leeftijd < 1) {
      var grens = BOVENGRENSVOCHTBABY;
    } else {
      var grens = BOVENGRENSVOCHT;
    }
    if (voedingswaardeLijst.totaal.hoeveelheid !== null && (voedingswaardeLijst.totaal.hoeveelheid > ABSOULTEWAARDEVOCHT || voedingswaardeLijst.totaal.hoeveelheid / gewicht > grens)) {
      setOpenAlertGrens(true);
    }
  }, [voedingswaardeLijst.totaal])
  
  return (
    <div className="bereken-pagina-container">

      <AlertModal open={openAlert} onClose={setOpenAlert} onConfirm={() => navigate('/')} >Er zijn gegevens ingevuld, als je deze pagina verlaat zullen deze niet opgeslagen worden. Wil je doorgaan?</AlertModal>
      
      <AlertModal open={openAlertGrens} onClose={setOpenAlertGrens} onConfirm={null} >Er is een grenswaarde bereikt. Let op dat je de patiënt niet teveel vocht geeft</AlertModal>
      
      <SuccessModal open={openSuccess} gewicht={gewicht} onClose={setOpenSuccess} onClick={() => navigate('/')} >
        <div className="success-modal-container">
          <Typography level="h3" >Voedingswaarden:</Typography>
          <Button variant="plain" color="neutral" onClick={handleKopieren}>
            Kopiëren naar klembord
          </Button>
        </div>
        {renderTabel(voedingswaardeTabel)}
        
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

      <Typography level="h3" component="h3">
        Enteraal
      </Typography>
      
      <VoedingsmiddelenLijst
        leeftijd={leeftijd}
        gewicht={gewicht}
        isEnteraal={true}
        onChange={setVoedingsmiddelenLijst}
        voedingsLijst={voedingsmiddelenLijst.enteraal}
      ></VoedingsmiddelenLijst>

      <Typography level="h3" component="h3">
        Parenteraal
      </Typography>
      
      <VoedingsmiddelenLijst
        leeftijd={leeftijd}
        gewicht={gewicht}
        isEnteraal={false}
        onChange={setVoedingsmiddelenLijst}
        voedingsLijst={voedingsmiddelenLijst.parenteraal}
      ></VoedingsmiddelenLijst>

      
      <div className="bewaren-button-container">
        <Button className="bewaren-button button" onClick={handlePatientOpslaan}>Bewaren</Button>
      </div>
      
      <Divider sx={{      }} />
      
      <Typography level="h3" component="h3">
        Voedingswaardes:
      </Typography>
      
      {renderTabel(voedingswaardeTabel)}
    </div>
  );

  // Deze functie berekent de leeftijd van de patiënt uit de ingevulde datum in het Geboortedatum veld
  function berekenLeeftijd(datum) {
      const geboorteDatum = new Date(datum);
      const huidigeDatum = new Date();
    
      if (datum.length === 10 && datum.substring(0, 2) !== "000") {
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

    setOpgeslagenObject(huidigePatient);
    
    setDatum(formatDate(huidigePatient.datum, true));
    berekenLeeftijd(huidigePatient.datum);
    setGewicht(huidigePatient.gewicht);
    setGewichtInput(huidigePatient.gewicht);
    
    setVoedingsmiddelenLijst(huidigePatient.voedingsLijst);
  }
  
  //Tijdelijk, totdat de berekenen methode is uitgewerkt en dit makkelijker gemapt kan worden
  function renderTabel(tabelWaardes) {
    var enteraal = tabelWaardes.enteraal;
    var parenteraal = tabelWaardes.parenteraal;
    var totaal = tabelWaardes.totaal;

    const tableRows = [
      { label: 'Vocht', subLabel: 'totaal/dag', key: 'vochtTotaal' },
      { subLabel: 'mL/kg/dag', key: 'vochtKGPerDag', bold: true },
      { subLabel: 'mL/kg/uur', key: 'vochtKGPerUur' },
      { label: 'Calorisch', subLabel: 'totaal/dag', key: 'calorieënTotaal' },
      { subLabel: 'kcal/kg/dag', key: 'calorieënPerKG', bold: true },
      { label: 'Koolhydraat', subLabel: 'mg/kg/min', key: 'koolhydraten', bold: true },
      { label: 'Eiwit', subLabel: 'gr/kg/dag', key: 'eiwitten' },
      { label: 'Vet', subLabel: 'gr/kg/dag', key: 'vetten' },
      { label: 'Natrium', subLabel: 'mmol/kg/dag', key: 'natrium' },
      { label: 'Kalium', subLabel: 'mmol/kg/dag', key: 'kalium' },
    ];

      return (
        <Sheet sx={{height: "100%", overflow: "auto"}}>
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
              {tableRows.map((row, index) => {
                return (
                  <tr key={index} className={row.bold ? 'tabel-dikgedrukt' : ''}>
                    <td className={row.bold ? 'tabel-dikgedrukt' : ''}>{row.label}</td>
                    <td>{row.subLabel}</td>
                    <td>{totaal[row.key]}</td>
                    <td>{enteraal[row.key]}</td>
                    <td>{parenteraal[row.key]}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Sheet>
      );

  }

  //Deze functie verzorgt het correct behandelen van een verandering in het gewicht input veld
  function handleGewichtChange(gewicht) {
    let gewichtInt = parseInt(gewicht);
    if (gewichtInt !== null && gewichtInt >= 0) {
      setGewicht(gewichtInt);
    } else {
      setGewicht(null);
      setGewichtInput("");
    }
  }
  
  // Deze functie verzorgt het juist opslaan van de patiëntgegevens in de localStorage, d.m.v. de helperfunctie uit het inportJSON-bestand
  function handlePatientOpslaan() {
    setOpenSuccess(true);
    setOpgeslagenObject({datum, gewicht, voedingsLijst: voedingsmiddelenLijst});
    storePatientData(datum, {datum, gewicht, voedingsLijst: voedingsmiddelenLijst});
  }

  // Deze functie kijkt of de huidige ingevulde gelijk staat aan de opgeslagen informatie. Zo niet, dan krijgt de gebruiker een popup waarin aangegeven wordt dat de gegevens niet opgeslagen zijn als de gebruiker op doorgaan drukt
  function handleOnHomeClicked() {
    let objectTest = {datum, gewicht, voedingsLijst: voedingsmiddelenLijst};
    
    if (gewicht === 0 && leeftijd === 0 && voedingsmiddelenLijst.enteraal.length === 0 && voedingsmiddelenLijst.parenteraal.length == 0) {
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
