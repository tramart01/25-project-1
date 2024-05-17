export const getLocalStoredData = () => {
  let opgeslagenData = [];
  try {
    var opgeslagenPatienten = Object.keys(localStorage);
  } catch (err) {
    console.error('er is een fout opgetreden', err)
  }
  return opgeslagenPatienten.filter(patient => patient.includes("Nutrilator-patient"));
}

// Aanpassen zodat het het laatste item in de localstorage ophaalt
export const getPatientData = (key) => {
  console.log(localStorage);
  let data;
  if (!localStorage) {
    console.log("Local storage is niet beschikbaar")
    return;
  }

  try {
    data = JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.error(`Er is een fout opgetreden met het ophalen van ${patientData} from localStorage`, err);
  }
  console.log("Patientdata succesvol geladen", data);
  return data;
};

// Aanpassen zodat het werkt met onze applicatie
export const storePatientData = (key, patientData) => {
  if (!localStorage) return;

  try {
    return localStorage.setItem('Nutrilator-patient: ' + key, JSON.stringify(patientData)); // "Nutrilator-patient wordt toegevoegd, zodat deze een unique identifier hebben voor de applicatie"
  } catch (err) {
    console.error(`Error storing item ${key} to localStorage`, err);
  }
};