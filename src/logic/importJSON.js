import voedingsEigenschappenEnteraal from '../data/voedingseigenschappen test.json';
import voedingsEigenschappenParenteraal from '../data/parenteraalVoeding.json';

export function returnVoedingsLijst(isEnteraal) {
  if (isEnteraal) {
  return voedingsEigenschappenEnteraal.voedingsmiddelen;
  }
  else {
    return voedingsEigenschappenParenteraal.voedingsmiddelen;
  }
}

export async function returnVoedingsLijstAsync(isEnteraal) {
  let lijst;
  if (isEnteraal) {
    lijst = '../data/voedingseigenschappen test.json';
  } else {
    lijst = '../data/parenteraalVoeding.json';
  }

  var waarde;
  try {
    waarde = await import(lijst);
  } catch (e) {
    //Popup oid met bericht naar gebruiker
  } finally {  
    return waarde;
  }
}