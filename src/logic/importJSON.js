import voedingsEigenschappenEnteraal from '../data/enteraalVoeding.json';
import voedingsEigenschappenParenteraal from '../data/parenteraalVoeding.json';

export function returnVoedingsLijst(isEnteraal) {
  if (isEnteraal) {
  return voedingsEigenschappenEnteraal.voedingsmiddelen;
  }
  else {
    return voedingsEigenschappenParenteraal.voedingsmiddelen;
  }
}
