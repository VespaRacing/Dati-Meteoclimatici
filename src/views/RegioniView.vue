<template>
  <div>
    <h3>Temperatura Per Regione</h3>
    <table v-if="regioni.length">
      <thead>
        <tr>
          <th>Città</th>
          <th>Temperatura Media (°C)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in regioni" :key="index">
          <td>{{ item.regione }}</td>
          <td>{{ item.temps.reduce((a, b) => a + b, 0) / item.temps.length }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Bar Chart for Top 10 Temperatures -->
    <apexchart type="bar" :options="chartOptions" :series="chartSeries" height="350">
    </apexchart>
  </div>

  <div>
    <h3>Precipitazioni Per Regione</h3>
    <table v-if="regioni.length">
      <thead>
        <tr>
          <th>Città</th>
          <th>Precipitazioni Medie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in regioni" :key="index">
          <td>{{ item.regione }}</td>
          <td>{{ item.precips.reduce((a, b) => a + b, 0) / item.precips.length }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Bar Chart for Top 10 Temperatures -->
    <apexchart type="bar" :options="precChartOptions" :series="precChartSeries" height="350">
    </apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'ClassificaView',
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      temps: [],
      precips: [],
      chartOptions: {
        chart: {
          height: 350,
          type: 'bar'
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        dataLabels: {
          enabled: false  // Correct placement to disable data labels
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Temperatura (°C)'
          }
        }
      },
      chartSeries: [{
        name: 'Temperatura Media',
        data: []
      }],
      precChartOptions: {
        chart: {
          height: 350,
          type: 'bar'
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        dataLabels: {
          enabled: false  // Correct placement to disable data labels
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Precipitazioni'
          }
        }
      },
      precChartSeries: [{
        name: 'Precipitazioni',
        data: []
      }],
      jsonRegioni: {
        "Lombardia": [
          "Milano",
          "Bergamo",
          "Brescia",
          "Como",
          "Pavia",
          "Sondrio"
        ],
        "Lazio": [
          "Roma",
          "Latina",
          "Frosinone",
          "Viterbo",
          "Rieti"
        ],
        "Campania": [
          "Napoli",
          "Salerno",
          "Caserta",
          "Benevento",
          "Avellino"
        ],
        "Sicilia": [
          "Palermo",
          "Catania",
          "Messina",
          "Siracusa",
          "Trapani"
        ],
        "Veneto": [
          "Venezia",
          "Verona",
          "Padova",
          "Vicenza",
          "Treviso",
          "Belluno"
        ],
        "Piemonte": [
          "Torino",
          "Novara",
          "Cuneo",
          "Asti",
          "Alessandria",
          "Biella"
        ],
        "Toscana": [
          "Firenze",
          "Pisa",
          "Siena",
          "Lucca",
          "Arezzo",
          "Grosseto"
        ],
        "Emilia-Romagna": [
          "Bologna",
          "Modena",
          "Parma",
          "Reggio Emilia",
          "Ferrara",
          "Ravenna"
        ],
        "Puglia": [
          "Bari",
          "Taranto",
          "Foggia",
          "Lecce",
          "Brindisi",
          "Barletta"
        ],
        "Calabria": [
          "Reggio Calabria",
          "Catanzaro",
          "Cosenza",
          "Crotone",
          "Vibo Valentia"
        ],
        "Liguria": [
          "Genova",
          "La Spezia",
          "Savona",
          "Imperia"
        ],
        "Marche": [
          "Ancona",
          "Pesaro",
          "Macerata",
          "Ascoli Piceno",
          "Fermo"
        ],
        "Abruzzo": [
          "L'Aquila",
          "Pescara",
          "Teramo",
          "Chieti"
        ],
        "Friuli-Venezia Giulia": [
          "Trieste",
          "Udine",
          "Gorizia",
          "Pordenone"
        ],
        "Trentino-Alto Adige": [
          "Trento",
          "Bolzano"
        ],
        "Umbria": [
          "Perugia",
          "Terni"
        ],
        "Basilicata": [
          "Potenza",
          "Matera"
        ],
        "Sardegna": [
          "Cagliari",
          "Sassari",
          "Olbia",
          "Oristano",
          "Nuoro"
        ],
        "Valle d'Aosta": [
          "Aosta"
        ],
        "Molise": [
          "Campobasso",
          "Isernia"
        ]
      },
      regioni: []
    };
  },
  async mounted() {
    for (const region in this.jsonRegioni) {
      var array = []
      this.jsonRegioni[region].forEach(città => {
        array.push(città)
      })
      this.regioni.push({ regione: region, città: array, temps: [], precips: [] })
    }
    this.loadData();
  },
  methods: {
    async loadData() {
      let storedTemps = localStorage.getItem('temperatureData');
      this.temps = JSON.parse(storedTemps);

      let storedPrecs = localStorage.getItem('precipitationData');
      this.precips = JSON.parse(storedPrecs);

      let pos = 0;
      this.temps.forEach(datiCittà => {
        if (pos > 0) {
          datiCittà.forEach(datoCittà => {
            if (typeof datoCittà === 'number' || (!isNaN(parseFloat(datoCittà)) && isFinite(datoCittà))) {
              datoCittà = Number(datoCittà);
              this.regioni.forEach(regione => {
                regione.città.forEach(città => {
                  if (città == datiCittà[0]) {
                    console.log(datiCittà[0] + " è in " + regione.regione)
                    regione.temps.push(datoCittà);
                  }
                })
              })
            }
          })
        }
        else {
          pos++;
        }
      })

      pos = 0;
      this.precips.forEach(datiCittà => {
        if (pos > 0) {
          datiCittà.forEach(datoCittà => {
            if (typeof datoCittà === 'number' || (!isNaN(parseFloat(datoCittà)) && isFinite(datoCittà))) {
              datoCittà = Number(datoCittà);
              this.regioni.forEach(regione => {
                regione.città.forEach(città => {
                  if (città == datiCittà[0]) {
                    console.log(datiCittà[0] + " è in " + regione.regione)
                    regione.precips.push(datoCittà);
                  }
                })
              })
            }
          })
        }
        else {
          pos++;
        }
      })
      this.mostraPrecipitazioni(this.regioni);
      this.mostraTemperatureData(this.regioni);
    },
    mostraTemperatureData(data) {
      if (data.length > 1) {
        // Update chart data
        console.log(data)
        this.chartOptions.xaxis.categories = data.map(item => item.regione)
        this.chartSeries[0].data = data.map(item => item.temps.reduce((a, b) => a + b, 0) / item.temps.length);
      }
    },
    mostraPrecipitazioni(data) {
      if (data.length > 1) {
        // Update chart data
        console.log(data)
        this.precChartOptions.xaxis.categories = data.map(item => item.regione)
        this.precChartSeries[0].data = data.map(item => item.precips.reduce((a, b) => a + b, 0) / item.precips.length);
      }
    }
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
