<template>
  <div>
    <!-- Editable Grid for Temperature Data -->
    <div v-if="temps.length">
      <button class="button1" @click="addNewYearColumn('temp')">Nuovo Anno</button>
      <h3>Tabella Temperature:</h3>
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in temps[0]" :key="'temp-header-' + index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in temps.slice(1)" :key="'temp-row-' + rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="'temp-cell-' + cellIndex">
              <input v-model="temps[rowIndex + 1][cellIndex]" @change="saveToLocalStorage" />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Temperature Chart -->
      <apexchart type="bar" :options="tempChartOptions" :series="tempChartData"></apexchart>
    </div>

    <!-- Editable Grid for Precipitation Data -->
    <div v-if="prec.length">
      <h3>Tabella Precipitazioni:</h3>
      <button @click="addNewYearColumn('prec')">Nuovo Anno</button>
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in prec[0]" :key="'prec-header-' + index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in prec.slice(1)" :key="'prec-row-' + rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="'prec-cell-' + cellIndex">
              <input v-model="prec[rowIndex + 1][cellIndex]" @change="saveToLocalStorage" />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Precipitation Chart -->
      <apexchart type="bar" :options="precChartOptions" :series="precChartData"></apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts' // For Vue 3
import * as XLSX from "xlsx";

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      temps: [],
      prec: [],
      tempChartOptions: {
        chart: {
          id: 'tempChart',
          type: 'bar',
          height: 350
        },
        xaxis: {
          categories: []
        },
        title: {
          text: 'Grafico Temperature',
          align: 'center'
        }
      },
      tempChartData: [{
        name: 'Temperature',
        data: []
      }],
      precChartOptions: {
        chart: {
          id: 'precChart',
          type: 'bar',
          height: 350
        },
        xaxis: {
          categories: []
        },
        title: {
          text: 'Grafico Precipitazioni',
          align: 'center'
        }
      },
      precChartData: [{
        name: 'Precipitation',
        data: []
      }]
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      let storedTemps = localStorage.getItem('temperatureData');
      let storedPrec = localStorage.getItem('precipitationData');
      if (storedTemps) {
        this.temps = JSON.parse(storedTemps);
      }
      else {
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
      this.updateChartData(this.temps, this.tempChartData, this.tempChartOptions);
      if (storedPrec) {
        this.prec = JSON.parse(storedPrec);
      }
      else {
        // Load and process precipitation data
        const response2 = await fetch('/precipitazioni.xlsx');
        const arrayBuffer2 = await response2.arrayBuffer();
        const data2 = new Uint8Array(arrayBuffer2);
        const workbook2 = XLSX.read(data2, { type: 'array' });
        const firstSheetName2 = workbook2.SheetNames[0];
        const worksheet2 = workbook2.Sheets[firstSheetName2];
        const jsonData2 = XLSX.utils.sheet_to_json(worksheet2, { header: 1 });
        this.prec = jsonData2;
      }
      console.log(this.temps);
      this.updateChartData(this.prec, this.precChartData, this.precChartOptions);
    },
    saveToLocalStorage() {
      localStorage.setItem('temperatureData', JSON.stringify(this.temps));
      localStorage.setItem('precipitationData', JSON.stringify(this.prec));
      this.updateChartData(this.temps, this.tempChartData, this.tempChartOptions);
      this.updateChartData(this.prec, this.precChartData, this.precChartOptions);
    },
    updateChartData(data, chartDataArray, options) {
      if (data.length > 1) {
        options.xaxis.categories = data.slice(1).map(item => item[0]);
        chartDataArray[0].data = data.slice(1).map(item => parseFloat(item[1]));
      }
    },
    addNewYearColumn(table) {
      if (table == "temp") {
        var pos = 0;
        this.temps.forEach(item => {
          if (pos == 0) {
            item.push(this.temps[0][this.temps[0].length - 1] + 1);
            pos++;
          }
          else {
            item.push(0);
          }
        })
      }
      else {
        var pos2 = 0;
        this.prec.forEach(item => {
          if (pos2 == 0) {
            item.push(this.prec[0][this.prec[0].length - 1] + 1);
            pos2++;
          }
          else {
            item.push(0);
          }
        })
      }
      this.saveToLocalStorage();
      this.updateChartData(this.temps, this.tempChartData, this.tempChartOptions);
      this.updateChartData(this.prec, this.precChartData, this.precChartOptions);
    }
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

input {
  width: 100%;
  border: none;
  background-color: transparent;
}

button {
  padding: 5px 15px;
  background: #ccc;
  border: 0 none;
  margin-left: -1300px;
  margin-bottom: 30px;
  height: 50px;
  cursor: pointer;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

button1 {
  padding: 5px 15px;
  background: #ccc;
  border: 0 none;
  margin-bottom: 30px;
  height: 50px;
  cursor: pointer;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
</style>
