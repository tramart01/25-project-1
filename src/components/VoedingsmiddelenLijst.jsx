import IconButton from '@mui/joy/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Voedingsmiddel from '../components/Voedingsmiddel';
import { returnVoedingsLijst } from '../logic/importJSON';


export default function VoedingsmiddelenLijst(props) {
  const waarde = props.isEnteraal ? "enteraal" : "parenteraal";

  const voedingsEigenschappen = returnVoedingsLijst(props.isEnteraal); // Slaat alle voedingsmiddelen uit het bijbehorende json bestand op.
  
  // Sorteert de lijst op alfabetische volgorde op de 'naam' eigenschap van de voedingsmiddelen
  if (props.isEnteraal) {
    voedingsEigenschappen.sort((a, b) => {
        return a.naam.localeCompare(b.naam);
    });
  };
  
  return (
    <div className="div-lijst">
      {/* 
      
      Werkt soort van, maar ff aan Martijn vragen hoe dit op een goeie manier uitgewerkt kan worden.
      
      */}
      {props.voedingsLijst.map((voedingsmiddel, i) => (
      <Voedingsmiddel id={i} naam={voedingsmiddel.naam} voedingsmiddelLijst={voedingsEigenschappen} onChange={voegToeAanLijst} onDelete={handleVerwijderen} isEnteraal={props.isEnteraal} frequentie={voedingsmiddel.frequentie} hoeveelheid={voedingsmiddel.hoeveelheid} />
      ))}
      
      <IconButton className="toevoeg-button button" onClick={handleOnClick} 
        variant="solid" >
        <AddIcon sx={{
          color: 'white',
        }} />
      </IconButton>
    </div>
  )

  function handleOnClick() {
    props.onChange((lijst) => ({
      ...lijst,
      [waarde]: [...lijst[waarde], { naam: "", hoeveelheid: 0 }],
    }))
  }

  function voegToeAanLijst(object, index) {
    const nieuweLijst = props.voedingsLijst.map((voedingsmiddel, i) => {
      if (i === index) {
        return object;
      } else {
        return voedingsmiddel;
      }
    });

    props.onChange((voedingslijst) => ({
      ...voedingslijst,
      [waarde]: nieuweLijst,
    }));
  }

  function handleVerwijderen(index) {
    props.onChange((voedingslijst) => ({
      ...voedingslijst,
      [waarde]: voedingslijst[waarde].filter((voedingsmiddel, i) => i !== index),
    }))
  }
}

