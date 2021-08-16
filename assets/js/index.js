const confirmedSummary = document.getElementById("confirmed");
const deathSummary = document.getElementById("death");
const recoveredsummary = document.getElementById("recovered");
const updateDate = document.getElementById("date");
let dataSummary, dataGlobal;

(async function init() {
  await getSummary().then((res) => {
    dataSummary = res.data;
    dataGlobal = dataSummary.Global;
    confirmedSummary.textContent = dataGlobal.TotalConfirmed.toLocaleString("pt-BR");
    deathSummary.textContent = dataGlobal.TotalDeaths.toLocaleString("pt-BR");
    recoveredsummary.textContent = dataGlobal.TotalRecovered.toLocaleString("pt-BR");
    updateDate.textContent = `Data de atualização: ${dateFns.format(dataGlobal.Date, "DD/MM/YYYY HH:MM:ss")}`;
    loadChartPizza();
    loadTopTen();
  });
})();

function loadTopTen(){
  countries = dataSummary.Countries;
  countries.sort((a,b) => {
        if(a.TotalDeaths < b.TotalDeaths) {
          return 1;
        } else if (a.TotalDeaths > b.TotalDeaths){
          return -1
        } else {
          return 0;
        }
  });

  countriesTopTen = _.dropRight(countries, countries.length - 10);
    loadChartTopTen(countriesTopTen);
}

async function loadChartPizza() {
    new Chart(document.getElementById("pizza"), {
    type: 'pie',
    data: {
        labels: ['Confirmed', 'Deaths', 'Recovery'],
        datasets: [{
            label: 'Vendas',
            data: [dataGlobal.NewConfirmed, dataGlobal.NewDeaths, dataGlobal.NewRecovered],
            backgroundColor: ['#0f0', '#f00', '#00f']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: "Distribuição de novos casos"
            }
        }
    }
});
}

function loadChartTopTen(countries){
    const labels = [];
    const values = [];

    for (const country of countries) {
        labels.push(country.Country);
        values.push(country.TotalDeaths);
    }

    new Chart(document.getElementById("barras"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total de Mortes',
                data: values,
                backgroundColor: '#7a1cd3'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: "Total de mortes por país = Top 10"
                }
            }
        }
    });
    }



