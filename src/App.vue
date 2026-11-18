<template>
  <router-view />
  <message-toast />

</template>

<script setup>
import MessageToast from '@/components/MessageToast.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
