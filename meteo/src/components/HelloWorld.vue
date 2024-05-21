<template>
  <div>
    <div v-if="excelData.length">
      <h3>Imported Data:</h3>
      <!-- First Grid -->
      <h4>Grid 1</h4>
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in excelData[0]" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in excelData.slice(1)" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>

      <!-- First Chart -->
      <h4>Chart 1</h4>
      <apexchart type="bar" height="350" :options="chartOptions" :series="chartData.series"></apexchart>

      <!-- Second Grid (Copying data from the first for demonstration purposes) -->
      <h4>Grid 2</h4>
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in excelData[0]" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in excelData.slice(1)" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Second Chart (Copying data from the first for demonstration purposes) -->
      <h4>Chart 2</h4>
      <apexchart type="line" height="350" :options="chartOptions" :series="chartData.series"></apexchart>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      temps: [],
      prec: [],
      excelData: [],
      chartOptions: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: []
        }
      },
      chartData: {
        series: []
      }
    };
  },
  mounted() {
    this.loadExcelFile('/data.xlsx', this.temps);
    this.loadExcelFile('/precipitazioni.xlsx', this.excelData);
  },
  methods: {
    async loadExcelFile(path, array) {
      try {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        array = jsonData;
        this.processData(jsonData);
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
