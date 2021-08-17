const cmbCountry = document.getElementById("cmbCountry");
const dateStart = document.getElementById("date_start");
const dateEnd = document.getElementById("date_end");
const typeData = document.getElementById("cmbData");
let chartLine;

document.getElementById("filtro").addEventListener("click", async () => {
  if (formularioValido()) {
    await getDataCountry(cmbCountry.value, dateStart.value, dateEnd.value).then(
      (res) => {
        renderResult(res.data);
      }
    );
  }
});

async function renderResult(data) {
  renderTotalCountry(data);
  renderChart(data);
}

function renderTotalCountry(data) {
  const totalCountry = data[data.length - 1];

  document.getElementById("kpiconfirmed").textContent =
    totalCountry.Confirmed.toLocaleString("pt-BR");

  document.getElementById("kpideaths").textContent =
    totalCountry.Deaths.toLocaleString("pt-BR");

  document.getElementById("kpirecovered").textContent =
    totalCountry.Recovered.toLocaleString("pt-BR");
}

function renderChart(data) {
  const labels = [];
  const values = [];
  const average = [];

  for (let i = 1; i < data.length; i++) {
    labels.push(dateFns.format(dateFns.addDays(data[i].Date, 1), "DD-MM-YYYY"));
    if (typeData.value == "Deaths") {
      values.push(data[i].Deaths - data[i - 1].Deaths);
      average.push(
        (data[data.length - 1].Deaths - data[0].Deaths) / (data.length - 1)
      );
    } else if (typeData.value == "Confirmed") {
      values.push(data[i].Confirmed - data[i - 1].Confirmed);
      average.push(
        (data[data.length - 1].Confirmed - data[0].Confirmed) /
          (data.length - 1)
      );
    } else {
      values.push(data[i].Recovered - data[i - 1].Recovered);
      average.push(
        (data[data.length - 1].Recovered - data[0].Recovered) /
          (data.length - 1)
      );
    }
  }

  if (chartLine) {
    chartLine.destroy();
  }

  chartLine = new Chart(document.getElementById("linhas"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `New - ${typeData.value}`,
          data: values,
          backgroundColor: "#aaa",
          borderColor: "#ffa500",
        },
        {
          label: `Period Average - ${typeData.value}`,
          data: average,
          backgroundColor: "#aaa",
          borderColor: "#f00",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `${typeData.value}`,
        },
      },
    },
  });
}

function formularioValido() {
  if (cmbCountry.value && dateStart.value && dateEnd.value) {
    return true;
  } else {
    alert("Enter all required fields and valid dates.");
    return false;
  }
}

(async function init() {
  await getCountries().then((res) => {
    renderCountries(res.data);
  });
})();

function renderCountries(countries) {
  countries.sort((a, b) => {
    if (a.Slug > b.Slug) {
      return 1;
    } else if (a.Slug < b.Slug) {
      return -1;
    } else {
      return 0;
    }
  });

  for (const item of countries) {
    const option = document.createElement("option");
    option.textContent = item.Country;
    option.value = item.Slug;
    cmbCountry.appendChild(option);
  }
}
