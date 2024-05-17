import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

// Gebruikt de elementen van Joy UI om een input field te maken waarin het type (text/number/calendar) de placeholder text en onChange worden meegegeven als props.
export default function UserInput(props) {
  return (
    <FormControl>
      { props.label !== "none" && <FormLabel>{props.label}</FormLabel>}
      <Input className={props.naamClass} type={props.type} placeholder={props.placeholder} value={props.value} onChange={e => props.changeValue(e.target.value)} onBlur={e => props.onDefocus(e.target.value)} endDecorator={props.endDecorator} />
    </FormControl>
  )
}