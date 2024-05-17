
export function berekenenVoedingswaardes(voedingsLijst, isEnteraal) {
  var berekendObject = {
    calorieën: 0,
    koolhydraten: 0,
    eiwitten: 0,
    vetten: 0,
    natrium: 0,
    kalium: 0,
    hoeveelheid: 0
  };
  if (voedingsLijst.length > 0) {
    console.log("In Berekenen", berekendObject);
    for (let voedingsObject in voedingsLijst) {
      let object = voedingsLijst[voedingsObject];
      for (const property in object) {
        if (property in berekendObject) {
          let som;
          if (isEnteraal) {
            som = Number(object[property]);
          } else {
            som = Number(object[property] * 24);
          }
          
          if (property !== "hoeveelheid") {
            som = object[property] * object.hoeveelheid / 100;
            if (!isEnteraal) {
              som = (24 * object[property] * object.hoeveelheid) / 100; //Later aanpassen met frequentie denk ik?
            } else {
              som = object[property] * object.hoeveelheid / 100;
            }
          } else if (object.naam === "Fantomalt (per 100 gram)") {
              som = 0;
          } 
          berekendObject[property] += som;
        }
      }
      // for (let voedingsEigenschap in voedingsLijst[voedingsObject]) {
      //   let temp = voedingsEigenschap;
      //   console.log(voedingsLijst[voedingsObject].${temp}, "voedingsmiddel eigenschap");
      // }
      // for (let voedingswaarde in voedingsmiddel) {
      //   console.log(voedingswaarde, "voedingswaarde");
      //   if (Number.isInteger(voedingswaarde)) {
      //     console.log("Berekenen", voedingswaarde / 100 * voedingsLijst.hoeveelheid)
      //   }
      // }
    }
    for (const property in berekendObject) {
      berekendObject[property] = Math.round(berekendObject[property] * 100) / 100;
    }
    // console.log("berekend Object", berekendObject);
  }
  //return Array met berekende waardes
  return berekendObject;
}
