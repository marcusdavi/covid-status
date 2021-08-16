const api = axios.create({
  baseURL: 'https://api.covid19api.com'
  });

async function getSummary(){
  try {
    return await api.get('summary');
  } catch (error) {
    console.error(error);
  }
}

async function getCountries(){
  try {
    return await api.get('countries');
  } catch (error) {
    console.error(error);
  }
}

async function getDataCountry(country, start, end) {
  try{
    const dateStartAux = new Date(start);
    const dateEnd = new Date(end);
    const dateStart = new Date(dateStartAux - 1 * 24 * 60 * 60 * 1000);
    dateStart.setUTCHours(0, 0, 0, 0);
    dateEnd.setUTCHours(0, 0, 0, 0);
    return await api.get(`total/country/${country}?from=${dateStart.toISOString()}&to=${dateEnd.toISOString()}`
    );  
  } catch (error) {
    console.error(error);
  }

}