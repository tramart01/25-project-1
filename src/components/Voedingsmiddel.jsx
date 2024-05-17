import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { useState, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UserInput from '../components/UserInput';
import ListItem from '@mui/joy/ListItem';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import ListDivider from '@mui/joy/ListDivider';
import IconButton from '@mui/joy/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';


export default function Voedingsmiddel(props) {
  const [voedingsmiddel, setVoedingsmiddel] = useState(null);
  const [hoeveelheid, setHoeveelheid] = useState(0);
  const [frequentie, setFrequentie] = useState(0);
  const voedingsmiddelLijst = props.voedingsmiddelLijst;

  
  useEffect(() => {
    handleOnChange(props.id, props.onChange);
  }, [hoeveelheid, voedingsmiddel, frequentie]);

  
  return (
    <div className="voedingsmiddel">
      <Box className="voedingsmiddel-container"
        sx={{}}>
        <Select className="voedingsmiddel-select" 
          placeholder="---" 
          indicator={<KeyboardArrowDownIcon />} 
          value={voedingsmiddel} 
          defaultValue="" 
          onChange={(e, value) => setVoedingsmiddel(value)}
          {...(voedingsmiddel && {
            
            endDecorator: (
              <IconButton
                onMouseDown={(event) => {
                  event.stopPropagation(); // Zorgt ervoor dat de dropdown niet verschijnt als er op de knop gedrukt wordt
                }}
                onClick={() => props.onDelete(props.id)}
                sx={{
                  '&:hover' : {
                    color: 'var(--blauw-hover)',	
                  }                    
                }}
              >
                <CloseRounded />
              </IconButton>
            ),
            indicator: null,
          })}
          
          sx={{
            [`& .${selectClasses.indicator}`]: {
              transition: '0.2s',
              [`&.${selectClasses.expanded}`]: {
                transform: 'rotate(-180deg)',
              },
            },
          }} 
          slotProps={{
            listbox: {
              placement: "bottom-start",
              sx: {
                minWidth: "inherit",
                padding: 0,
              }
            }
          }}
          >
  
          <ListItem sticky>
            <Typography level="body-xs" textTransform="uppercase">
              Gefilterd ({voedingsmiddelLijst.length})
            </Typography>
          </ListItem>
          
          
          {voedingsmiddelLijst.length > 0 && voedingsmiddelLijst.map((voedingsmiddel, index) => (
            <>
               <Option className="voedingsmiddel-option" key={voedingsmiddel.naam} value={voedingsmiddel.naam} 
                 sx={{
                   paddingTop: "0.25rem",
                   paddingBottom: "0.25rem",
                 }}
                 >{voedingsmiddel.naam}</Option>
              {index + 1 !== voedingsmiddelLijst.length && <ListDivider role="none" sx={{
                  margin: "0",
               }}/>}
            </>
           ))}
          
          {voedingsmiddelLijst.length === 0 && <Option className="voedingsmiddel-option" value="" indicator={<KeyboardArrowDownIcon />} disabled={true}>Geen voedingsmiddelen voor deze gegevens</Option>}
        </Select>
      </Box>
      
      {props.isEnteraal && <UserInput naamClass="voedingsmiddel-input" label="none" placeholder="Hoeveelheid" changeValue={setHoeveelheid} endDecorator="ml" />}


      {!props.isEnteraal && <UserInput naamClass="voedingsmiddel-input" label="none" placeholder="Hoeveelheid" changeValue={setHoeveelheid} endDecorator="ml/uur" />}
      
      {props.isEnteraal && <UserInput naamClass="voedingsmiddel-input" label="none" placeholder="Frequentie" changeValue={setFrequentie} endDecorator="keer/dag" />}
    </div>
  );

  function handleOnChange(id, onChange) {
    if (voedingsmiddel !== null) {
      let object = voedingsmiddelLijst.filter((voedingsmiddelLijst) => (voedingsmiddelLijst.naam === voedingsmiddel));
      let returnObject = object[0];
      returnObject.hoeveelheid = hoeveelheid;
      if (props.isEnteraal) {
        returnObject.frequentie = frequentie;
      }
      onChange(object[0], id);
    } 
  }

}

// Wordt niet gebruikt
function renderDropDown(arr) {
  return (
    <Select defaultValue="" onChange={(event) => setVoedingsmiddel(event.target.value)}>
      {arr.map((voedingsmiddel) => (
        <Option value={voedingsmiddel.naam}>{voedingsmiddel.naam}</Option>
      ))}
    </Select>
  );
}

//Functie om te testen of deze Class de gewenste output geeft
function renderTable(arr) {
  return (
    <table>
      <thead>
        <tr>
          <th>Naam</th>
          <th>Calorieën</th>
          <th>Eiwitten</th>
          <th>Vetten</th>
          <th>Koolhydraten</th>
          <th>Natrium</th>
          <th>Kalium</th>
          <th>Calcium</th>
          <th>Magnesium</th>
          <th>Fosfaat</th>
          <th>Is Polymeer</th>
          <th>Min Leeftijd</th>
          <th>Max Leeftijd</th>
          <th>Min Gewicht</th>
          <th>Max Gewicht</th>
        </tr>
      </thead>
      <tbody>
        {arr.map((voedingsmiddel, index) => (
          <tr key={index}>
            <td>{voedingsmiddel.naam}</td>
            <td>{voedingsmiddel.calorieën}</td>
            <td>{voedingsmiddel.eiwitten}</td>
            <td>{voedingsmiddel.vetten}</td>
            <td>{voedingsmiddel.koolhydraten}</td>
            <td>{voedingsmiddel.natrium}</td>
            <td>{voedingsmiddel.kalium}</td>
            <td>{voedingsmiddel.calcium}</td>
            <td>{voedingsmiddel.magnesium}</td>
            <td>{voedingsmiddel.fosfaat}</td>
            <td>{voedingsmiddel.isPolymeer.toString()}</td>
            <td>{voedingsmiddel.minLeeftijd}</td>
            <td>{voedingsmiddel.maxLeeftijd}</td>
            <td>{voedingsmiddel.minGewicht}</td>
            <td>{voedingsmiddel.maxGewicht}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
