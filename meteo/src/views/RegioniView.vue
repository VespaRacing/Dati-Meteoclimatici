<template>
  <div>
    <h3>Top 10 Cities by Temperature</h3>
    <table v-if="topTemps.length">
      <thead>
        <tr>
          <th>City</th>
          <th>Temperature (°C)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in topTemps" :key="index">
          <td>{{ item.city }}</td>
          <td>{{ item.temperature }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <p>No data available or still loading...</p>
    </div>

    <!-- Bar Chart for Top 10 Temperatures -->
    <apexchart type="bar" :options="chartOptions" :series="chartSeries" height="350">
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
      topTemps: [],  // Array to hold the top 10 cities by temperature
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
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Temperature (°C)'
          }
        }
      },
      chartSeries: [{
        name: 'Temperature',
        data: []
      }],
      jsonRegioni: {},
      regioni: []
    };
  },
  async mounted() {
    fetch('regioni.json')
      .then(response => response.json())
      .then(data => {
        for (let region in data) {
          this.regioni.push({ region: region, cities: data[region], temps: [] });
        }
      })
      .catch(error => console.error('Error reading the file:', error));
    this.loadData();
  },
  methods: {
    async loadData() {
      let storedTemps = localStorage.getItem('temperatureData');
      this.temps = JSON.parse(storedTemps);

      this.temps.forEach(item2 => {
        item2.forEach(item => {
          if (!isNaN(item)) {
            this.regioni.forEach(regione => {
              console.log(regione)
              regione.cities.forEach(città => {
                console.log(città);
                if (città == item2[0]) {
                  console.log("contiene")
                  let count = 0;
                  item.forEach(temperatura => {
                    if (count != 0) {
                      regione.temps.push(temperatura)
                    }
                    else {
                      count++;
                    }
                  })
                }
              })
            })
          }
        })
      })
      this.processTemperatureData(this.temps);
    },
    processTemperatureData(data) {
      if (data.length > 1) {
        const cityTemperatureData = data.slice(1).map(item => ({
          city: item[0],
          temperature: parseFloat(item[1])
        }));
        this.topTemps = cityTemperatureData.sort((a, b) => b.temperature - a.temperature).slice(0, 10);

        // Update chart data
        this.chartOptions.xaxis.categories = this.topTemps.map(item => item.city);
        this.chartSeries[0].data = this.topTemps.map(item => item.temperature);
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
