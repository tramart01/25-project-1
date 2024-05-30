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
