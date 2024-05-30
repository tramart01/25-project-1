export function berekenVoedingsWaardes(voedingsLijst) {
  console.log("Beginlijst", voedingsLijst);
  var berekendObject = {
    calorieën: 0,
    koolhydraten: 0,
    eiwitten: 0,
    vetten: 0,
    natrium: 0,
    kalium: 0,
    hoeveelheid: 0 //Vocht
  }

  for (const property in berekendObject) {
    let som = berekendObject[property];
    for (let voedingsObject in voedingsLijst) {
      let object = voedingsLijst[voedingsObject];
      let frequentie = object.frequentie != null ? object.frequentie : 24; // als object parenteraal is, dan heeft object geen frequentie property, dus dan wordt frequentie 24;
      if (property === "hoeveelheid") {
        if (!object.isPoeder) { // De hoeveelheid vocht staat gelijk aan de hoeveelheid er van het voedingsmiddel is. Poedermiddelen bestaan niet uit vocht, dus wordt de hoeveelheid overgeslagen
          som += object[property] * frequentie; 
        }
      } else {
        som += object[property] * frequentie / 100 * object.hoeveelheid;
      }
    }
    berekendObject[property] = som;
  }

  return berekendObject;
}

// Deze functie voegt de beide lijsten met voedingswaarden samen tot een totale berekening
export function berekenTotaal(voedingswaardeLijst) {
  var lijstEnteraal = voedingswaardeLijst.enteraal;
  var lijstParenteraal = voedingswaardeLijst.parenteraal;
  console.log("Totaal berekenen", lijstEnteraal, lijstParenteraal);
  var berekendObject = {};

  for (let item in lijstEnteraal) {
      berekendObject[item] = lijstEnteraal[item] + lijstParenteraal[item];
  }
  return berekendObject;
}


export function berekenenVoedingswaardesTabel(voedingsLijst, gewicht) {
  console.log(voedingsLijst);
  // * 10 / 10 om de afronding goed te doen
  var vochtTotaal = Math.round(voedingsLijst.hoeveelheid * 10) / 10;
  var vochtKGPerDag = Math.round((vochtTotaal / gewicht) * 10) / 10;
  var vochtKGPerUur = Math.round(vochtKGPerDag / 24 * 10) / 10;
  var calorieënTotaal = Math.round(voedingsLijst.calorieën * 10) / 10;
  var calorieënPerKG = Math.round((calorieënTotaal / gewicht) * 10) / 10;
  var koolhydraten = Math.round((voedingsLijst.koolhydraten / 1.44 / gewicht) * 10) / 10;
  var eiwitten = Math.round((voedingsLijst.eiwitten / gewicht) * 10) / 10;
  var vetten = Math.round((voedingsLijst.vetten / gewicht) * 10) / 10;
  var natrium = Math.round((voedingsLijst.natrium / gewicht) * 10) / 10;
  var kalium = Math.round((voedingsLijst.kalium / gewicht) * 10) / 10;

  var returnObject =
    {
      vochtTotaal: vochtTotaal,
      vochtKGPerDag: vochtKGPerDag,
      vochtKGPerUur: vochtKGPerUur,
      calorieënTotaal: calorieënTotaal,
      calorieënPerKG: calorieënPerKG,
      koolhydraten: koolhydraten,
      eiwitten: eiwitten,
      vetten: vetten,
      natrium: natrium,
      kalium: kalium
    }
    for (let item in returnObject) {
      if (isNaN(returnObject[item])) {
        console.log(returnObject[item], "NaN")
        returnObject[item] = 0;
      }
    }
  
    return returnObject;
}

