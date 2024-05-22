<template>
  <div>
    <h3>Top 10 Città Più Calde</h3>
    <table v-if="topTemps.length">
      <thead>
        <tr>
          <th>Città</th>
          <th>Temperatura (°C)</th>
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
    <apexchart
      type="bar"
      :options="chartOptions"
      :series="chartSeries"
      height="350">
    </apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import * as XLSX from "xlsx";

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
        dataLabels: {
          enabled: false  // Correct placement to disable data labels
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
      }]
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      let storedTemps = localStorage.getItem('temperatureData');
      if (storedTemps) {
        this.temps = JSON.parse(storedTemps);
      }
      else{
          // Load and process temperature data
        const response = await fetch('/data.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.temps = jsonData;
      }
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
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>
