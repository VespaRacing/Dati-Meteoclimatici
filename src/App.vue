<template>
  <nav>
    <button class="button-link" @click="navigateTo('/')">Dati Grafici</button> |
    <button class="button-link" @click="navigateTo('/classifica')">Classifica</button> |
    <button class="button-link" @click="navigateTo('/regioni')">Regioni</button>
  </nav>
  <router-view/>
</template>

<script>
export default {
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  font-size: 30px;
}

nav button {
  font-weight: bold;
  color: #2c3e50;
  height: 40px;
  width: 100px;
  border-radius: 10px;
}

/* You can customize the active button style if needed */
/* nav button.router-link-exact-active {
  color: #42b983;
} */
</style>
