

// Haalt alle opgeslagen keys uit de local storage en returnt deze in een array.
export const getLocalStoredData = () => {
  try {
    var opgeslagenPatienten = Object.keys(localStorage);
  } catch (err) {
    alert("er is een fout opgetreden", err);
  }
  return opgeslagenPatienten.filter((patient) =>
    patient.includes("NutriCalc-patient"),
  );
};

// Deze functie haalt de benodigde data van een patiënt op, zodat deze weergegeven kan worden op de website
export const getPatientData = (key) => {
  let patientData;
  if (!localStorage) {
    // Geeft een foutmelding als de local storage niet toegankelijk is en kapt de functie af
    alert(
      "De applicatie heeft geen toegang tot de local storage. Pas de instellingen aan of vraag hulp aan een beheerder.",
    );
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
  return patientData;
};

// Slaat de huidige ingevulde gegevens op de website op onder een patiënt, met als key de geboortedatum van de patiënt.
export const storePatientData = (key, patientData) => {
  if (!localStorage) return;

  try {
    return localStorage.setItem(
      "NutriCalc-patient: " + key,
      JSON.stringify(patientData)
    ); // NutriCalc-patient wordt toegevoegd, zodat deze een unique identifier hebben voor de applicatie
  } catch (err) {
    alert(`Error storing item ${key} to localStorage`, err);
  }

};

// Verwijdert de patiënt die opgeslagen is onder de meegegeven key
export const removePatientData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    alert(`${key} kon niet verwijderd worden`, err);
  }
}