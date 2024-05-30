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
  const [voedingsmiddel, setVoedingsmiddel] = useState(props.naam);
  const [hoeveelheid, setHoeveelheid] = useState(props.hoeveelheid);
  const [frequentie, setFrequentie] = useState(props.frequentie);
  const voedingsmiddelLijst = props.voedingsmiddelLijst;

  
  useEffect(() => {
    handleOnChange(props.id, props.onChange);
  }, [hoeveelheid, voedingsmiddel, frequentie]);

  useEffect(() => {
    if (hoeveelheid == 0 || isNaN(hoeveelheid)) {
      setHoeveelheid("");
    }
  }, [hoeveelheid])

  useEffect(() => {
    if (frequentie == 0 || isNaN(frequentie)) {
      setFrequentie("");
    }
  }, [frequentie])


  // useEffect(() => {
  //   setHoeveelheid(props.hoeveelheid)
  // }, [props.hoeveelheid])

  // useEffect(() => {
  //   setHoeveelheid(props.hoeveelheid);
  // }, [props.frequentie])
  
  
  return (
    <div className="voedingsmiddel">
      <Box className="voedingsmiddel-container"
        sx={{}}>
        <Select className="voedingsmiddel-select" 
          placeholder="---" 
          indicator={<KeyboardArrowDownIcon />} 
          value={props.naam} 
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
          
          {voedingsmiddelLijst.length > 0 && voedingsmiddelLijst.map((voedingsmiddel, index) => (
            <>
               <Option className="voedingsmiddel-option" key={voedingsmiddel.naam} value={voedingsmiddel.naam} 
                 sx={{
                   padding: "0.25rem 0.5rem",
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

      {/* Hier navragen of er een manier is om onDefocus niet te hoeven gebruiken, of anders op een of andere manier geen waarde meegeven */}
      {props.isEnteraal && 
        <>
          <UserInput naamClass="voedingsmiddel-input" label="none" placeholder="Frequentie" value={frequentie} changeValue={setFrequentie} onDefocus={setFrequentie}  endDecorator="keer" />
          <UserInput naamClass="voedingsmiddel-input" label="none" placeholder="Hoeveelheid" value={hoeveelheid} changeValue={setHoeveelheid} onDefocus={setHoeveelheid} endDecorator="ml" />
        </> }

      {!props.isEnteraal && <UserInput naamClass="voedingsmiddel-input" label="none" placeholder="Hoeveelheid" value={hoeveelheid} changeValue={setHoeveelheid} onDefocus={setHoeveelheid} endDecorator="ml/uur" />}
    </div>
  );

  function handleOnChange(id, onChange) {
    if (voedingsmiddel !== null) {
      let object = voedingsmiddelLijst.filter((voedingsmiddelLijst) => (voedingsmiddelLijst.naam === voedingsmiddel));
      if (object.length > 0) {
        let returnObject = object[0];
        returnObject.hoeveelheid = Number(hoeveelheid);
        if (props.isEnteraal) {
          returnObject.frequentie = Number(frequentie);
        }
        returnObject.isEnteraal = props.isEnteraal;
        onChange(returnObject, id);
      }
    } 
  }
}
