<template>
  <div>

    <template #layers>
      <Grid strokeDasharray="2,2" />
      <Bar :dataKeys="['name', 'pl']" :barStyle="{ fill: '#90e0ef' }" />
      <Bar :dataKeys="['name', 'avg']" :barStyle="{ fill: '#0096c7' }" />
      <Bar :dataKeys="['name', 'inc']" :barStyle="{ fill: '#48cae4' }" />
      <Marker :value="1000" label="Avg." color="#e76f51" strokeWidth="2" strokeDasharray="6 6" />
    </template>

    <template #widgets>
      <Tooltip
        borderColor="#48CAE4"
        :config="{
          pl: { color: '#90e0ef' },
          avg: { color: '#0096c7' },
          inc: { color: '#48cae4' }
        }"
      />
    </template>
    </div>


    <!-- Temperature Data Grid -->
    <div v-if="this.temps">
      <h3>Temperature Registrate</h3>
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in temps[0]" :key="'temp-header-' + index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in temps.slice(1)" :key="'temp-row-' + rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="'temp-cell-' + cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Precipitation Data Grid -->
    <div v-if="this.prec">
      <h3>Precipitazioni Medie Registrate</h3>
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in prec[0]" :key="'prec-header-' + index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in prec.slice(1)" :key="'prec-row-' + rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="'prec-cell-' + cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
//import VueApexCharts from 'vue3-apexcharts'
import * as XLSX from 'xlsx';

export default {
  components: {
    //apexchart: VueApexCharts,
  },
  data() {
    return {
      temps: [],
      prec: [],
      chartOptions: {
        chart: {
          toolbar: {
            show: true
          }
        },
        xaxis: {
          categories: []
        }
      },
      chartData: {
        temps: [],
        prec: []
      }
    };
  },
  mounted() {
    this.loadExcelFile();
  },
  methods: {
    async loadExcelFile() {
      try {
        const response = await fetch('/data.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.temps = jsonData;
        this.processData(jsonData);

        
        const response2 = await fetch('/precipitazioni.xlsx');
        const arrayBuffer2 = await response2.arrayBuffer();
        const data2 = new Uint8Array(arrayBuffer2);
        const workbook2 = XLSX.read(data2, { type: 'array' });
        const firstSheetName2 = workbook2.SheetNames[0];
        const worksheet2 = workbook2.Sheets[firstSheetName2];
        const jsonData2 = XLSX.utils.sheet_to_json(worksheet2, { header: 1 });
        this.prec = jsonData2;
        this.processData(jsonData2);

        console.log(this.temps);
        console.log(this.prec);
      } catch (error) {
        console.error("Error loading or processing the Excel file:", error);
      }
    },
    processData(data) {
      // Check if data is valid and has the correct structure
      if (data.length > 1) {
        const categories = data.slice(1).map(row => row[0]);
        const seriesData = data.slice(1).map(row => row[1]);

        // Remove any undefined values
        const filteredCategories = categories.filter(item => item !== undefined);
        const filteredSeriesData = seriesData.filter(item => item !== undefined);

        this.chartOptions.xaxis.categories = filteredCategories;
        this.chartData = {
          series: [{
            name: 'Serie 1',
            data: filteredSeriesData
          }]
        };
      } else {
        console.error("Invalid data format in Excel file");
      }
    }
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
</style>