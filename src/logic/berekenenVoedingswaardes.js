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
  var vochtTotaal = voedingsLijst.hoeveelheid;
  var vochtKGPerDag = vochtTotaal / gewicht;
  var vochtKGPerUur = vochtKGPerDag / 24;
  var calorieënTotaal = voedingsLijst.calorieën;
  var calorieënPerKG = calorieënTotaal / gewicht;
  var koolhydraten = voedingsLijst.koolhydraten / 1.44 / gewicht;
  var eiwitten = voedingsLijst.eiwitten / gewicht;
  var vetten = voedingsLijst.vetten / gewicht;
  var natrium = voedingsLijst.natrium / gewicht;
  var kalium = voedingsLijst.kalium / gewicht;
  
  return (
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
    });
}

