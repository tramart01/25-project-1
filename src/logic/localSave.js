// Haalt alle opgeslagen keys uit de local storage en returnt deze in een array.
export const getLocalStoredData = () => {
  try {
    var opgeslagenPatienten = Object.keys(localStorage);
  } catch (err) {
    console.error("er is een fout opgetreden", err);
  }
  return opgeslagenPatienten.filter((patient) =>
    patient.includes("NutriCalc-patient"),
  );
};

// Deze functie haalt de benodigde data van een patiënt op, zodat deze weergegeven kan worden op de website
export const getPatientData = (key) => {
  console.log(localStorage);
  let patientData;
  if (!localStorage) { // Geeft een foutmelding als de local storage niet toegankelijk is en kapt de functie af
      alert("De applicatie heeft geen toegang tot de local storage. Pas de instellingen aan of vraag hulp aan een beheerder.");
    return;
  }

  try {
    patientData = JSON.parse(localStorage.getItem(key));
  } catch (err) {
    alert(
      `Er is een fout opgetreden met het ophalen van ${key} from localStorage`,
      err,
    );
  }
  var datumNu = new Date();
  patientData.datumLaatstBewerkt = datumNu.toLocaleString(); // update de laatst bewerkt datum
  return patientData;
};

// Slaat de huidige ingevulde gegevens op de website op onder een patiënt, met als key de geboortedatum van de patiënt.
export const storePatientData = (key, patientData) => {
  if (!localStorage) return;

  var datumNu = new Date();
  patientData.datumLaatstBewerkt = datumNu.toLocaleString();

  try {
    return localStorage.setItem(
      "Nutrilator-patient: " + key,
      JSON.stringify(patientData),
    ); // "Nutrilator-patient wordt toegevoegd, zodat deze een unique identifier hebben voor de applicatie"
  } catch (err) {
    console.error(`Error storing item ${key} to localStorage`, err);
  }
};

export const checkStoredData = () => {
  var opgeslagenPatienten = getLocalStoredData();
  for (let key in opgeslagenPatienten) {
    let patientData;
    try {
      patientData = JSON.parse(localStorage.getItem(key));
    } catch (err) {
      alert("De localstorage kon niet bereikt worden.")
    };
    if (patientData.datumLaatstBewerkt ) {
      
    }
  }
}

const berekenTijdVerstreken = (datum) => {
  
}