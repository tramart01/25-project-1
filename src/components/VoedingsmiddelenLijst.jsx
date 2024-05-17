import IconButton from '@mui/joy/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Voedingsmiddel from '../components/Voedingsmiddel';
import { useState, useEffect } from 'react';
import { returnVoedingsLijst } from '../logic/importJSON';
import { berekenenVoedingswaardes } from '../logic/berekenenVoedingswaardes';


export default function VoedingsmiddelenLijst(props) {
  const voedingsEigenschappen = returnVoedingsLijst(props.isEnteraal); // Slaat alle voedingsmiddelen uit het bijbehorende json bestand op.
  const [voedingsLijst, setVoedingsLijst] = useState([]); // Lijst met alle aangemaakte voedingsmiddelen objecten
  const [voedingsmiddelLijst, setVoedingsmiddelLijst] = useState([]);   //Lijst met gefilterde voedingsmiddelen

  //Kijken of dit nog op een andere manier mogelijk is. Dit is geen must, maar als er tijd voor is kan het. Kan namelijk mss dan futureproof zijn, mochten er andere soorten middelen toegevoegd worden die speciale uitzonderingen oid hebben, zoals Fantomalt en ORS hebben
  useEffect(() => {
    console.log("is het polymeer:", props.isPolymeer);
    if (props.gewicht >= 0 && props.gewicht !== null && props.leeftijd >= 0 && props.leeftijd !== null) {
      if (!props.isEnteraal) {
        setVoedingsmiddelLijst(voedingsEigenschappen);
      } else {  
          setVoedingsmiddelLijst(voedingsEigenschappen.filter((voedingsmiddel) => (props.isPolymeer === voedingsmiddel.isPolymeer && ((props.leeftijd >= voedingsmiddel.minLeeftijd && props.leeftijd < voedingsmiddel.maxLeeftijd) || (props.gewicht >= voedingsmiddel.minGewicht && props.gewicht < voedingsmiddel.maxGewicht))) || (voedingsmiddel.naam === "ORS" || voedingsmiddel.naam === "Fantomalt (per 100 gram)")));
      }
    } else {
      setVoedingsmiddelLijst([]);
  
    }
  }, [props.gewicht, props.leeftijd, props.isPolymeer]);

  //Implementeren in calculatorpage
  useEffect(() => {
    console.log("voedingslijst", voedingsLijst);
    props.onChange(props.isEnteraal, voedingsLijst);
  }, [voedingsLijst]);
    
  return (
    <div className="div-lijst">
      {/* 
      
      Werkt soort van, maar ff aan Martijn vragen hoe dit op een goeie manier uitgewerkt kan worden.
      
      */}
      {voedingsLijst.map((voedingsmiddel, i) => (
      <Voedingsmiddel id={i} naam={voedingsmiddel.naam} voedingsmiddelLijst={voedingsmiddelLijst} onChange={voegToeAanLijst} onDelete={handleVerwijderen} isEnteraal={props.isEnteraal} />
      ))}
      
      <IconButton className="toevoeg-button button" onClick={() => setVoedingsLijst(
        [
          ...voedingsLijst, 
          { naam: "", hoeveelheid: 0 }
        ]
      )} variant="solid">
        <AddIcon sx={{
          color: 'white',
        }} />
      </IconButton>
    </div>
  )

  function voegToeAanLijst(object, index) {
    const nieuweLijst = voedingsLijst.map((voedingsmiddel, i) => {
      if (i === index) {
        return object;
      } else {
        return voedingsmiddel;
      }
    });
    setVoedingsLijst(nieuweLijst);
  }

  function handleVerwijderen(index) {
    setVoedingsLijst(voedingsLijst.filter(voeding => voeding !== index));
  }
}

