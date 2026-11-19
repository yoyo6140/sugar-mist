<template>
  
    <DashNavbar></DashNavbar>
    <router-view />

  
  
</template>

<script setup>
import { provide } from 'vue'
import DashNavbar from '@/components/DashNavbar.vue'
import emitter from '@/methods/emitter'

provide('emitter', emitter)
</script>

<style>

</style>