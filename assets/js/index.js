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
    updateDate.textContent = `Update Date: ${dateFns.format(dataGlobal.Date, "DD/MM/YYYY HH:MM:ss")}`;
    loadChartPizza();
    loadTopTen();
  });
})();

function loadTopTen(){
  countries = _.orderBy(dataSummary.Countries, ["TotalDeaths"], ["desc"]);
  countriesTopTen = _.take(countries, 10);
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
                text: "Distribution - New Cases"
            }
        }
    }
});
}

function loadChartTopTen(countries){
    const labels = [];
    const values = [];

    for (let country of countries) {
        labels.push(country.Country);
        values.push(country.TotalDeaths);
    }

    new Chart(document.getElementById("barras"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Deaths',
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
                    text: "Total Deaths by Country = Top 10"
                }
            }
        }
    });
    }



